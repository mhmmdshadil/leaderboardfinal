import { getSheetData, getOverallStandings } from '@/lib/googleSheets';
import OverallLeaderboard from '@/components/OverallLeaderboard';
import DetailedStats from '@/components/DetailedStats';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const [chartData, groupData, individualStats] = await Promise.all([
        getOverallStandings(),
        getSheetData('Group'),
        getSheetData('Individual')
    ]);

    // groupData now returns { baseScores: [...], eventScores: [...] }
    // We pass baseScores (the top table) to the toggleable StatsTable (DetailedStats)
    // We pass eventScores (the bottom table) to the new EventMatrix

    return (
        <main className="min-h-screen bg-white text-black">
            <Header />

            <div className="p-4 md:p-8">
                <header className="max-w-5xl mx-auto text-center mb-12 pt-8">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 font-anton">
                        Kalastra Arts Fest
                    </h1>
                    <p className="font-dancing text-2xl text-gray-400 mb-10 font-bold">
                        Official Leaderboard
                    </p>

                    <OverallLeaderboard data={chartData} />
                </header>

                <section className="max-w-5xl mx-auto pb-20 space-y-16">
                    {/* Toggleable List with internal Event Matrix */}
                    <DetailedStats
                        groupData={groupData}
                        individualData={individualStats}
                    />
                </section>
            </div>
        </main>
    );
}
