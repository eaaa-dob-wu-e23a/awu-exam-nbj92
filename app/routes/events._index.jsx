import {
  Form,
  Link,
  json,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect } from "react";
import mongoose from "mongoose";
import { dateFormat } from "~/functions/dateFormat";

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const eventModel = mongoose.models.Event;
  let events = [];

  if (q !== null) {
    events = await eventModel
      .find({
        title: { $regex: q, $options: "i" },
      })
      .sort({ date: 1 });
  } else {
    events = await eventModel.find({}).sort({ date: 1 });
  }

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

  return json({ eventList, q });
}

export default function AllEventsPage() {
  const { eventList, q } = useLoaderData();
  const submit = useSubmit();

  const navigation = useNavigation();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const listEvents = eventList.map((e) => (
    <div className="event" key={e._id}>
      <Link to={e._id}>
        <div className="event-header">
          <div className="event-title">
            <span>{e.title}</span>
            <div>Location: {e.location}</div>
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

  return (
    <>
      <Form
        onChange={(e) => {
          const isFirstSearch = q === null;
          submit(e.currentTarget, { replace: !isFirstSearch });
        }}
      >
        <label htmlFor="q" className="relative flex flex-row gap-8 h-20 mb-8">
          <span>Search for event</span>
          <input
            className={`text-3xl ${searching ? "loading" : ""}`}
            name="q"
            id="q"
            size="50"
            type="search"
            defaultValue={q || ""}
          />
          <div id="search-spinner" aria-hidden hidden={!searching} />
        </label>
      </Form>
      <div className="event-container">{listEvents}</div>
    </>
  );
}
