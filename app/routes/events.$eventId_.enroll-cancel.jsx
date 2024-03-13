import { redirect } from "@remix-run/react";
import mongoose from "mongoose";
import invariant from "tiny-invariant";
import { authenticator } from "~/services/auth.server";

export async function action({ request, params }) {
  invariant(params.eventId, "Missing eventId param");
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const eventModel = mongoose.models.Event;
  const userModel = mongoose.models.User;

  const event = await eventModel.findById({ _id: params.eventId });

  const participant = event.participants.find(
    (e) => e._id.toString() === user._id,
  );
  let index = event.participants.indexOf(participant);
  event.participants.splice(index, 1);

  await event.save();

  const userDB = await userModel.findById({ _id: user._id });

  const userEvent = userDB.events.find(
    (e) => e._id.toString() === event._id.toString(),
  );
  index = userDB.events.indexOf(userEvent);
  userDB.events.splice(index, 1);

  await userDB.save();

  return redirect(`/events/${params.eventId}`);
}
