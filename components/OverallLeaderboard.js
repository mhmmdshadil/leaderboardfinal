'use client';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export default function OverallLeaderboard({ data }) {
    // The incoming data from getOverallStandings() is already { name, score }
    const normalizedData = data || [];

    if (!normalizedData || normalizedData.length < 1) {
        return <div className="text-center p-8 text-gray-500">Waiting for data...</div>;
    }

    // Sort by Score (High to Low)
    const sorted = [...normalizedData].sort((a, b) => b.score - a.score);

    // Helper to format rank
    const getRankLabel = (rank) => {
        if (rank === 1) return '1st';
        if (rank === 2) return '2nd';
        if (rank === 3) return '3rd';
        return `${rank}th`;
    };

    // Reorder for Podium: [2nd, 1st, 3rd] if we have enough data
    let podiumData = [];
    if (sorted.length >= 3) {
        podiumData = [
            { ...sorted[1], podiumRank: 2, rankLabel: '2nd' }, // Left: 2nd Place
            { ...sorted[0], podiumRank: 1, rankLabel: '1st' }, // Center: 1st Place
            { ...sorted[2], podiumRank: 3, rankLabel: '3rd' }  // Right: 3rd Place
        ];
        // Add remainder if any
        if (sorted.length > 3) {
            podiumData.push(...sorted.slice(3).map((item, i) => ({
                ...item,
                podiumRank: i + 4,
                rankLabel: `${i + 4}th`
            })));
        }
    } else {
        podiumData = sorted.map((item, i) => ({
            ...item,
            podiumRank: i + 1,
            rankLabel: getRankLabel(i + 1)
        }));
    }

    const getTeamColor = (name) => {
        const n = (name || '').toLowerCase();
        if (n.includes('red')) return '#FF3B30';
        if (n.includes('blue')) return '#33C5FF';
        if (n.includes('green')) return '#00C853';
        if (n.includes('yellow')) return '#FFD600';
        return '#8884d8';
    };

    return (
        <section className="w-full max-w-4xl mx-auto mb-12 bg-white rounded-xl p-4 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-center font-anton uppercase text-2xl md:text-3xl mb-8 tracking-wide">
                Current Standings
            </h2>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={podiumData}
                        margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
                        barCategoryGap="20%"
                    >
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#1a1a1a' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Bar dataKey="score" radius={[16, 16, 0, 0]} animationDuration={1000}>
                            {
                                podiumData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getTeamColor(entry.name)} />
                                ))
                            }
                            {/* Score on Top */}
                            <LabelList
                                dataKey="score"
                                position="top"
                                style={{ fill: '#1a1a1a', fontWeight: '900', fontSize: '24px', fontFamily: 'var(--font-anton)' }}
                            />
                            {/* Rank Inside Bar */}
                            <LabelList
                                dataKey="rankLabel"
                                position="insideBottom"
                                style={{ fill: 'rgba(255,255,255,0.9)', fontWeight: 'bold', fontSize: '30px', fontFamily: 'var(--font-anton)', paddingBottom: '10px' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
