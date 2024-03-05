import { json } from "@remix-run/react";
import mongoose from "mongoose";

export async function loader({ request }) {
  const eventModel = mongoose.models.Event;
  const events = await eventModel.find({});

  console.log(events);

  return json({ events });
}

export default function AllEventsPage() {
  return <h1>hva så !</h1>;
}
