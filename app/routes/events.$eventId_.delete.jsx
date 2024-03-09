import {
  Link,
  Links,
  Meta,
  Scripts,
  isRouteErrorResponse,
  json,
  redirect,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";

export async function action({ request, params }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/events",
  });

  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });

  if (user._id !== event.user._id.toString()) {
    throw new Response("", { status: 401, statusText: "Unauthorized" });
  }
  await eventModel.deleteOne({ _id: params.eventId });

  return redirect("/profile");
}

export async function loader({ request, params }) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/events" });
  console.log(params.eventId);
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
      ) : null}
    </div>
  );
}
