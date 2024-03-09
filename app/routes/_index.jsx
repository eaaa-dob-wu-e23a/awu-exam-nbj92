import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";

export async function loader() {
  const entries = await mongoose.models.Entry.find({});
  return json({ entries });
}

export default function Index() {
  const { entries } = useLoaderData();

  return (
    // <div className="p-8 text-slate-50 bg-slate-900">
    //   <code>
    //     <pre className="animate-pulse">{JSON.stringify(entries, null, 2)}</pre>
    //   </code>
    // </div>
    <div id="welcome">
      <div>
        <h1>Chess Event Platform</h1>
      </div>
      <small>Your Favourite Chess Site</small>
      <Link to="events">
        <button className="btn">Explore Events</button>
      </Link>

      <small>
        <Link to="signin">Sign In</Link> | <Link to="signup">Sign Up</Link>
      </small>
    </div>
  );
}
