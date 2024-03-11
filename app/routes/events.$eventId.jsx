import { Form, Link, json, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { dateFormat } from "~/functions/dateFormat";
import { authenticator } from "~/services/auth.server";

export async function loader({ request, params }) {
  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });

  const user = await authenticator.isAuthenticated(request);

  console.log(event);

  return json({ event, user });
}

export default function EventDetailPage() {
  const { event, user } = useLoaderData();

  function handleSubmit(e, text) {
    if (!confirm(`Confirm To ${text} Event`)) {
      e.preventDefault();
    }
  }

  const registered = event.participants.find((e) => e._id === user?._id);

  return (
    <div className="event-details-container">
      <div className="event-details-main">
        <h1>{event.title}</h1>
        <div className="flex flex-col gap-4">
          <span> Description</span>
          {event.description}
        </div>
      </div>
      <div className="event-details">
        <div className="event-details-btn">
          {user?._id === event.user._id ? (
            <>
              <Form
                action="delete"
                method="post"
                onSubmit={(e) => handleSubmit(e, "Delete")}
              >
                <Link to="edit">
                  <button className="btn-event" type="button">
                    Edit
                  </button>
                </Link>{" "}
                <button className="btn-event">Delete</button>
              </Form>
            </>
          ) : null}
        </div>
        <div className="event-details-info">
          <div>Location: {event.location}</div>
          <div>Date: {dateFormat(new Date(event.date))}</div>
          <div>Event Start: {event.time}</div>
        </div>
        <div className="event-">
          {user && user._id !== event.user._id ? (
            <>
              {registered ? (
                <Form
                  action="enroll-cancel"
                  method="post"
                  onSubmit={(e) => handleSubmit(e, "Cancel Registration For")}
                >
                  <button className="btn-event btn-go">
                    Cancel Enrollment
                  </button>
                </Form>
              ) : (
                <Form
                  action="enroll"
                  method="post"
                  onSubmit={(e) => handleSubmit(e, "Register For")}
                >
                  <button className="btn-event btn-go">Enroll</button>
                </Form>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
