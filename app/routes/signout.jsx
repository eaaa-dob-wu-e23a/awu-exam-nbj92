import { authenticator } from "~/services/auth.server";

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
}

export async function action({ request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  return await authenticator.logout(request, {
    redirectTo: "/",
  });
}
