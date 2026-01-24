import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role as string | undefined;

  console.log("Root Page: Role found:", role);

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
