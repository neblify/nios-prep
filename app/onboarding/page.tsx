'use client';

import { useUser } from '@clerk/nextjs';
import { completeOnboarding } from '@/app/actions/onboarding';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useActionState } from 'react';

export default function OnboardingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [state, action] = useActionState(completeOnboarding, null);

    useLayoutEffect(() => {
        if (isLoaded && user?.publicMetadata?.role) {
            router.push('/');
        }
    }, [isLoaded, user, router]);

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome to NIOS Prep
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Tell us who you are to get started
                    </p>
                </div>

                <form action={action} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {['student', 'teacher', 'parent'].map((role) => (
                            <label
                                key={role}
                                className="relative flex cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm focus:outline-none hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500"
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={role}
                                    className="sr-only"
                                    required
                                />
                                <span className="flex flex-1">
                                    <span className="flex flex-col">
                                        <span className="block text-sm font-medium text-gray-900 capitalize">
                                            {role}
                                        </span>
                                        <span className="mt-1 flex items-center text-sm text-gray-500">
                                            I am a {role}
                                        </span>
                                    </span>
                                </span>
                                <svg
                                    className="h-5 w-5 text-indigo-600 hidden peer-checked:block"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </label>
                        ))}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Get Started
                        </button>
                    </div>
                    {state?.message && (
                        <p className="text-center text-red-500 text-sm mt-2">{state.message}</p>
                    )}
                </form>
            </div>
        </div>
    );
}
