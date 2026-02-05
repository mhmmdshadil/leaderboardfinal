'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function InitUser() {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const router = useRouter();

    const email = "muhammedshadilmp7@gmail.com";
    const password = "somebody_testing";

    const createAdmin = async () => {
        setStatus('loading');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setStatus('success');
            setMessage('User created successfully! logging you in...');
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 2000);
        } catch (err) {
            setStatus('error');
            if (err.code === 'auth/email-already-in-use') {
                setMessage('Error: This user already exists. You can just login.');
            } else {
                setMessage('Error: ' + err.message);
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-gray-900">One-Click Admin Setup</h2>

                <div className="bg-blue-50 p-4 rounded text-left text-sm text-blue-800">
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Password:</strong> {password}</p>
                </div>

                {status === 'error' && (
                    <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                        {message}
                    </div>
                )}

                {status === 'success' && (
                    <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
                        {message}
                    </div>
                )}

                <button
                    onClick={createAdmin}
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {status === 'loading' ? 'Creating...' : 'Create Admin Account'}
                </button>

                <p className="text-xs text-gray-500 mt-4">
                    After successful creation, this page can be deleted.
                </p>
            </div>
        </div>
    );
}
