import { NavLink, Outlet, json, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request);
  return json({ user });
}

export default function EventsPage() {
  const { user } = useLoaderData();

  return (
    <>
      {user ? (
        <div className="submenu">
          <ul>
            <li>
              <NavLink to="" end>
                <button>All Events</button>
              </NavLink>
            </li>
            <li>
              <NavLink to="create">
                <button>Create Event</button>
              </NavLink>
            </li>
          </ul>
        </div>
      ) : null}

      <Outlet />
    </>
  );
}
