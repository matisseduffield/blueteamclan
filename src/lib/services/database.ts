// Firestore database initialization and seeding
// This file contains functions to set up the required collections in Firestore

import {
  collection,
  doc,
  setDoc,
  writeBatch,
  getDocs,
  query,
  where,
  type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ClanMember, Event } from "@/lib/types";
import { firebaseReady } from "@/lib/firebase";

// Initialize Firestore collections structure
export async function initializeDatabase() {
  try {
    if (!db || !firebaseReady) throw new Error("Firebase is not configured.");
    const database = db as Firestore;
    // Check if collections exist, if not create them
    const membersRef = collection(database, "members");
    const eventsRef = collection(database, "events");
    const clanRef = doc(database, "clan", "info");

    // Create clan info if it doesn't exist
    const clanSnap = await getDocs(query(collection(database, "clan")));
    if (clanSnap.empty) {
      await setDoc(clanRef, {
        name: "Blue Team Clan",
        tag: "#2YL89RJ28",
        description: "Official Clash of Clans clan - Blue Team Clan",
        level: 1,
        warWins: 0,
        foundedDate: new Date(),
        region: "Global",
        members: 0,
      });
    }

    console.log("✓ Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Seed sample member data
export async function seedMembers(members: Omit<ClanMember, "id">[]) {
  try {
    if (!db || !firebaseReady) throw new Error("Firebase is not configured.");
    const database = db as Firestore;
    const batch = writeBatch(database);

    members.forEach((member) => {
      const memberRef = doc(collection(database, "members"));
      batch.set(memberRef, {
        ...member,
        joinDate: member.joinDate instanceof Date ? member.joinDate : new Date(member.joinDate),
      });
    });

    await batch.commit();
    console.log(`✓ Added ${members.length} members to database`);
  } catch (error) {
    console.error("Error seeding members:", error);
    throw error;
  }
}

// Seed sample event data
export async function seedEvents(events: Omit<Event, "id">[]) {
  try {
    if (!db || !firebaseReady) throw new Error("Firebase is not configured.");
    const database = db as Firestore;
    const batch = writeBatch(database);

    events.forEach((event) => {
      const eventRef = doc(collection(database, "events"));
      batch.set(eventRef, {
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date),
      });
    });

    await batch.commit();
    console.log(`✓ Added ${events.length} events to database`);
  } catch (error) {
    console.error("Error seeding events:", error);
    throw error;
  }
}

// Get all members
export async function getAllMembers(): Promise<ClanMember[]> {
  try {
    if (!db || !firebaseReady) throw new Error("Firebase is not configured.");
    const database = db as Firestore;
    const querySnapshot = await getDocs(collection(database, "members"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ClanMember[];
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

// Get all events
export async function getAllEvents(): Promise<Event[]> {
  try {
    if (!db || !firebaseReady) throw new Error("Firebase is not configured.");
    const database = db as Firestore;
    const querySnapshot = await getDocs(collection(database, "events"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Get clan info
export async function getClanInfo() {
  try {
    if (!db || !firebaseReady) throw new Error("Firebase is not configured.");
    const database = db as Firestore;
    const clanRef = doc(database, "clan", "info");
    const docSnap = await getDocs(query(collection(database, "clan")));
    if (docSnap.empty) {
      return null;
    }
    return docSnap.docs[0].data();
  } catch (error) {
    console.error("Error fetching clan info:", error);
    return null;
  }
}
