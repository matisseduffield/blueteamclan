// Custom React hook for Firebase database operations
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ClanMember, Event } from "@/lib/types";

const SAMPLE_MEMBERS: ClanMember[] = [
  {
    id: "sample-1",
    name: "BluLeader",
    role: "leader",
    trophies: 5400,
    tag: "#AAA111",
    joinDate: new Date(),
  },
  {
    id: "sample-2",
    name: "ShieldMaiden",
    role: "coleader",
    trophies: 5200,
    tag: "#BBB222",
    joinDate: new Date(),
  },
];

const SAMPLE_EVENTS: Event[] = [
  {
    id: "sample-war",
    title: "Friendly War vs Red Dragons",
    description: "10v10 friendly. Scout bases and plan hits.",
    date: new Date(Date.now() + 36 * 60 * 60 * 1000),
    type: "war",
    status: "scheduled",
  },
  {
    id: "sample-games",
    title: "Clan Games Sprint",
    description: "Push to 75k points. Share best tasks in Discord.",
    date: new Date(Date.now() + 72 * 60 * 60 * 1000),
    type: "challenge",
    status: "scheduled",
  },
];

export function useMembers() {
  const [members, setMembers] = useState<ClanMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!db) {
        setMembers(SAMPLE_MEMBERS);
        setLoading(false);
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "members"));
        const membersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ClanMember[];
        setMembers(membersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return { members, loading, error };
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!db) {
        setEvents(SAMPLE_EVENTS);
        setLoading(false);
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        setEvents(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}

export async function addMember(memberData: Omit<ClanMember, "id">) {
  try {
    if (!db) throw new Error("Firebase is not configured.");
    const docRef = await addDoc(collection(db, "members"), memberData);
    return docRef.id;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to add member");
  }
}

export async function updateMember(memberId: string, updates: Partial<ClanMember>) {
  try {
    if (!db) throw new Error("Firebase is not configured.");
    const memberRef = doc(db, "members", memberId);
    await updateDoc(memberRef, updates);
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update member");
  }
}

export async function deleteMember(memberId: string) {
  try {
    if (!db) throw new Error("Firebase is not configured.");
    await deleteDoc(doc(db, "members", memberId));
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete member");
  }
}
