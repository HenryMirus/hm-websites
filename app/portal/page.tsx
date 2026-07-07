import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth/getRole";

export default async function PortalRoot() {
  const role = await getUserRole();
  if (role === "admin") {
    redirect("/portal/leads");
  } else {
    redirect("/portal/projects");
  }
}
