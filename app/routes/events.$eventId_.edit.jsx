import { json, redirect, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import CreateFormComponent from "~/components/createForm";

export async function loader({ params }) {
  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });
  // console.log(event);
  return json({ event });
}

export async function action({ request, params }) {
  const eventModel = mongoose.models.Event;
  const event = await eventModel.findById({ _id: params.eventId });

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  event.title = data.title;
  event.date = data.date;
  event.time = data.time;
  event.location = data.location;
  event.description = data.description;

  await event.save();

  return redirect("/events");
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
