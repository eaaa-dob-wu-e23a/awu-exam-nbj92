import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  NavLink,
  Form,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { authenticator } from "./services/auth.server";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return [{ title: "Chess Events - Find Yours Here" }];
}

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request);

  return json({ user });
}

export default function App() {
  const { user } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <nav>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="events">Events</NavLink>
              </li>

              {user ? (
                <>
                  <li>
                    <NavLink to="profile">Profile</NavLink>
                  </li>
                  <li>
                    <Form method="post" action="/signout">
                      <button type="submit">Logud</button>
                    </Form>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink to="signin">Login</NavLink>
                </li>
              )}
            </ul>
          </nav>
        </header>
        <div id="content">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="text-5xl">
        <div className="mt-24 flex flex-col justify-center items-center w-screen">
          <h1>Whoops</h1>
          <p>An Error has occured we're working on a solution!</p>
          <p>
            This Route might not exist - Go to{" "}
            <Link to="/" className="underline">
              Home
            </Link>
          </p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
