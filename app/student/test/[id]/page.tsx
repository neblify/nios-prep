import { auth } from '@clerk/nextjs/server';
import { currentAuth } from '@/lib/auth-wrapper';
import dbConnect from '@/lib/db/connect';
import Test from '@/lib/db/models/Test';
import Question from '@/lib/db/models/Question'; // Ensure model is registered
import { notFound, redirect } from 'next/navigation';
import TestTaker from './TestTaker';
import Result from '@/lib/db/models/Result';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function TestPage(props: Props) {
  const params = await props.params;
  const { userId } = await currentAuth();
  if (!userId) redirect('/sign-in');

  const { id } = params;

  await dbConnect();
  // @ts-ignore
  const test = await Test.findById(id)
    .populate({
      path: 'sections.questions',
      model: Question,
    })
    .populate({
      path: 'questions', // For backward compatibility
      model: Question,
    });

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
