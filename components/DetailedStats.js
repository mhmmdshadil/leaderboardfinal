'use client';
import { useState } from 'react';
import EventMatrix from './EventMatrix';

export default function DetailedStats({ groupData, individualData }) {
    const [activeTab, setActiveTab] = useState('group');
    const currentData = activeTab === 'group' ? groupData : individualData;

    return (
        <div className="w-full">
            {/* TABS */}
            <div className="flex justify-center gap-4 mb-8">
                <button onClick={() => setActiveTab('group')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'group' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>GROUP STATS</button>
                <button onClick={() => setActiveTab('individual')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'individual' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>INDIVIDUAL STATS</button>
            </div>

            {/* MAIN LIST TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase">Participant / Team</th>
                            <th className="p-4 text-xs font-bold text-gray-400 text-right uppercase">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.list?.map((item, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-bold text-lg">{item.name}</div>
                                    <div className="text-sm text-gray-500 flex gap-2">
                                        <span className={item.team?.includes('Red') ? 'text-red-500' : item.team?.includes('Green') ? 'text-green-600' : 'text-blue-500'}>{item.team}</span>
                                        {item.event && <span className="text-gray-400">• {item.event}</span>}
                                    </div>
                                </td>
                                <td className="p-4 text-right font-black text-xl">{item.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* EVENT MATRIX (Only for Group Tab) */}
            {activeTab === 'group' && currentData.events?.length > 0 && (
                <EventMatrix events={currentData.events} />
            )}
        </div>
    );
}
