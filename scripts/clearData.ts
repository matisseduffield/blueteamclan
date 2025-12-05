// Script to clear all fake/sample data from Firestore
import * as dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";

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

async function clearCollection(collectionName: string) {
  const snapshot = await getDocs(collection(db, collectionName));
  console.log(`Deleting ${snapshot.size} documents from ${collectionName}...`);
  
  for (const doc of snapshot.docs) {
    await deleteDoc(doc.ref);
  }
  
  console.log(`✅ Cleared ${collectionName}`);
}

async function clearAllData() {
  console.log("🧹 Clearing all fake data from database...\n");
  
  try {
    await clearCollection("members");
    await clearCollection("events");
    
    console.log("\n✅ All fake data cleared!");
    console.log("Now run: npx ts-node scripts/syncClanData.ts");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

clearAllData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
