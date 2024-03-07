import { useState } from "react";
import FormComponent from "./form";
import InputComponent from "./input";
import { dateFormat } from "~/functions/dateFormat";

export default function CreateFormComponent({
  form_type,
  form_title,
  event = null,
}) {
  const eventDate = dateFormat(new Date(event?.date));
  const [title, setTitle] = useState(event?.title);
  const [date, setDate] = useState(eventDate);
  const [description, setDescription] = useState(event?.description);
  const [time, setTime] = useState(event?.time);
  const [location, setLocation] = useState(event?.location);

  const error = "error";

  return (
    <div className="form-section">
      <FormComponent method="post" title={form_title}>
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
        <button>{form_type} Event</button>
        <div>{error ? error : ""}</div>
      </FormComponent>
    </div>
  );
}
