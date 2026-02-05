'use client';

export default function EventMatrix({ events }) {
    if (!events || events.length === 0) return null;

    // Pivot: Group by Event Name
    const matrix = {};
    const allEvents = new Set();
    events.forEach(item => {
        if (!matrix[item.name]) matrix[item.name] = {};
        matrix[item.name][item.team] = item.score;
        allEvents.add(item.name);
    });

    return (
        <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-black text-white p-3 rounded-t-xl font-bold uppercase tracking-wider text-center">
                Group Event Breakdown
            </div>
            <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b">
                                <th className="p-4">Event</th>
                                <th className="p-4 text-center text-red-600">Red</th>
                                <th className="p-4 text-center text-green-600">Green</th>
                                <th className="p-4 text-center text-blue-500">Blue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {Array.from(allEvents).map((eventName, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold text-gray-800">{eventName}</td>
                                    <td className="p-4 text-center font-mono font-bold text-red-600">
                                        {matrix[eventName]['Red House'] || '-'}
                                    </td>
                                    <td className="p-4 text-center font-mono font-bold text-green-600">
                                        {matrix[eventName]['Green House'] || '-'}
                                    </td>
                                    <td className="p-4 text-center font-mono font-bold text-blue-500">
                                        {matrix[eventName]['Blue House'] || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
