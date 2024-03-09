import { Link, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { commitSession, getSession } from "~/services/sessions.server";
import { authenticator } from "~/services/auth.server";
import { json } from "@remix-run/react";
import FormComponent from "~/components/form";
import InputComponent from "~/components/input";
import { useState } from "react";

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const session = await getSession(request.headers.get("Cookie"));

  const error = session.get("sessionErrorKey");
  // console.log(error);

  if (user && error) {
    session.set(authenticator.sessionErrorKey, null);
  }

  return json(
    { error },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export async function action({ request }) {
  await authenticator.authenticate("user-pass", request, {
    successRedirect: "/profile",
    failureRedirect: "/signin",
  });

  return null;
}

export default function SigninPage() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const { error } = useLoaderData();

  console.log(`username: ${username}`);
  console.log(`password: ${password}`);

  return (
    <div className="form-section">
      <FormComponent title={`Welcome to Signin Page`} method="post">
        <InputComponent
          name="username"
          onChangeHandler={(e) => setUsername(e.target.value)}
          defaultValue={username}
        >
          Username
        </InputComponent>
        <InputComponent
          name="password"
          type="password"
          onChangeHandler={(e) => setPassword(e.target.value)}
          defaultValue={password}
        >
          Password
        </InputComponent>
        <div>
          <button type="submit">Sign In</button>
          <Link to="/signup">
            <button type="button">Sign Up</button>
          </Link>
        </div>
        <div>{error ? error?.message : null}</div>
      </FormComponent>
    </div>
  );
}
