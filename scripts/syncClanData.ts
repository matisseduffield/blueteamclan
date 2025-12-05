// Script to sync real Clash of Clans data from the official API
// Includes automatic event detection and creation (CWL, Clan Games, End of Season, etc.)
// 1. Get API key from: https://developer.clashofclans.com/#/login
// 2. Add to .env.local: COC_API_KEY=your_key_here
// 3. Run: npx ts-node scripts/syncClanData.ts

import * as dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Firebase config
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

// Your clan tag (remove the # symbol)
const CLAN_TAG = "2Q98GJ0J2";
const PLAYER_TAG = "CQRGLC";
const COC_API_KEY = process.env.COC_API_KEY;

if (!COC_API_KEY) {
  console.error("❌ COC_API_KEY not found in environment variables!");
  console.log("\n📝 To get your API key:");
  console.log("   1. Go to: https://developer.clashofclans.com/#/login");
  console.log("   2. Login with your Supercell ID");
  console.log("   3. Create a new key (name: blueteamclan, description: website sync)");
  console.log("   4. Add to .env.local: COC_API_KEY=your_key_here");
  process.exit(1);
}

// Clash of Clans calendar constants
const COC_CALENDAR = {
  // CWL: 7 days per season, 8 times a year (roughly monthly)
  cwlSeasons: [
    { month: 0, name: "January CWL" },     // January
    { month: 1, name: "February CWL" },    // February
    { month: 2, name: "March CWL" },       // March
    { month: 3, name: "April CWL" },       // April
    { month: 4, name: "May CWL" },         // May
    { month: 5, name: "June CWL" },        // June
    { month: 6, name: "July CWL" },        // July
    { month: 7, name: "August CWL" },      // August
    { month: 8, name: "September CWL" },   // September
    { month: 9, name: "October CWL" },     // October
    { month: 10, name: "November CWL" },   // November
    { month: 11, name: "December CWL" },   // December
  ],
  // Clan Games: 7 days, typically mid-month
  clanGamesPerMonth: 1,
  // Seasonal rotation: Monthly, typically on first Sunday
};

