'use client';

import { useActionState, useState } from 'react';
import { createTest } from './actions';
import { Plus, Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUESTION_TYPES = [
    { value: 'fill_in_blanks', label: 'Fill in the blanks' },
    { value: 'match_columns', label: 'Match the columns' },
    { value: 'true_false', label: 'True or False' },
    { value: 'single_word', label: 'One Word' },
    { value: 'one_sentence', label: 'One Sentence' },
    { value: 'picture_based', label: 'Picture Based' },
    { value: 'mcq', label: 'Choose Options' },
    { value: 'brief_answer', label: 'Brief Answer' },
    { value: 'difference', label: 'Difference Between' },
];

export default function CreateTestPage() {
    const [state, formAction] = useActionState(createTest, null);
    const [questions, setQuestions] = useState<any[]>([]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                text: '',
                type: 'mcq',
                options: ['', '', '', ''],
                correctAnswer: '',
                marks: 1,
            },
        ]);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = (formData: FormData) => {
        formData.set('questions', JSON.stringify(questions));
        // @ts-ignore
        formAction(formData);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Test</h1>
                    <p className="text-gray-500">Add questions and set details for your students.</p>
                </div>

                <form action={handleSubmit} className="space-y-8">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Test Details</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Test Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    placeholder="e.g. Science Chapter 1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    name="subject"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    placeholder="e.g. Science"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="flex items-center gap-2 rounded-md bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                            >
                                <Plus className="h-4 w-4" />
                                Add Question
                            </button>
                        </div>

                        {questions.map((q, index) => (
                            <div key={q.id} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 relative group transition-all hover:shadow-md">
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(index)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>

                                <div className="grid gap-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">Question Text</label>
                                            <textarea
                                                value={q.text}
                                                onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-sm font-medium text-gray-700">Type</label>
                                            <select
                                                value={q.type}
                                                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                            >
                                                {QUESTION_TYPES.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <label className="block text-sm font-medium text-gray-700">Marks</label>
                                            <input
                                                type="number"
                                                value={q.marks}
                                                onChange={(e) => updateQuestion(index, 'marks', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                min={1}
                                            />
                                        </div>
                                    </div>

                                    {/* Dynamic Fields based on Type */}
                                    {q.type === 'mcq' && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Options</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {q.options.map((opt: string, optIndex: number) => (
                                                    <input
                                                        key={optIndex}
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => {
                                                            const newOptions = [...q.options];
                                                            newOptions[optIndex] = e.target.value;
                                                            updateQuestion(index, 'options', newOptions);
                                                        }}
                                                        className="block w-full rounded-md border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                        placeholder={`Option ${optIndex + 1}`}
                                                    />
                                                ))}
                                            </div>
                                            <label className="block text-sm font-medium text-gray-700 mt-2">Correct Answer (Exact Match)</label>
                                            <input
                                                type="text"
                                                value={q.correctAnswer}
                                                onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                placeholder="Enter the correct option text"
                                            />
                                        </div>
                                    )}

                                    {q.type === 'true_false' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                                            <div className="flex gap-4 mt-2">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        checked={q.correctAnswer === 'True'}
                                                        onChange={() => updateQuestion(index, 'correctAnswer', 'True')}
                                                        name={`tf-${q.id}`}
                                                        className="text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">True</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        checked={q.correctAnswer === 'False'}
                                                        onChange={() => updateQuestion(index, 'correctAnswer', 'False')}
                                                        name={`tf-${q.id}`}
                                                        className="text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">False</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {q.type === 'fill_in_blanks' && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500 italic">Use <strong>___</strong> for blanks.</p>
                                            <label className="block text-sm font-medium text-gray-700">Correct Answer(s)</label>
                                            <input
                                                type="text"
                                                value={q.correctAnswer}
                                                onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                placeholder="e.g. mitochondria (comma separated if multiple)"
                                            />
                                        </div>
                                    )}

                                    {q.type === 'match_columns' && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Pairs (Left - Right)</label>
                                            <p className="text-xs text-gray-500">Enter matching pairs. They will be shuffled for students.</p>
                                            {(q.options || ['', '', '', '']).map((opt: string, i: number) => {
                                                return (
                                                    <input
                                                        key={i}
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => {
                                                            const newOptions = [...(q.options || ['', '', '', ''])];
                                                            newOptions[i] = e.target.value;
                                                            updateQuestion(index, 'options', newOptions);
                                                        }}
                                                        className="block w-full rounded-md border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                        placeholder={`Pair ${i + 1} e.g. "Apple - Fruit"`}
                                                    />
                                                )
                                            })}
                                        </div>
                                    )}

                                    {['single_word', 'one_sentence', 'brief_answer', 'difference'].includes(q.type) && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Ideal Answer (for AI evaluation)</label>
                                            <textarea
                                                value={q.correctAnswer}
                                                onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                rows={2}
                                                placeholder="Enter the expected answer key..."
                                            />
                                        </div>
                                    )}

                                    {q.type === 'picture_based' && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                            <input
                                                type="url"
                                                value={q.mediaUrl || ''}
                                                onChange={(e) => updateQuestion(index, 'mediaUrl', e.target.value)}
                                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            <label className="block text-sm font-medium text-gray-700 mt-2">Expected Answer</label>
                                            <input
                                                type="text"
                                                value={q.correctAnswer}
                                                onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                            />
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}

                        {questions.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                                No questions added yet. Click "Add Question" to start.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <Save className="h-4 w-4" />
                            Publish Test
                        </button>
                    </div>

                    {state?.message && (
                        <div className="text-red-500 bg-red-50 p-3 rounded-md text-sm text-center">
                            {state.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
