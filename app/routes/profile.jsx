import { Form, Link, json, useLoaderData } from "@remix-run/react";
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

  let enrolls = await mongoose.models.User.find({ _id: user._id })
    .populate("events")
    .select("events -_id")
    .exec();

  [enrolls] = enrolls; // destructuring
  ({ events: enrolls } = enrolls); // destructuring

  return json({ user, events, enrolls });
}

export default function ProfilePage() {
  const { user, events, enrolls } = useLoaderData();

  function handleSubmit(e, text) {
    if (!confirm(`Confirm To ${text} Event`)) {
      e.preventDefault();
    }
  }

  const listEvents = events.map((e) => (
    <div key={e._id} className="event-list-main">
      <Link to={`/events/${e._id}`}>
        <div>{e.title}</div>
      </Link>
      <div className="flex gap-5">
        <Link to={`/events/${e._id}/edit`}>EDIT</Link> |
        <Form
          action={`/events/${e._id}/delete`}
          method="post"
          onSubmit={(e) => handleSubmit(e, "Delete")}
        >
          <button>DELETE</button>
        </Form>
      </div>
      {/* <Form
        action={`/events/65ef248f78de63ac6ce83d47/delete`}
        method="post"
        onSubmit={(e) => handleSubmit(e, "Delete")}
      >
        <button>DELETE</button>
      </Form> */}
    </div>
  ));

  const listEnrolls = enrolls.map((e) => (
    <div key={e._id} className="event-list-main">
      <Link to={`/events/${e._id}`}>
        <div>{e.title}</div>
      </Link>
      <div>
        <Form
          action={`/events/${e._id}/enroll-cancel`}
          method="post"
          onSubmit={(e) => handleSubmit(e, "Cancel Registration For")}
        >
          <button>Cancel Enrollment</button>
        </Form>
      </div>
    </div>
  ));

  return (
    <div>
      <h1 className="profile-welcome">
        Welcome, {user.firstName} {user.lastName} ({user.username})
      </h1>
      <div className="event-list">
        <div>
          <h3>YOUR EVENTS</h3>
          <div>{listEvents}</div>
        </div>
        <div>
          <h3>YOUR ATTENDANCES</h3>
          <div>{listEnrolls}</div>
        </div>
      </div>
    </div>
  );
}
