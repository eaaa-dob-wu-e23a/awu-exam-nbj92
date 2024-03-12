import { authenticator } from "~/services/auth.server";

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  return null;
}

export async function action({ request }) {
  // indsæt noget unauthorized response msg
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  return await authenticator.logout(request, {
    redirectTo: "/",
  });
}

export default function SignOutPage() {
  return null;
}
