import { useState } from "react";
import FormComponent from "./form";
import InputComponent from "./input";
import { dateFormat } from "~/functions/dateFormat";
import { useActionData } from "@remix-run/react";

export default function CreateFormComponent({
  form_type,
  form_title = "",
  event = null,
}) {
  const error = useActionData();
  const eventDate = dateFormat(new Date(event?.date), true);

  const [title, setTitle] = useState(event?.title);
  const [date, setDate] = useState(eventDate);
  const [description, setDescription] = useState(event?.description);
  const [time, setTime] = useState(event?.time);
  const [location, setLocation] = useState(event?.location);

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
        {error ? error?.title : null}

        <InputComponent
          name="date"
          type="date"
          defaultValue={date}
          onChangeHandler={(e) => {
            setDate(e.target.value);
            // console.log(date);
            // console.log(typeof date);
          }}
        >
          Date
        </InputComponent>
        {error ? error?.date : null}

        <InputComponent
          name="time"
          type="time"
          defaultValue={time}
          onChangeHandler={(e) => setTime(e.target.value)}
        >
          Time
        </InputComponent>
        {error ? error?.time : null}

        <InputComponent
          name="location"
          defaultValue={location}
          onChangeHandler={(e) => setLocation(e.target.value)}
        >
          Location
        </InputComponent>
        {error ? error?.location : null}

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
        {error ? error?.description : null}

        <button>{form_type} Event</button>
      </FormComponent>
    </div>
  );
}
