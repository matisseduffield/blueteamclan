// Global constants and configuration

export const SITE_CONFIG = {
  name: "Blue Team Clan",
  description: "Level 20 Australian Clash of Clans Clan",
  domain: "blueteamclan.com",
  region: "Australia",
  social: {
    discord: "https://discord.gg/blueteamclan",
    twitter: "https://twitter.com/blueteamclan",
    youtube: "https://youtube.com/@blueteamclan",
  },
};

// Firebase Project Info
export const FIREBASE_PROJECT = {
  projectId: "theblueteamclan",
  projectName: "The Blue Team Clan",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Members", href: "/members" },
  { label: "Events", href: "/events" },
  { label: "Join", href: "/join" },
];

export const ROLES = {
  leader: { label: "Leader", color: "red" },
  coleader: { label: "Co-Leader", color: "orange" },
  elder: { label: "Elder", color: "purple" },
  member: { label: "Member", color: "blue" },
};

export const EVENT_TYPES = {
  war: "Clan War",
  cwl: "Clan War League",
  challenge: "Challenge",
  meeting: "Meeting",
  other: "Other",
};
