// Core type definitions for Blue Team Clan website

export interface ClanMember {
  id: string;
  name: string;
  role: "leader" | "coleader" | "elder" | "member";
  trophies: number;
  joinDate: Date;
  avatar?: string;
}

export interface ClanInfo {
  id: string;
  name: string;
  tag: string;
  description: string;
  level: number;
  warWins: number;
  members: ClanMember[];
  foundedDate: Date;
  region: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "war" | "cwl" | "challenge" | "meeting" | "other";
  status: "scheduled" | "ongoing" | "completed";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
