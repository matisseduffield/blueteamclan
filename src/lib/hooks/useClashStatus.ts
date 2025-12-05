// Hook for fetching current clan status (CWL, wars, raids)

import { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CWLStatus {
  status: "active" | "inactive";
  season?: string;
  league?: string;
  clanTag?: string;
  clanName?: string;
  members?: number;
  clanWins?: number;
  attacks?: number;
  destruction?: number;
  rank?: number;
  totalClans?: number;
  opponents?: Array<{
    name: string;
    tag: string;
    wins: number;
    attacks: number;
    destruction: number;
  }>;
  lastUpdated: Date;
}

export interface WarStatus {
  status: "active" | "inactive";
  state?: string;
  teamSize?: number;
  startTime?: Date;
  endTime?: Date;
  clan?: {
    name: string;
    tag: string;
    clanLevel: number;
    attacks: number;
    stars: number;
    destruction: number;
  };
  opponent?: {
    name: string;
    tag: string;
    clanLevel: number;
    attacks: number;
    stars: number;
    destruction: number;
  };
  lastUpdated: Date;
}

export interface RaidStatus {
  status: "active" | "inactive";
  startTime?: Date;
  endTime?: Date;
  state?: string;
  totalLoot?: number;
  attacks?: number;
  defenseCount?: number;
  lastUpdated: Date;
}

export function useCWLStatus() {
  const [cwlStatus, setCWLStatus] = useState<CWLStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCWLStatus = async () => {
      try {
        const docSnap = await getDoc(doc(db, "clashStatus", "cwl"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCWLStatus({
            ...data,
            lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
          } as CWLStatus);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch CWL status");
      } finally {
        setLoading(false);
      }
    };

    fetchCWLStatus();
  }, []);

  return { cwlStatus, loading, error };
}

export function useWarStatus() {
  const [warStatus, setWarStatus] = useState<WarStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarStatus = async () => {
      try {
        const docSnap = await getDoc(doc(db, "clashStatus", "currentWar"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWarStatus({
            ...data,
            startTime: data.startTime?.toDate?.(),
            endTime: data.endTime?.toDate?.(),
            lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
          } as WarStatus);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch war status");
      } finally {
        setLoading(false);
      }
    };

    fetchWarStatus();
  }, []);

  return { warStatus, loading, error };
}

export function useRaidStatus() {
  const [raidStatus, setRaidStatus] = useState<RaidStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaidStatus = async () => {
      try {
        const docSnap = await getDoc(doc(db, "clashStatus", "raid"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRaidStatus({
            ...data,
            startTime: data.startTime?.toDate?.(),
            endTime: data.endTime?.toDate?.(),
            lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
          } as RaidStatus);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch raid status");
      } finally {
        setLoading(false);
      }
    };

    fetchRaidStatus();
  }, []);

  return { raidStatus, loading, error };
}

export function useUniversalEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "universalEvents"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate ? new Date(doc.data().startDate) : null,
          endDate: doc.data().endDate ? new Date(doc.data().endDate) : null,
        }));
        setEvents(eventsData.sort((a: any, b: any) => a.startDate - b.startDate));
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
