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

// Universal Clash of Clans calendar events (pattern-based)
const CLASH_CALENDAR = {
  // CWL: 1st of each month, 10 days total (2 sign-up, 1 prep, 7 war days)
  cwl: {
    startDay: 1,
    durationDays: 10,
    name: "Clan War Leagues",
    description: "CWL sign-up (2d), prep (1d), 7 war days",
  },
  // Clan Games: 22nd to 28th each month
  clanGames: {
    startDay: 22,
    endDay: 28,
    name: "Clan Games",
    description: "Complete challenges to earn clan rewards",
  },
  // Season End / Gold Pass Payout: 1st of each month
  seasonEnd: {
    day: 1,
    name: "Season End / Gold Pass",
    description: "New season begins; rewards and loot payout",
  },
  // League Reset: last Monday of each month
  leagueReset: {
    name: "League Reset",
    description: "All leagues reset; Legends reset to 5000 trophies",
  },
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

async function fetchLeagueWar(warTag: string) {
  try {
    const url = `https://api.clashofclans.com/v1/clanwarleagues/wars/${encodeURIComponent(warTag)}`;
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

function getLastMonday(year: number, month: number): Date {
  const date = new Date(year, month + 1, 0); // last day of month
  const day = date.getDay();
  const diff = (day >= 1 ? day - 1 : 6);
  date.setDate(date.getDate() - diff);
  date.setHours(8, 0, 0, 0);
  return date;
}

interface ClashEvent {
  id: string;
  type: "clan_games" | "season_end" | "cwl" | "league_reset";
  startDate: Date;
  endDate?: Date;
  name: string;
  description: string;
  status: "active" | "upcoming" | "completed";
  daysRemaining?: number;
  source?: "predicted_pattern" | "official" | "manual";
}

function nextDateForDay(year: number, month: number, day: number, hour = 8): Date {
  return new Date(year, month, day, hour, 0, 0, 0);
}

function pickWindowOrNext(start: Date, end: Date, now: Date): { start: Date; end: Date; status: "active" | "upcoming" } {
  if (now <= end && now >= start) {
    return { start, end, status: "active" };
  }
  if (now < start) {
    return { start, end, status: "upcoming" };
  }
  const nextStart = new Date(start);
  nextStart.setMonth(nextStart.getMonth() + 1);
  const nextEnd = new Date(end);
  nextEnd.setMonth(nextEnd.getMonth() + 1);
  return { start: nextStart, end: nextEnd, status: "upcoming" };
}

async function generateClashCalendarEvents(): Promise<ClashEvent[]> {
  const events: ClashEvent[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // CWL: starts 1st, lasts 10 days
  const cwlStart = nextDateForDay(year, month, CLASH_CALENDAR.cwl.startDay, 0);
  const cwlEnd = new Date(cwlStart.getTime() + CLASH_CALENDAR.cwl.durationDays * 24 * 60 * 60 * 1000);
  const cwlWindow = pickWindowOrNext(cwlStart, cwlEnd, now);
  events.push({
    id: `cwl_${cwlWindow.start.getFullYear()}_${cwlWindow.start.getMonth()}`,
    type: "cwl",
    startDate: cwlWindow.start,
    endDate: cwlWindow.end,
    name: CLASH_CALENDAR.cwl.name,
    description: CLASH_CALENDAR.cwl.description,
    status: cwlWindow.status,
    daysRemaining: cwlWindow.status === "upcoming" ? Math.ceil((cwlWindow.start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : undefined,
    source: "predicted_pattern",
  });

  // Clan Games: 22-28
  const cgStart = nextDateForDay(year, month, CLASH_CALENDAR.clanGames.startDay, 8);
  const cgEnd = nextDateForDay(year, month, CLASH_CALENDAR.clanGames.endDay, 8);
  const cgWindow = pickWindowOrNext(cgStart, cgEnd, now);
  events.push({
    id: `clan_games_${cgWindow.start.getFullYear()}_${cgWindow.start.getMonth()}`,
    type: "clan_games",
    startDate: cgWindow.start,
    endDate: cgWindow.end,
    name: CLASH_CALENDAR.clanGames.name,
    description: CLASH_CALENDAR.clanGames.description,
    status: cgWindow.status,
    daysRemaining: cgWindow.status === "upcoming" ? Math.ceil((cgWindow.start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : undefined,
    source: "predicted_pattern",
  });

  // Season End / Gold Pass: 1st
  const seasonStart = nextDateForDay(year, month, CLASH_CALENDAR.seasonEnd.day, 0);
  const seasonEnd = new Date(seasonStart.getTime() + 24 * 60 * 60 * 1000);
  const seasonWindow = pickWindowOrNext(seasonStart, seasonEnd, now);
  events.push({
    id: `season_end_${seasonWindow.start.getFullYear()}_${seasonWindow.start.getMonth()}`,
    type: "season_end",
    startDate: seasonWindow.start,
    endDate: seasonWindow.end,
    name: CLASH_CALENDAR.seasonEnd.name,
    description: CLASH_CALENDAR.seasonEnd.description,
    status: seasonWindow.status,
    daysRemaining: seasonWindow.status === "upcoming" ? Math.ceil((seasonWindow.start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : undefined,
    source: "predicted_pattern",
  });

  // League Reset: last Monday
  const lrThisMonth = getLastMonday(year, month);
  const lrNextMonth = getLastMonday(year, month + 1);
  const lrStart = now <= lrThisMonth ? lrThisMonth : lrNextMonth;
  const lrEnd = new Date(lrStart.getTime() + 24 * 60 * 60 * 1000);
  const lrStatus = now >= lrStart && now <= lrEnd ? "active" : "upcoming";
  events.push({
    id: `league_reset_${lrStart.getFullYear()}_${lrStart.getMonth()}`,
    type: "league_reset",
    startDate: lrStart,
    endDate: lrEnd,
    name: CLASH_CALENDAR.leagueReset.name,
    description: CLASH_CALENDAR.leagueReset.description,
    status: lrStatus,
    daysRemaining: lrStatus === "upcoming" ? Math.ceil((lrStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : undefined,
    source: "predicted_pattern",
  });

  return events;
}

async function findCurrentCwlWar(leagueGroup: any) {
  if (!leagueGroup?.rounds?.length) return null;

  // Scan rounds from latest to earliest to find the first with valid war tags
  for (let i = leagueGroup.rounds.length - 1; i >= 0; i--) {
    const round = leagueGroup.rounds[i];
    const validTags = round.warTags?.filter((t: string) => t && t !== "#0") || [];
    if (!validTags.length) continue;

    // Fetch wars in this round sequentially to avoid rate spikes
    for (const warTag of validTags) {
      const war = await fetchLeagueWar(warTag);
      if (!war) continue;

      const ourFullTag = `#${CLAN_TAG}`;
      const isOurWar = war?.clan?.tag === ourFullTag || war?.opponent?.tag === ourFullTag;
      if (!isOurWar) continue;

      // Prefer active war states; otherwise return the first found
      if (war.state === "inWar" || war.state === "preparation") {
        return war;
      }
      if (!war.state || war.state === "warEnded") {
        // keep looking for an active one, but fallback
        return war;
      }
    }
  }

  return null;
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

    // Resolve current war: regular war first, else CWL war
    let activeWar = null;
    if (warData && warData.state === "inWar") {
      activeWar = {
        source: "regular",
        data: warData,
      };
    } else if (cwlData) {
      const cwlWar = await findCurrentCwlWar(cwlData);
      if (cwlWar) {
        activeWar = {
          source: "cwl",
          data: cwlWar,
        };
      }
    }

    if (activeWar) {
      const data = activeWar.data;
      const ourFullTag = `#${CLAN_TAG}`;
      const ourClan = data.clan.tag === ourFullTag ? data.clan : data.opponent;
      const opponentClan = data.clan.tag === ourFullTag ? data.opponent : data.clan;
      const startTime = data.startTime ? new Date(data.startTime) : data.startTime ? new Date(data.startTime * 1000) : null;
      const endTime = data.endTime ? new Date(data.endTime) : data.endTime ? new Date(data.endTime * 1000) : null;
      const teamSize = data.teamSize || data.clan?.members || null;
      const maxStars = teamSize ? teamSize * 3 : null;

      const warInfo = {
        status: "active",
        source: activeWar.source,
        state: data.state,
        teamSize,
        maxStars,
        startTime: startTime || null,
        endTime: endTime || null,
        clan: {
          name: ourClan.name,
          tag: ourClan.tag,
          clanLevel: ourClan.clanLevel,
          attacks: ourClan.attacks,
          stars: ourClan.stars,
          destruction: ourClan.destructionPercentage,
        },
        opponent: {
          name: opponentClan.name,
          tag: opponentClan.tag,
          clanLevel: opponentClan.clanLevel,
          attacks: opponentClan.attacks,
          stars: opponentClan.stars,
          destruction: opponentClan.destructionPercentage,
        },
        lastUpdated: new Date(),
      };

      await setDoc(doc(db, "clashStatus", "currentWar"), warInfo);
      console.log(`⚔️  War in progress (${activeWar.source})`);
      console.log(`   vs. ${warInfo.opponent.name}`);
      console.log(`   Score: ${warInfo.clan.stars} ⭐ vs ${warInfo.opponent.stars} ⭐`);
      console.log(
        `   Destruction: ${
          (warInfo.clan.destruction ?? 0).toFixed ? warInfo.clan.destruction.toFixed(1) : warInfo.clan.destruction
        }% vs ${
          (warInfo.opponent.destruction ?? 0).toFixed ? warInfo.opponent.destruction.toFixed(1) : warInfo.opponent.destruction
        }%\n`
      );
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
      const payload: any = {
        ...event,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate?.toISOString() || null,
        source: event.source || "predicted_pattern",
      };
      if (payload.daysRemaining === undefined) delete payload.daysRemaining;
      await setDoc(doc(db, "universalEvents", event.id), payload);
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
