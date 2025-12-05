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

const SAMPLE_CWL: CWLStatus = {
  status: "active",
  season: "2025-12",
  clanName: "Blue Team Clan",
  clanTag: "#2Q98GJ0J2",
  clanWins: 0,
  destruction: 85.2,
  rank: 3,
  totalClans: 8,
  opponents: [
    { name: "Red Dragons", tag: "#AAA", wins: 2, attacks: 30, destruction: 90 },
    { name: "Shadow Legion", tag: "#BBB", wins: 1, attacks: 29, destruction: 82 },
  ],
  lastUpdated: new Date(),
};

const SAMPLE_WAR: WarStatus = {
  status: "active",
  state: "inWar",
  teamSize: 10,
  startTime: new Date(Date.now() - 60 * 60 * 1000),
  endTime: new Date(Date.now() + 22 * 60 * 60 * 1000),
  clan: {
    name: "Blue Team Clan",
    tag: "#2Q98GJ0J2",
    clanLevel: 20,
    attacks: 8,
    stars: 18,
    destruction: 82.5,
  },
  opponent: {
    name: "Red Dragons",
    tag: "#AAA",
    clanLevel: 17,
    attacks: 6,
    stars: 14,
    destruction: 71.3,
  },
  lastUpdated: new Date(),
};

const SAMPLE_RAID: RaidStatus = {
  status: "active",
  state: "battleDay",
  startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
  endTime: new Date(Date.now() + 18 * 60 * 60 * 1000),
  totalLoot: 12500,
  attacks: 28,
  defenseCount: 4,
  lastUpdated: new Date(),
};

const SAMPLE_UNIVERSAL_EVENTS = [
  {
    id: "sample-cwl",
    name: "Clan War Leagues",
    type: "cwl",
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    status: "upcoming",
    source: "predicted_pattern",
  },
  {
    id: "sample-cg",
    name: "Clan Games",
    type: "clan_games",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    status: "upcoming",
    source: "predicted_pattern",
  },
  {
    id: "sample-season",
    name: "Season End / Gold Pass",
    type: "season_end",
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    status: "upcoming",
    source: "predicted_pattern",
  },
  {
    id: "sample-reset",
    name: "League Reset",
    type: "league_reset",
    startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
    status: "upcoming",
    source: "predicted_pattern",
  },
];

export function useCWLStatus() {
  const [cwlStatus, setCWLStatus] = useState<CWLStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCWLStatus = async () => {
      if (!db) {
        setCWLStatus(SAMPLE_CWL);
        setLoading(false);
        return;
      }
      try {
        const docSnap = await getDoc(doc(db, "clashStatus", "cwl"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const membersCount = Array.isArray(data.members)
            ? data.members.length
            : typeof data.members === "number"
              ? data.members
              : 0;
          setCWLStatus({
            ...data,
            members: membersCount,
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
      if (!db) {
        setWarStatus(SAMPLE_WAR);
        setLoading(false);
        return;
      }
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
      if (!db) {
        setRaidStatus(SAMPLE_RAID);
        setLoading(false);
        return;
      }
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
      if (!db) {
        setEvents(SAMPLE_UNIVERSAL_EVENTS);
        setLoading(false);
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "universalEvents"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate ? new Date(doc.data().startDate) : null,
          endDate: doc.data().endDate ? new Date(doc.data().endDate) : null,
          source: doc.data().source || "predicted_pattern",
          type: doc.data().type,
        }));

        // Keep only the next upcoming/active event per type
        const sorted = eventsData
          .filter((e) => e.startDate)
          .sort((a: any, b: any) => (a.startDate as Date).getTime() - (b.startDate as Date).getTime());

        const firstPerType: Record<string, any> = {};
        for (const ev of sorted) {
          if (!firstPerType[ev.type]) {
            firstPerType[ev.type] = ev;
          }
        }

        setEvents(Object.values(firstPerType));
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
