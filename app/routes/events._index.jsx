import { Link, json, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { dateFormat } from "~/functions/dateFormat";

export async function loader({ request }) {
  const eventModel = mongoose.models.Event;
  const events = await eventModel.find({}).populate("user");

  const eventList = events.map((e) => {
    return {
      _id: e._id,
      title: e.title,
      date: dateFormat(e.date),
      time: e.time,
      location: e.location,
      description: e.description,
      user:
        e.user.firstName + " " + e.user.lastName + " (" + e.user.username + ")",
    };
  });

  return json({ eventList });
}

export default function AllEventsPage() {
  const { eventList } = useLoaderData();

  const listEvents = eventList.map((e) => (
    <div className="event" key={e._id}>
      <Link to={e._id}>
        <div className="event-header">
          <div className="event-title">
            {e.title}
            <div>{e.location}</div>
          </div>

          <div className="event-user">
            {e.date}, {e.time} <span>{e.user}</span>
          </div>
        </div>

        <div className="event-description">
          <span>Description</span>
          {e.description}
        </div>
      </Link>
    </div>
  ));

  return <div className="event-container">{listEvents}</div>;
}
