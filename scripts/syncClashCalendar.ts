// Script to sync detailed Clash of Clans calendar data
// Fetches current CWL, wars, and universal event timings
// Run with: npx ts-node scripts/syncClashCalendar.ts

import * as dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: "AIzaSyD8OdvL4NXRGGqQqBR_AJJQUyeN1UlUSus",
  authDomain: "theblueteamclan.firebaseapp.com",
  projectId: "theblueteamclan",
  storageBucket: "theblueteamclan.firebasestorage.app",
  messagingSenderId: "70690636164",
  appId: "1:70690636164:web:e46d6211d4b695aacd1dd1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CLAN_TAG = "2Q98GJ0J2";
const COC_API_KEY = process.env.COC_API_KEY;

if (!COC_API_KEY) {
  console.error("❌ COC_API_KEY not found!");
  process.exit(1);
}

// Universal Clash of Clans calendar events (fixed days of month)
const CLASH_CALENDAR = {
  // Clan Games: 15th to 22nd of each month (8 days)
  clanGames: {
    startDay: 15,
    endDay: 22,
    name: "Clan Games",
    description: "Complete challenges to earn clan rewards",
  },
  // Season End: First Sunday of the month (trophy reset)
  seasonEnd: {
    name: "Season End",
    description: "Trophy reset and rewards distributed",
  },
  // CWL typically: 1st-7th and 9th-15th (alternating weeks)
  cwlWeeks: [
    { start: 1, end: 7, name: "CWL Registration & War Week 1" },
    { start: 9, end: 15, name: "CWL War Week 2" },
  ],
};

