import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import mongoose from "mongoose";

export default function Index() {
  return (
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
