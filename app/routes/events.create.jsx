import { redirect, json } from "@remix-run/react";
import mongoose, { MongooseError } from "mongoose";
import CreateFormComponent from "~/components/createForm";
import { authenticator } from "~/services/auth.server";

export async function action({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/events",
  });
  const error = {};
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    if (typeof data.title !== "string") {
      error.title = "Title must be a string";
    }
    if (typeof data.date !== "string") {
      error.date = "Date must be a string";
    }
    if (typeof data.time !== "string") {
      error.time = "Time must be a string";
    }
    if (typeof data.location !== "string") {
      error.location = "Location must be a string";
    }
    if (typeof data.description !== "string") {
      error.description = "Description must be a string";
    }

    if (Object.keys(error).length > 0) {
      return json(error);
    }

    console.log(user);

    if (data.description.length === 0) {
      data.description = undefined;
    }

    data.user = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    console.log(data);

    const eventModel = mongoose.models.Event;
    await eventModel.create(data);

    return redirect("/events");
  } catch (err) {
    const errors = err.errors;

    console.log(err);

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

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/events",
  });
}

export default function EventCreatePage() {
  return (
    <CreateFormComponent form_type="Create" form_title="Create A Chess Event" />
  );
}
