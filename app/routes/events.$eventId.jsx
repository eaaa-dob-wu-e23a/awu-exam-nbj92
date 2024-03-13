import {
  Form,
  Link,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";
import { dateFormat } from "~/functions/dateFormat";
import { authenticator } from "~/services/auth.server";
import invariant from "tiny-invariant";

export async function loader({ request, params }) {
  invariant(params.eventId, "Missing eventId param");
  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });

  if (!event) {
    throw new Response("", { status: 404, statusText: "NOT FOUND" });
  }

  const user = await authenticator.isAuthenticated(request);

  return json({ event, user });
}

export default function EventDetailPage() {
  const { event, user } = useLoaderData();
  const [description, setDescription] = useState(true);
  const [participants, setParticipants] = useState(false);

  function handleSubmit(e, text) {
    if (!confirm(`Confirm To ${text} Event`)) {
      e.preventDefault();
    }
  }

  const participantList = event.participants.map((e) => (
    <div key={e._id}>
      {e.firstName} {e.lastName} ({e.username})
    </div>
  ));

  const registered = event.participants.find((e) => e._id === user?._id);

  return (
    <div className="event-details-container">
      <div className="event-details-main">
        <h1>{event.title}</h1>
        <div className="flex flex-col gap-4">
          <span>
            <button
              onClick={() => {
                setDescription(true);
                setParticipants(false);
              }}
              className={description ? "show" : ""}
            >
              {" "}
              Description
            </button>{" "}
            {participantList.length > 0 ? (
              <button
                onClick={() => {
                  setDescription(false);
                  setParticipants(true);
                }}
                className={participants ? "show" : ""}
              >
                Participants
              </button>
            ) : null}
          </span>
          {description
            ? event.description
            : participants
              ? participantList
              : null}
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
          <div>Creator: {event.user.username}</div>
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

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div>
      <h1>
        ERROR:{" "}
        {isRouteErrorResponse(error) ? (
          <span>
            {error.status} {error.statusText}
          </span>
        ) : (
          ""
        )}
      </h1>

      {error.status === 404 ? (
        <p>
          The Event doesn't exist. Go to {" --> "}{" "}
          <Link to="/events">Events</Link>
        </p>
      ) : (
        <p>Invalid EventId</p>
      )}
    </div>
  );
}
