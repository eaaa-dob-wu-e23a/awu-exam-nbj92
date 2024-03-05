import { redirect, useActionData, json } from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";
import FormComponent from "~/components/form";
import InputComponent from "~/components/input";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const eventModel = mongoose.models.Event;
    await eventModel.create(data);

    return json({ data });
  } catch (error) {
    // return json({ error: error.message["error"] });

    console.log(error.errors);
    return json({ error: error.errors });
  }

  //   console.log(data);

  //   return null;
}

export async function loader() {
  return null;
}

export default function EventCreatePage() {
  //   const { error } = useActionData();
  // console.log(error);
  const actionData = useActionData();
  console.log(actionData);

  //   console.log(actionData);

  const error = "hey";
  const [title, setTitle] = useState();
  const [date, setDate] = useState();
  const [description, setDescription] = useState();
  const [time, setTime] = useState();
  const [location, setLocation] = useState();

  return (
    <div className="form-section">
      <FormComponent method="post" title="Create A Chess Event">
        <InputComponent
          name="title"
          defaultValue={title}
          onChangeHandler={(e) => setTitle(e.target.value)}
        >
          Title
        </InputComponent>
        <InputComponent
          name="date"
          type="date"
          defaultValue={date}
          onChangeHandler={(e) => setDate(e.target.value)}
        >
          Date
        </InputComponent>
        <InputComponent
          name="time"
          type="time"
          defaultValue={time}
          onChangeHandler={(e) => setTime(e.target.value)}
        >
          Time
        </InputComponent>
        <InputComponent
          name="location"
          defaultValue={location}
          onChangeHandler={(e) => setLocation(e.target.value)}
        >
          Location
        </InputComponent>
        <label htmlFor="description">
          <span>Description</span>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="7"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        <button>Create Event</button>
        <div>{error ? error : ""}</div>
      </FormComponent>
    </div>
  );
}
