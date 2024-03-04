import { Authenticator } from "remix-auth";
import { sessionStorage } from "./sessions.server";
import { FormStrategy } from "remix-auth-form";
import { AuthorizationError } from "remix-auth";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

async function verifyUser(username, password) {
  const user = await mongoose.models.User.findOne({ username }).select(
    "+password",
  );

  if (!user) {
    throw new AuthorizationError("Bad Credentials: User doesn't exist.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AuthorizationError("Bad Credentials: Password incorrect.");
  }

  user.password = undefined;

  return user;
}

export let authenticator = new Authenticator(sessionStorage, {
  sessionErrorKey: "sessionErrorKey",
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let username = form.get("username");
    let password = form.get("password");

    if (!username || username?.length === 0) {
      throw new AuthorizationError("Bad Credentials: Username Required");
    }
    if (typeof username !== "string") {
      throw new AuthorizationError(
        "Bad Credentials: Username has to be a string",
      );
    }
    if (!password || password?.length === 0) {
      throw new AuthorizationError("Bad Credentials: Password Required");
    }
    if (typeof password !== "string") {
      throw new AuthorizationError(
        "Bad Credentials: Password has to be a string",
      );
    }

    return await verifyUser(username, password);
  }),
  "user-pass",
);
