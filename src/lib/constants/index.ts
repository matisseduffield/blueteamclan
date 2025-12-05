// Global constants and configuration

export const SITE_CONFIG = {
  name: "Blue Team Clan",
  description: "Official website for Blue Team Clan - Clash of Clans",
  domain: "blueteamclan.com",
  social: {
    discord: "https://discord.gg/blueteamclan",
    twitter: "https://twitter.com/blueteamclan",
    youtube: "https://youtube.com/@blueteamclan",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Members", href: "/members" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
