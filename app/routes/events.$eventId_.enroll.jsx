import { redirect } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";

export async function action({ request, params }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const eventModel = mongoose.models.Event;
  const userModel = mongoose.models.User;

  const event = await eventModel.findById({ _id: params.eventId });
  event.participants.push(user);
  await event.save();

  const userDB = await userModel.findById({ _id: user._id });
  userDB.events.push(event._id);
  await userDB.save();

  return redirect(`/events/${params.eventId}`);
}
