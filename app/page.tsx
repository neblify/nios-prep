import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  if (!role) {
    redirect("/onboarding");
  }

  if (role === "teacher") {
    redirect("/teacher");
  }

  if (role === "student") {
    redirect("/student");
  }

  if (role === "parent") {
    redirect("/parent");
  }

  return <div>Unknown Role</div>;
}