async function fetchClanData() {
  const url = `https://api.clashofclans.com/v1/clans/%23${CLAN_TAG}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${COC_API_KEY}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchClanWarLeague() {
  try {
    const url = `https://api.clashofclans.com/v1/clans/%23${CLAN_TAG}/currentwar/leaguegroup`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${COC_API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.log("⚠️  CWL data not available (clan not in CWL or off-season)");
      return null;
    }

    return response.json();
  } catch (error) {
    console.log("ℹ️  Could not fetch CWL data:", error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}

async function fetchPlayerProgress() {
  try {
    const url = `https://api.clashofclans.com/v1/players/%23${PLAYER_TAG}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${COC_API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    return null;
  }
}

function mapRole(cocRole: string): "leader" | "coleader" | "elder" | "member" {
  const roleMap: Record<string, "leader" | "coleader" | "elder" | "member"> = {
    leader: "leader",
    coLeader: "coleader",
    admin: "elder",
    member: "member",
  };
  return roleMap[cocRole] || "member";
}

function getNextEventDate(type: "war" | "cwl" | "clangames" | "seasonend"): Date {
  const now = new Date();
  
  switch (type) {
    case "war": {
      // Wars typically happen every weekend (Friday 8 PM UTC or so)
      const nextFriday = new Date(now);
      nextFriday.setDate(nextFriday.getDate() + ((5 - nextFriday.getDay() + 7) % 7));
      nextFriday.setHours(20, 0, 0, 0);
      return nextFriday.getTime() < now.getTime() ? new Date(nextFriday.getTime() + 7 * 24 * 60 * 60 * 1000) : nextFriday;
    }
    case "cwl": {
      // CWL typically starts on first Monday of the month
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const firstMonday = new Date(nextMonth);
      const day = firstMonday.getDay();
      firstMonday.setDate(firstMonday.getDate() + (day === 0 ? 1 : day === 1 ? 0 : 8 - day));
      firstMonday.setHours(8, 0, 0, 0);
      return firstMonday;
    }
    case "clangames": {
      // Clan Games typically mid-month (around 15th-22nd)
      const midMonth = new Date(now.getFullYear(), now.getMonth(), 15);
      midMonth.setHours(8, 0, 0, 0);
      return midMonth.getTime() < now.getTime() ? new Date(now.getFullYear(), now.getMonth() + 1, 15) : midMonth;
    }
    case "seasonend": {
      // Season ends on first Sunday of the month
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const firstSunday = new Date(nextMonth);
      const day = firstSunday.getDay();
      firstSunday.setDate(firstSunday.getDate() + (day === 0 ? 0 : 7 - day));
      firstSunday.setHours(8, 0, 0, 0);
      return firstSunday;
    }
  }
}

async function autoGenerateEvents(clanData: any) {
  console.log("🤖 Auto-generating events from Clash of Clans calendar...\n");
  const now = new Date();
  const events: any[] = [];

  // Get existing events to avoid duplicates
  const eventsSnapshot = await getDocs(collection(db, "events"));
  const existingEventTitles = new Set(eventsSnapshot.docs.map(doc => doc.data().title));

  // Event 1: Weekly Clan Wars
  for (let i = 0; i < 4; i++) {
    const warDate = new Date(now);
    warDate.setDate(warDate.getDate() + ((5 - warDate.getDay() + 7) % 7) + (i * 7));
    warDate.setHours(20, 0, 0, 0);

    if (warDate > now) {
      const warTitle = `Clan War - ${warDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      if (!existingEventTitles.has(warTitle)) {
        events.push({
          title: warTitle,
          description: "Regular clan war! Use both attacks strategically. Make sure to follow the war plan and support teammates.",
          date: warDate,
          type: "war",
          status: warDate > now ? "scheduled" : "completed",
        });
      }
    }
  }

  // Event 2: Clan War League (next CWL season)
  const nextCWL = getNextEventDate("cwl");
  if (nextCWL > now) {
    const cwlTitle = `Clan War League - ${nextCWL.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
    if (!existingEventTitles.has(cwlTitle)) {
      events.push({
        title: cwlTitle,
        description: "Clan War League season! 7 days of competitive league wars. Prepare your army and execute carefully. Limited attacks - no mistakes!",
        date: nextCWL,
        type: "cwl",
        status: "scheduled",
      });
    }
  }

  // Event 3: Clan Games
  for (let i = 0; i < 3; i++) {
    const clangamesDate = new Date(now.getFullYear(), now.getMonth() + i, 15);
    clangamesDate.setHours(8, 0, 0, 0);

    if (clangamesDate > now) {
      const cgTitle = `Clan Games - ${clangamesDate.toLocaleDateString("en-US", { month: "long" })}`;
      if (!existingEventTitles.has(cgTitle)) {
        events.push({
          title: cgTitle,
          description: "Participate in clan games to earn rewards! Complete challenges for points. Target: Max out clan points (4000+). Every member contributing helps us reach better rewards!",
          date: clangamesDate,
          type: "challenge",
          status: "scheduled",
        });
      }
    }
  }

  // Event 4: End of Season / Trophy Push
  const seasonEnd = getNextEventDate("seasonend");
  if (seasonEnd > now) {
    const seasonTitle = `End of Season - Trophy Push ${seasonEnd.toLocaleDateString("en-US", { month: "long" })}`;
    if (!existingEventTitles.has(seasonTitle)) {
      events.push({
        title: seasonTitle,
        description: "End of season trophy push! Push for highest trophies. This is the perfect time to experiment with new strategies and climb the rankings.",
        date: seasonEnd,
        type: "meeting",
        status: "scheduled",
      });
    }
  }

  // Event 5: Monthly Clan Meeting
  const monthlyMeeting = new Date(now);
  monthlyMeeting.setDate(1); // First day of next month
  monthlyMeeting.setHours(19, 0, 0, 0);
  if (monthlyMeeting <= now) {
    monthlyMeeting.setMonth(monthlyMeeting.getMonth() + 1);
  }

  const meetingTitle = `Monthly Meeting - ${monthlyMeeting.toLocaleDateString("en-US", { month: "long" })}`;
  if (!existingEventTitles.has(meetingTitle)) {
    events.push({
      title: meetingTitle,
      description: "Monthly clan meeting! Discuss strategies, new members, and clan goals. Share feedback and ideas to make Blue Team stronger. On Discord voice channel.",
      date: monthlyMeeting,
      type: "meeting",
      status: "scheduled",
    });
  }

  // Save all new events to Firestore
  let addedCount = 0;
  for (const event of events) {
    try {
      const eventRef = doc(collection(db, "events"));
      await setDoc(eventRef, event);
      addedCount++;
      console.log(`  ✅ Created: ${event.title}`);
    } catch (error) {
      console.log(`  ❌ Failed to create: ${event.title}`);
    }
  }

  console.log(`\n📅 Total events created: ${addedCount}\n`);
}

async function syncClanData() {
  console.log("🚀 Syncing Blue Team Clan data from Clash of Clans API...\n");

  try {
    console.log("📡 Fetching clan data...");
    const clanData = await fetchClanData();
    console.log(`✅ Found: ${clanData.name} (${clanData.tag})\n`);

    // Update clan info
    console.log("📝 Updating clan info...");
    await setDoc(doc(db, "clan", "info"), {
      name: clanData.name,
      tag: clanData.tag,
      description: clanData.description || "Official Blue Team Clan",
      level: clanData.clanLevel,
      warWins: clanData.warWins || 0,
      foundedDate: new Date(),
      region: clanData.location?.name || "Global",
      members: clanData.members,
    });
    console.log("✅ Clan info updated\n");

    // Update members
    console.log("📝 Updating members...");
    const members = clanData.memberList || [];
    
    for (const member of members) {
      const memberRef = doc(collection(db, "members"), member.tag.replace("#", ""));
      await setDoc(memberRef, {
        name: member.name,
        tag: member.tag,
        role: mapRole(member.role),
        trophies: member.trophies,
        townHallLevel: member.townHallLevel,
        donations: member.donations,
        donationsReceived: member.donationsReceived,
        joinDate: new Date(),
        avatar: null,
      });
    }
    console.log(`✅ Updated ${members.length} members\n`);

    // Check for active CWL
    console.log("🏆 Checking for active CWL...");
    const cwlData = await fetchClanWarLeague();
    if (cwlData) {
      console.log("✅ Clan is currently in CWL\n");
    } else {
      console.log("ℹ️  Not currently in CWL\n");
    }

    // Auto-generate upcoming events
    await autoGenerateEvents(clanData);

    console.log("🎉 Clan data sync complete!\n");
    console.log("📊 Summary:");
    console.log(`   • Clan: ${clanData.name} (Level ${clanData.clanLevel})`);
    console.log(`   • Members: ${members.length}`);
    console.log(`   • War Wins: ${clanData.warWins || 0}`);
    console.log(`   • Location: ${clanData.location?.name || "Global"}`);
    console.log("\n🌐 Your website now has real clan data with auto-generated events!");
  } catch (error) {
    console.error("❌ Error syncing clan data:", error);
    throw error;
  }
}

// Run the sync
syncClanData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
