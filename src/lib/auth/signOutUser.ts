import { signOut } from "next-auth/react";

export async function signOutUser(redirectTo = "/") {
  await signOut({
    callbackUrl: redirectTo
  });
}
