import { redirect, useActionData, json } from "@remix-run/react";
import mongoose, { MongooseError } from "mongoose";
import { useState } from "react";
import FormComponent from "~/components/form";
import InputComponent from "~/components/input";

export async function action({ request }) {
  const error = {};
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    if (typeof data.username !== "string") {
      error.username = "Username must be a string";
    }
    if (typeof data.password !== "string") {
      error.password = "Password must be a string";
    }
    if (typeof data.firstName !== "string") {
      error.firstName = "Firstname must be a string";
    }
    if (typeof data.lastName !== "string") {
      error.lastName = "Lastname must be a string";
    }

    if (Object.keys(error).length > 0) {
      return json(error);
    }

    const userModel = mongoose.models.User;
    const user = await userModel.create(data);

    return redirect("/signin");
  } catch (err) {
    const errors = err.errors;

    if (err instanceof MongooseError && errors) {
      Object.keys(errors).forEach((e) => {
        error[e] = errors[e].message;
      });
      return json(error);
    } else {
      throw new Response("Bad Request", { status: 400 });
    }
  }
}

export default function SignupPage() {
  const error = useActionData();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();

  return (
    <div className="form-section">
      <FormComponent title="Welcome to Signup Page" method="post">
        <InputComponent
          name="firstName"
          defaultValue={firstname}
          onChangeHandler={(e) => setFirstname(e.target.value)}
          required={true}
        >
          First name
        </InputComponent>
        {error ? error?.firstName : null}
        <InputComponent
          name="lastName"
          defaultValue={lastname}
          onChangeHandler={(e) => setLastname(e.target.value)}
          required={true}
        >
          Last name
        </InputComponent>
        {error ? error?.lastName : null}

        <InputComponent
          name="username"
          defaultValue={username}
          onChangeHandler={(e) => setUsername(e.target.value)}
          required={true}
        >
          Username
        </InputComponent>
        {error ? error?.username : null}

        <InputComponent
          name="password"
          type="password"
          defaultValue={password}
          onChangeHandler={(e) => setPassword(e.target.value)}
          required={true}
        >
          Password
        </InputComponent>
        {error ? error?.password : null}
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </FormComponent>
    </div>
  );
}
