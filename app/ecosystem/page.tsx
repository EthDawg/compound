import { redirect } from "next/navigation";

// The map moved to the front door. Deep reads still live at /ecosystem/[slug].
export default function EcosystemRedirect() {
  redirect("/");
}
