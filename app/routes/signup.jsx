import { redirect } from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";
import FormComponent from "~/components/form";
import InputComponent from "~/components/input";

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  console.log(data);
  const userModel = mongoose.models.User;
  const user = await userModel.create(data);
  return null;
  return redirect("/signin");
}

export default function SignupPage() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  return (
    <div id="login">
      <FormComponent title="Welcome to Signup Page" method="post">
        <InputComponent
          name="firstName"
          defaultValue={firstname}
          onChangeHandler={(e) => setFirstname(e.target.value)}
        >
          First name
        </InputComponent>
        <InputComponent
          name="lastName"
          defaultValue={lastname}
          onChangeHandler={(e) => setLastname(e.target.value)}
        >
          Last name
        </InputComponent>
        <InputComponent
          name="username"
          defaultValue={username}
          onChangeHandler={(e) => setUsername(e.target.value)}
        >
          Username
        </InputComponent>
        <InputComponent
          name="password"
          type="password"
          defaultValue={password}
          onChangeHandler={(e) => setPassword(e.target.value)}
        >
          Password
        </InputComponent>
        <InputComponent
          name="passwordConfirm"
          type="password"
          defaultValue={passwordConfirm}
          onChangeHandler={(e) => setPasswordConfirm(e.target.value)}
        >
          Confirm Password
        </InputComponent>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </FormComponent>
    </div>
  );
}
