import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db/connect";
import Test from "@/lib/db/models/Test";
import { notFound, redirect } from "next/navigation";
import TestTaker from "./TestTaker";

export default async function TestPage({ params }: { params: { id: string } }) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    await dbConnect();
    // @ts-ignore
    const test = await Test.findById(params.id);

    if (!test) {
        notFound();
    }

    // Serialize the test object to remove mongoose specific fields that can't be passed to client components easily if using spread
    // But usually just .toObject() or JSON parse/stringify works.
    const serializedTest = JSON.parse(JSON.stringify(test));

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl">
                <TestTaker test={serializedTest} userId={userId} />
            </div>
        </div>
    );
}
