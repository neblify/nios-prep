'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/connect';
import Test, { IQuestion } from '@/lib/db/models/Test';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const questionSchema = z.object({
    text: z.string().min(1, 'Question text is required'),
    type: z.string(),
    options: z.array(z.string()).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
    marks: z.number().min(1),
});

const createTestSchema = z.object({
    title: z.string().min(1),
    subject: z.string().min(1),
    questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

export async function createTest(prevState: any, formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        return { message: 'Unauthorized' };
    }

    // Parse string definition of questions (since we'll likely send it as JSON string from client for complex array)
    // OR we can handle it via complex formData parsing. JSON string is easier for deep nested arrays in Server Actions.

    const rawData = {
        title: formData.get('title'),
        subject: formData.get('subject'),
        questions: JSON.parse(formData.get('questions') as string || '[]'),
    }

    const validated = createTestSchema.safeParse(rawData);

    if (!validated.success) {
        return { message: 'Invalid Input', errors: validated.error.flatten() };
    }

    try {
        await dbConnect();
        await Test.create({
            ...validated.data,
            createdBy: userId,
            isPublished: true, // Auto publish for now
        });
    } catch (e) {
        console.error(e);
        return { message: 'Failed to create test' };
    }

    redirect('/teacher');
}
