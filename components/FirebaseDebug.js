'use client';
import { useEffect, useState } from 'react';

export default function FirebaseDebug() {
    const [envStatus, setEnvStatus] = useState(null);

    useEffect(() => {
        // Safely check environment variables on the client
        const checkEnv = () => {
            const keys = [
                'NEXT_PUBLIC_FIREBASE_API_KEY',
                'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
                'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
                'NEXT_PUBLIC_FIREBASE_APP_ID'
            ];

            const status = keys.reduce((acc, key) => {
                const val = process.env[key];
                acc[key] = val ? `${val.substring(0, 5)}...` : 'MISSING';
                return acc;
            }, {});

            setEnvStatus(status);
        };

        checkEnv();
    }, []);

    if (!envStatus) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-[9999] pointer-events-none">
            <h3 className="font-bold border-b border-gray-600 mb-2 pb-1">Firebase Debug</h3>
            <pre className="font-mono">
                {JSON.stringify(envStatus, null, 2)}
            </pre>
        </div>
    );
}
