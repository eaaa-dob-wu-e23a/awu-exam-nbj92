import { Link, json, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { dateFormat } from "~/functions/dateFormat";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const eventModel = mongoose.models.Event;
  const events = await eventModel
    .find({ "user._id": user._id })
    .select("-user");

  // console.log(events);

  return json({ user, events });
}

export default function ProfilePage() {
  const { user, events } = useLoaderData();
  const listEvents = events.map((e) => (
    <div key={e._id}>
      <Link to={`/events/${e._id}`}>
        {e.title}, {dateFormat(new Date(e.date))}
      </Link>
    </div>
  ));
  return (
    <div>
      <h1>
        Welcome to your profile, {user.firstName} {user.lastName} (
        {user.username})
      </h1>
      <div>YOUR EVENTS</div>
      <div>{listEvents}</div>
      <div>YOUR ATTENDANCES</div>
    </div>
  );
}
