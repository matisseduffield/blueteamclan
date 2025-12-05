// Script to sync real Clash of Clans data from the official API
// 1. Get API key from: https://developer.clashofclans.com/#/login
// 2. Add to .env.local: COC_API_KEY=your_key_here
// 3. Run: npx ts-node scripts/syncClanData.ts

import * as dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

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

function mapRole(cocRole: string): "leader" | "coleader" | "elder" | "member" {
  const roleMap: Record<string, "leader" | "coleader" | "elder" | "member"> = {
    leader: "leader",
    coLeader: "coleader",
    admin: "elder",
    member: "member",
  };
  return roleMap[cocRole] || "member";
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
      foundedDate: new Date(), // API doesn't provide this, keep existing or set to now
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
        joinDate: new Date(), // API doesn't provide this
        avatar: null,
      });
    }
    console.log(`✅ Updated ${members.length} members\n`);

    console.log("🎉 Clan data sync complete!\n");
    console.log("📊 Summary:");
    console.log(`   • Clan: ${clanData.name} (Level ${clanData.clanLevel})`);
    console.log(`   • Members: ${members.length}`);
    console.log(`   • War Wins: ${clanData.warWins || 0}`);
    console.log(`   • Location: ${clanData.location?.name || "Global"}`);
    console.log("\n🌐 Your website now has real clan data!");
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
