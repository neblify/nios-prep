'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/connect';
import Test from '@/lib/db/models/Test';
import Result from '@/lib/db/models/Result';
import { gradeTestWithAI } from '@/lib/ai/grader';
import { redirect } from 'next/navigation';

export async function submitTest(testId: string, answers: Record<string, any>) {
    const { userId } = await auth();
    if (!userId) return { message: 'Unauthorized' };

    await dbConnect();
    // @ts-ignore
    const test = await Test.findById(testId);
    if (!test) return { message: 'Test not found' };

    // Call AI Grader
    const aiResult = await gradeTestWithAI(test, answers);

    if (!aiResult) {
        // Fallback logic could go here, but for MVP we assume it works or just log error
        console.error("AI Grading failed");
        return { message: "Grading failed" };
    }

    // Map AI results back to our Schema format
    const answersToSave = aiResult.results.map((r: any) => ({
        questionId: r.questionIndex.toString(),
        answer: answers[r.questionIndex],
        isCorrect: r.isCorrect,
        marksObtained: r.marksObtained,
        feedback: r.feedback
    }));

    // Create Result
    const result = await Result.create({
        testId: test._id,
        studentId: userId,
        answers: answersToSave,
        totalScore: aiResult.totalMarksObtained,
        maxScore: aiResult.maxMarks,
        aiFeedback: aiResult.overallFeedback,
        weakAreas: aiResult.weakAreas,
    });

    redirect(`/student/result/${result._id}`);
}
