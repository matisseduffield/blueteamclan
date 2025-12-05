// Utility functions

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatTrophies(trophies: number): string {
  if (trophies >= 1000) {
    return `${(trophies / 1000).toFixed(1)}K`;
  }
  return trophies.toString();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
