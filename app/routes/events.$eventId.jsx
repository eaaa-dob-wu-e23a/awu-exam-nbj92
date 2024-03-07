import { Link, json, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";

export async function loader({ request, params }) {
  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });

  const user = await authenticator.isAuthenticated(request);

  //   console.log(event.user.toString() === user?._id);
  //   console.log(event.user._id);
  //   console.log(user?._id);

  return json({ event, user });
}

export default function EventDetailPage() {
  const { event, user } = useLoaderData();
  return (
    <div>
      <h1>{event.title}</h1>
      {user?._id === event.user ? (
        <>
          <Link to="edit">
            <button class="btn">Edit</button>
          </Link>{" "}
          <Link to="delete">
            <button class="btn">Delete</button>
          </Link>
        </>
      ) : null}
    </div>
  );
}
