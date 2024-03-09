import { redirect, useActionData, json } from "@remix-run/react";
import mongoose from "mongoose";
import CreateFormComponent from "~/components/createForm";
import { authenticator } from "~/services/auth.server";

export async function action({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/events",
  });
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    console.log(user);

    data.user = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    console.log(data);

    const eventModel = mongoose.models.Event;
    await eventModel.create(data);

    return redirect("/events");
  } catch (error) {
    console.log(error);
    return json({ error: error.errors });
  }
}

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/events",
  });
  return null;
}

export default function EventCreatePage() {
  //   const { error } = useActionData();
  // console.log(error);
  const actionData = useActionData();
  // console.log(actionData);

  //   console.log(actionData);

  const error = "hey";
  //   const [title, setTitle] = useState();
  //   const [date, setDate] = useState();
  //   const [description, setDescription] = useState();
  //   const [time, setTime] = useState();
  //   const [location, setLocation] = useState();

  //   return (
  //     <div className="form-section">
  //       <FormComponent method="post" title="Create A Chess Event">
  //         <InputComponent
  //           name="title"
  //           defaultValue={title}
  //           onChangeHandler={(e) => setTitle(e.target.value)}
  //         >
  //           Title
  //         </InputComponent>
  //         <InputComponent
  //           name="date"
  //           type="date"
  //           defaultValue={date}
  //           onChangeHandler={(e) => setDate(e.target.value)}
  //         >
  //           Date
  //         </InputComponent>
  //         <InputComponent
  //           name="time"
  //           type="time"
  //           defaultValue={time}
  //           onChangeHandler={(e) => setTime(e.target.value)}
  //         >
  //           Time
  //         </InputComponent>
  //         <InputComponent
  //           name="location"
  //           defaultValue={location}
  //           onChangeHandler={(e) => setLocation(e.target.value)}
  //         >
  //           Location
  //         </InputComponent>
  //         <label htmlFor="description">
  //           <span>Description</span>
  //           <textarea
  //             name="description"
  //             id="description"
  //             cols="30"
  //             rows="7"
  //             defaultValue={description}
  //             onChange={(e) => setDescription(e.target.value)}
  //           ></textarea>
  //         </label>
  //         <button>Create Event</button>
  //         <div>{error ? error : ""}</div>
  //       </FormComponent>
  //     </div>
  //   );

  return (
    <CreateFormComponent form_type="Create" form_title="Create A Chess Event" />
  );
}
