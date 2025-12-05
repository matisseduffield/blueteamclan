// Custom React hook for Firebase database operations
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import type { ClanMember, Event } from "./types";

export function useMembers() {
  const [members, setMembers] = useState<ClanMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
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
    const docRef = await addDoc(collection(db, "members"), memberData);
    return docRef.id;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to add member");
  }
}

export async function updateMember(memberId: string, updates: Partial<ClanMember>) {
  try {
    const memberRef = doc(db, "members", memberId);
    await updateDoc(memberRef, updates);
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update member");
  }
}

export async function deleteMember(memberId: string) {
  try {
    await deleteDoc(doc(db, "members", memberId));
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete member");
  }
}
