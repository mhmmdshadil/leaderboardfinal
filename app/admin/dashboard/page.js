'use client';
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase'; // Keep auth for signOut if needed
import { signOut } from 'firebase/auth'; // explicit import
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/admin/login');
        } else if (user) {
            fetchTeams();
        }
    }, [user, authLoading, router]);

    const fetchTeams = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'teams'));
            const teamsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // If no teams in DB, use mock state for UI demo (optional fallback) or just show empty
            setTeams(teamsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching teams:", error);
            setLoading(false);
        }
    };

    const updateScore = async (id, newScore) => {
        try {
            const teamRef = doc(db, 'teams', id);
            await updateDoc(teamRef, { score: Number(newScore) });
            // Update local state
            setTeams(teams.map(t => t.id === id ? { ...t, score: Number(newScore) } : t));
        } catch (error) {
            console.error("Error updating score:", error);
            alert("Failed to update score");
        }
    };

    const handleLogout = () => {
        signOut(auth);
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-black">Loading...</div>;

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-anton text-black">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-700">Team</th>
                                <th className="p-4 font-semibold text-gray-700">Current Score</th>
                                <th className="p-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {teams.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500">
                                        No teams found in Firestore. Please add data to &apos;teams&apos; collection.
                                    </td>
                                </tr>
                            ) : (
                                teams.map((team) => (
                                    <tr key={team.id} className="hover:bg-gray-50 text-black">
                                        <td className="p-4 font-medium">{team.name}</td>
                                        <td className="p-4 font-anton text-2xl">{team.score}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => updateScore(team.id, team.score + 10)}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                            >
                                                +10
                                            </button>
                                            <button
                                                onClick={() => updateScore(team.id, team.score - 10)}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                            >
                                                -10
                                            </button>
                                            <input
                                                type="number"
                                                defaultValue={team.score}
                                                onBlur={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (!isNaN(val) && val !== team.score) {
                                                        updateScore(team.id, val);
                                                    }
                                                }}
                                                className="w-20 px-2 py-1 border rounded ml-4 text-black"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex justify-between items-center">
                    <p><strong>Note:</strong> Ensure you have the &apos;teams&apos; collection in Firestore.</p>
                    <button
                        onClick={async () => {
                            if (!confirm('This will reset/overwrite the 3 house teams. Continue?')) return;
                            try {
                                const teamsToSeed = [
                                    { id: '1', name: 'Red House', score: 0, theme: 'red' },
                                    { id: '2', name: 'Blue House', score: 0, theme: 'blue' },
                                    { id: '3', name: 'Green House', score: 0, theme: 'green' }
                                ];
                                for (const t of teamsToSeed) {
                                    await setDoc(doc(db, 'teams', t.id), t);
                                }
                                alert('Teams seeded successfully!');
                                fetchTeams();
                            } catch (e) {
                                console.error(e);
                                alert('Error seeding data');
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
                    >
                        Seed Database (Reset Teams)
                    </button>
                </div>
            </div>
        </div>
    );
}
