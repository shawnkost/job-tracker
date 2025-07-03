"use server";

import { redirect } from "next/navigation";
import { signOut } from "./index";

export async function signOutAction() {
  await signOut();
  redirect("/");
}
