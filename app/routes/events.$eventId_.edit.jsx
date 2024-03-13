import {
  Link,
  isRouteErrorResponse,
  json,
  redirect,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import mongoose, { MongooseError } from "mongoose";
import CreateFormComponent from "~/components/createForm";
import { authenticator } from "~/services/auth.server";
import invariant from "tiny-invariant";

export async function loader({ params, request }) {
  invariant(params.eventId, "Missing eventId param");

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/events",
  });

  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });

  if (user._id !== event?.user._id.toString()) {
    throw new Response("Permission Denied", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  return json({ event });
}

export async function action({ request, params }) {
  invariant(params.eventId, "Missing eventId param");

  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });

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

    event.title = data.title;
    event.date = data.date;
    event.time = data.time;
    event.location = data.location;
    event.description = data.description;

    await event.save();

    return redirect(`/events/${params.eventId}`);
  } catch (err) {
    const errors = err.errors;

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

export default function EditEventPage() {
  const { event } = useLoaderData();
  return (
    <CreateFormComponent
      form_type="Edit"
      form_title="Edit Event"
      event={event}
    />
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
      ) : error.status === 401 ? (
        <p>
          {error.data}. Go to {" --> "} <Link to="/events">Events</Link>
        </p>
      ) : (
        <p>Invalid EventId</p>
      )}
    </div>
  );
}
