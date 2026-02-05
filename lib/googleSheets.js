import Papa from 'papaparse';

const TABS = {
    'Group': '0',            // The "Group" tab (gid=0)
    'Individual': '1946880118' // The "Individual" tab
};

async function fetchCSV(tabName) {
    const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
    if (!SHEET_URL) return null;
    const match = SHEET_URL.match(/\/d\/(.*?)(\/|$)/);
    if (!match) return null;
    const sheetId = match[1];
    const gid = TABS[tabName];
    // Timestamp prevents caching old data
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&t=${Date.now()}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(res.statusText);
        return await res.text();
    } catch (e) {
        console.error(`Fetch error ${tabName}`, e);
        return null;
    }
}

export async function getSheetData(tabName) {
    const csvText = await fetchCSV(tabName);
    if (!csvText) return [];

    const { data } = Papa.parse(csvText, { header: false, skipEmptyLines: true });

    // === INDIVIDUAL TAB ===
    if (tabName === 'Individual') {
        return {
            list: data.slice(1).map(row => ({
                name: row[0]?.trim(),         // Col A: Name
                team: row[1]?.trim(),         // Col B: Team
                score: parseInt(row[2] || 0), // Col C: Points
                event: row[3]?.trim()         // Col D: Event
            })).filter(i => i.name),
            events: []
        };
    }

    // === GROUP TAB (Scanner Strategy) ===
    if (tabName === 'Group') {
        const baseScores = [];
        const eventScores = [];
        let isEventSection = false;
        let houseIndexes = {};

        data.forEach(row => {
            const firstCell = row[0]?.toString().trim().toLowerCase();
            if (!firstCell) return;

            // 1. Detect "Event" Header (Start of Bottom Table)
            if (firstCell === 'event') {
                isEventSection = true;
                // Dynamically find which column is Red, Green, Blue
                row.forEach((col, idx) => {
                    const c = String(col).toLowerCase();
                    if (c.includes('red')) houseIndexes['Red House'] = idx;
                    if (c.includes('green')) houseIndexes['Green House'] = idx;
                    if (c.includes('blue')) houseIndexes['Blue House'] = idx;
                });
                return;
            }

            // 2. Parse based on section
            if (isEventSection) {
                // --- BOTTOM TABLE (Event Matrix) ---
                const eventName = row[0].trim();
                Object.keys(houseIndexes).forEach(house => {
                    const colIdx = houseIndexes[house];
                    const pts = parseInt(row[colIdx] || 0);
                    if (pts > 0) {
                        eventScores.push({ name: eventName, team: house, score: pts });
                    }
                });
            } else {
                // --- TOP TABLE (Overall Scores) ---
                if (firstCell === 'team') return; // Skip header

                const teamName = row[0]?.trim(); // Col A
                const pts = parseInt(row[2] || 0); // Col C (Points)

                if (teamName && !isNaN(pts)) {
                    baseScores.push({ name: "Total Group Score", team: teamName, score: pts });
                }
            }
        });

        return { list: baseScores, events: eventScores };
    }
}

export async function getOverallStandings() {
    const [individual, group] = await Promise.all([
        getSheetData('Individual'),
        getSheetData('Group')
    ]);
    const teamTotals = {};
    const add = (team, pts) => { const t = team?.trim(); if (t) teamTotals[t] = (teamTotals[t] || 0) + pts; };

    individual.list?.forEach(i => add(i.team, i.score));
    // Add Group Top Table (already summed in Excel)
    group.list?.forEach(g => add(g.team, g.score));

    return Object.keys(teamTotals).map(name => ({ name, score: teamTotals[name] }));
}
