import { Link, useRouteError } from "@remix-run/react";
import mongoose from "mongoose";
import invariant from "tiny-invariant";
import { authenticator } from "~/services/auth.server";

export async function action({ request, params }) {
  invariant(params.eventId, "Missing eventId param");
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/events",
  });

  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });

  if (!event) {
    throw new Response("The event you were looking for doesn't exist.", {
      status: 404,
      statusText: "Not Found",
    });
  } else if (user?._id !== event?.user?._id.toString()) {
    throw new Response("", { status: 401, statusText: "Unauthorized" });
  }
  await eventModel.deleteOne({ _id: params.eventId });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/profile",
    },
  });
}

export async function loader({ request, params }) {
  invariant(params.eventId, "Missing eventId param");
  await authenticator.isAuthenticated(request, { failureRedirect: "/events" });
  throw new Response(params.eventId, {
    status: 405,
    statusText: "Method Not Allowed",
  });
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div>
      <h1>
        ERROR: {error.status} {error.statusText}
      </h1>

      {error.status === 401 ? (
        <p>
          You are not allowed to perform this action. Go to {" --> "}{" "}
          <Link to="/events">Events</Link>
        </p>
      ) : error.status === 405 ? (
        <p>
          In order to delete your event go to {" --> "}
          <Link to={`/events/${error.data}`}>Event Site</Link>
        </p>
      ) : error.status === 404 ? (
        <p>{error.data} </p>
      ) : null}
    </div>
  );
}
