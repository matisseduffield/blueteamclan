// Script to initialize Firestore database with sample data
// Run with: node --loader ts-node/esm scripts/initDb.ts

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD8OdvL4NXRGGqQqBR_AJJQUyeN1UlUSus",
  authDomain: "theblueteamclan.firebaseapp.com",
  projectId: "theblueteamclan",
  storageBucket: "theblueteamclan.firebasestorage.app",
  messagingSenderId: "70690636164",
  appId: "1:70690636164:web:e46d6211d4b695aacd1dd1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeDatabase() {
  console.log("🚀 Initializing Blue Team Clan database...\n");

  try {
    // Create clan info
    console.log("📝 Creating clan info...");
    await setDoc(doc(db, "clan", "info"), {
      name: "Blue Team Clan",
      tag: "#2YL89RJ28",
      description: "Official Clash of Clans clan - Blue Team Clan. Join us for wars, CWL, and clan games!",
      level: 5,
      warWins: 47,
      foundedDate: new Date("2023-01-15"),
      region: "Global",
      members: 15,
    });
    console.log("✅ Clan info created\n");

    // Create sample members
    console.log("📝 Creating sample members...");
    const members = [
      {
        name: "BlueLeader",
        role: "leader",
        trophies: 5200,
        joinDate: new Date("2023-01-15"),
        avatar: null,
      },
      {
        name: "CoLeader Mike",
        role: "coleader",
        trophies: 4850,
        joinDate: new Date("2023-02-10"),
        avatar: null,
      },
      {
        name: "Elder Sarah",
        role: "elder",
        trophies: 4600,
        joinDate: new Date("2023-03-20"),
        avatar: null,
      },
      {
        name: "Elder John",
        role: "elder",
        trophies: 4450,
        joinDate: new Date("2023-04-05"),
        avatar: null,
      },
      {
        name: "ProPlayer99",
        role: "member",
        trophies: 4200,
        joinDate: new Date("2023-05-15"),
        avatar: null,
      },
      {
        name: "WarKing",
        role: "member",
        trophies: 4100,
        joinDate: new Date("2023-06-01"),
        avatar: null,
      },
      {
        name: "ClashMaster",
        role: "member",
        trophies: 3950,
        joinDate: new Date("2023-07-10"),
        avatar: null,
      },
      {
        name: "DragonSlayer",
        role: "member",
        trophies: 3800,
        joinDate: new Date("2023-08-20"),
        avatar: null,
      },
    ];

    for (const member of members) {
      const memberRef = doc(collection(db, "members"));
      await setDoc(memberRef, member);
    }
    console.log(`✅ Created ${members.length} members\n`);

    // Create sample events
    console.log("📝 Creating sample events...");
    const events = [
      {
        title: "Clan War League - December",
        description: "Join us for CWL! Make sure to use both attacks and follow the strategy.",
        date: new Date("2025-12-10T18:00:00"),
        type: "cwl",
        status: "scheduled",
      },
      {
        title: "Weekend War",
        description: "Regular clan war this weekend. All members welcome!",
        date: new Date("2025-12-14T20:00:00"),
        type: "war",
        status: "scheduled",
      },
      {
        title: "Clan Games",
        description: "Let's max out clan games! Target: 4000 points per member.",
        date: new Date("2025-12-20T00:00:00"),
        type: "challenge",
        status: "scheduled",
      },
      {
        title: "Clan War - Victory!",
        description: "Great performance everyone! We won 45-38. MVP: BlueLeader with 6 stars!",
        date: new Date("2025-11-30T20:00:00"),
        type: "war",
        status: "completed",
      },
      {
        title: "CWL November - 2nd Place",
        description: "Excellent effort in CWL! Promoted to next league!",
        date: new Date("2025-11-15T18:00:00"),
        type: "cwl",
        status: "completed",
      },
    ];

    for (const event of events) {
      const eventRef = doc(collection(db, "events"));
      await setDoc(eventRef, event);
    }
    console.log(`✅ Created ${events.length} events\n`);

    console.log("🎉 Database initialization complete!");
    console.log("\n📊 Summary:");
    console.log(`   • Clan info: ✓`);
    console.log(`   • Members: ${members.length}`);
    console.log(`   • Events: ${events.length}`);
    console.log("\n🌐 Visit your website to see the data!");
    
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

// Run the initialization
initializeDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