async function fetchClanWarLeague() {
  try {
    const url = `https://api.clashofclans.com/v1/clans/%23${CLAN_TAG}/currentwar/leaguegroup`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${COC_API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.log("ℹ️  Could not fetch CWL data");
    return null;
  }
}

async function fetchCurrentWar() {
  try {
    const url = `https://api.clashofclans.com/v1/clans/%23${CLAN_TAG}/currentwar`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${COC_API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}

async function fetchClanCapitalRaid() {
  try {
    const url = `https://api.clashofclans.com/v1/clans/%23${CLAN_TAG}/capitalraidseasons`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${COC_API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}

function getFirstSunday(year: number, month: number): Date {
  const date = new Date(year, month, 1);
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? 0 : 7 - day));
  date.setHours(8, 0, 0, 0); // Season ends at 8 AM UTC
  return date;
}

interface ClashEvent {
  id: string;
  type: "clan_games" | "season_end" | "cwl" | "raid" | "war";
  startDate: Date;
  endDate?: Date;
  name: string;
  description: string;
  status: "active" | "upcoming" | "completed";
  daysRemaining?: number;
}

async function generateClashCalendarEvents(): Promise<ClashEvent[]> {
  const events: ClashEvent[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Generate events for current month and next 3 months
  for (let monthOffset = 0; monthOffset < 4; monthOffset++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    // Clan Games: 15th-22nd
    const cgStart = new Date(year, month, CLASH_CALENDAR.clanGames.startDay, 8, 0, 0);
    const cgEnd = new Date(year, month, CLASH_CALENDAR.clanGames.endDay, 8, 0, 0);

    if (cgEnd > today) {
      const status = now >= cgStart && now <= cgEnd ? "active" : cgEnd > now ? "upcoming" : "completed";
      const daysUntil = Math.ceil((cgStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      events.push({
        id: `clan_games_${year}_${month}`,
        type: "clan_games",
        startDate: cgStart,
        endDate: cgEnd,
        name: "Clan Games",
        description: `Complete challenges to earn clan rewards. ${cgEnd.toLocaleDateString()} - ${cgStart.toLocaleDateString()}`,
        status: status as any,
        daysRemaining: daysUntil > 0 ? daysUntil : undefined,
      });
    }

    // Season End: First Sunday
    const seasonEnd = getFirstSunday(year, month);
    if (seasonEnd > today) {
      const daysUntil = Math.ceil((seasonEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      events.push({
        id: `season_end_${year}_${month}`,
        type: "season_end",
        startDate: seasonEnd,
        name: "Season End - Trophy Reset",
        description: `End of season trophy reset and rewards. Resets at ${seasonEnd.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} UTC`,
        status: "upcoming",
        daysRemaining: daysUntil,
      });
    }
  }

  return events;
}

async function syncClashCalendar() {
  console.log("🚀 Syncing Clash of Clans Calendar Events...\n");

  try {
    // Fetch current activities
    console.log("📡 Fetching active events...");
    const cwlData = await fetchClanWarLeague();
    const warData = await fetchCurrentWar();
    const raidData = await fetchClanCapitalRaid();

    // Generate universal calendar events
    console.log("📅 Generating calendar events...");
    const calendarEvents = await generateClashCalendarEvents();

    // Save clan activity data
    console.log("💾 Saving clan activity status...");
    
    let currentCWLInfo: any = null;
    if (cwlData) {
      console.log("✅ Clan is currently in CWL!\n");
      
      // Find our clan in the league
      const ourClan = cwlData.clans.find((c: any) => c.tag === `#${CLAN_TAG}`);
      if (ourClan) {
        currentCWLInfo = {
          status: "active",
          season: cwlData.season,
          league: cwlData.league?.name || "Unknown",
          clanTag: ourClan.tag,
          clanName: ourClan.name,
          members: ourClan.members,
          clanWins: ourClan.clanWins || 0,
          attacks: ourClan.attacks || 0,
          destruction: ourClan.destructionPercentage || 0,
          rank: cwlData.clans.findIndex((c: any) => c.tag === `#${CLAN_TAG}`) + 1,
          totalClans: cwlData.clans.length,
          opponents: cwlData.clans.map((c: any) => ({
            name: c.name,
            tag: c.tag,
            wins: c.clanWins || 0,
            attacks: c.attacks || 0,
            destruction: c.destructionPercentage || 0,
          })),
          lastUpdated: new Date(),
        };

        await setDoc(doc(db, "clashStatus", "cwl"), currentCWLInfo);
        console.log(`   • Rank: ${currentCWLInfo.rank}/${currentCWLInfo.totalClans}`);
        console.log(`   • Wins: ${currentCWLInfo.clanWins}`);
        console.log(`   • Destruction: ${currentCWLInfo.destruction.toFixed(1)}%\n`);
      }
    } else {
      console.log("ℹ️  Not currently in CWL\n");
      await setDoc(doc(db, "clashStatus", "cwl"), {
        status: "inactive",
        lastUpdated: new Date(),
      });
    }

    // Save current war data
    if (warData && warData.state === "inWar") {
      console.log("⚔️  Clan War in progress!\n");
      const warInfo = {
        status: "active",
        state: warData.state,
        teamSize: warData.teamSize,
        startTime: new Date(warData.startTime * 1000),
        endTime: new Date(warData.endTime * 1000),
        clan: {
          name: warData.clan.name,
          tag: warData.clan.tag,
          clanLevel: warData.clan.clanLevel,
          attacks: warData.clan.attacks,
          stars: warData.clan.stars,
          destruction: warData.clan.destructionPercentage,
        },
        opponent: {
          name: warData.opponent.name,
          tag: warData.opponent.tag,
          clanLevel: warData.opponent.clanLevel,
          attacks: warData.opponent.attacks,
          stars: warData.opponent.stars,
          destruction: warData.opponent.destructionPercentage,
        },
        lastUpdated: new Date(),
      };
      await setDoc(doc(db, "clashStatus", "currentWar"), warInfo);
      console.log(`   vs. ${warInfo.opponent.name}`);
      console.log(`   Score: ${warInfo.clan.stars} ⭐ vs ${warInfo.opponent.stars} ⭐`);
      console.log(`   Destruction: ${warInfo.clan.destruction.toFixed(1)}% vs ${warInfo.opponent.destruction.toFixed(1)}%\n`);
    } else {
      await setDoc(doc(db, "clashStatus", "currentWar"), {
        status: "inactive",
        lastUpdated: new Date(),
      });
    }

    // Save raid data
    if (raidData && raidData.items?.length > 0) {
      const currentRaid = raidData.items[0];
      if (currentRaid.state === "ongoing") {
        console.log("💰 Clan Capital Raid in progress!\n");
        const raidInfo = {
          status: "active",
          startTime: new Date(currentRaid.startTime * 1000),
          endTime: new Date(currentRaid.endTime * 1000),
          state: currentRaid.state,
          totalLoot: currentRaid.totalLoot || 0,
          attacks: currentRaid.attackCount || 0,
          defenseCount: currentRaid.defenseCount || 0,
          lastUpdated: new Date(),
        };
        await setDoc(doc(db, "clashStatus", "raid"), raidInfo);
        console.log(`   Total Loot: ${raidInfo.totalLoot}`);
        console.log(`   Attacks: ${raidInfo.attacks}\n`);
      }
    }

    // Save universal calendar events
    console.log("📅 Saving universal events...");
    for (const event of calendarEvents) {
      await setDoc(doc(db, "universalEvents", event.id), {
        ...event,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate?.toISOString() || null,
      });
    }
    console.log(`   ✅ Saved ${calendarEvents.length} universal events\n`);

    console.log("🎉 Clash calendar sync complete!");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

syncClashCalendar()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
