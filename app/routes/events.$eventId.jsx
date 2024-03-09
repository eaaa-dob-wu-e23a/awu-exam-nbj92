import { Form, Link, json, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";

export async function loader({ request, params }) {
  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });

  const user = await authenticator.isAuthenticated(request);

  //   console.log(event.user.toString() === user?._id);
  //   console.log(event.user._id);
  // console.log(user?._id);
  // console.log(event?.user?._id);
  // console.log(user?._id === event.user._id);

  return json({ event, user });
}

export default function EventDetailPage() {
  const { event, user } = useLoaderData();
  // console.log(user?._id);
  // console.log(event?.user?._id);
  // console.log(user?._id === event.user._id);

  function handleSubmit(e) {
    if (!confirm("Confirm To Delete Event")) {
      e.preventDefault();
    }
  }

  return (
    <div>
      <h1>{event.title}</h1>
      {user?._id === event.user._id ? (
        <>
          <Form action="delete" method="post" onSubmit={handleSubmit}>
            <Link to="edit">
              <button className="btn" type="button">
                Edit
              </button>
            </Link>{" "}
            <button className="btn">Delete</button>
          </Form>
        </>
      ) : null}
    </div>
  );
}
