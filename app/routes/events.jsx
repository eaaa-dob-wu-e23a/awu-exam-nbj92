import {
  NavLink,
  Outlet,
  json,
  useLoaderData,
  useLocation,
} from "@remix-run/react";

export default function EventsPage() {
  // const { url } = useLoaderData();

  const loc = useLocation().pathname;

  console.log(loc);
  return (
    <>
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

      <Outlet />
    </>
  );
}
