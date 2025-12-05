"use client";

import { useState, useMemo } from "react";
import { useEvents } from "@/lib/hooks/useDatabase";
import { useCWLStatus, useWarStatus, useRaidStatus, useUniversalEvents } from "@/lib/hooks/useClashStatus";
import Card from "@/components/common/Card";
import { EVENT_TYPES } from "@/lib/constants";

const eventTypeEmoji = {
  war: "⚔️",
  cwl: "🏆",
  challenge: "🎯",
  meeting: "💬",
  other: "📌",
};

export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const { cwlStatus } = useCWLStatus();
  const { warStatus } = useWarStatus();
  const { raidStatus } = useRaidStatus();
  const { events: universalEvents } = useUniversalEvents();
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(["war", "cwl", "challenge", "meeting", "other"]);

  // Sort events by date
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [events]);

  const upcomingEvents = useMemo(() => {
    return sortedEvents.filter(
      (e) => new Date(e.date) > new Date() || e.status === "scheduled"
    );
  }, [sortedEvents]);

  const pastEvents = useMemo(() => {
    return sortedEvents.filter(
      (e) => new Date(e.date) <= new Date() && e.status !== "scheduled"
    );
  }, [sortedEvents]);

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = upcomingEvents.length;
    return {
      upcomingCount: upcoming,
      totalCount: events.length,
    };
  }, [upcomingEvents, events]);

  // Filter events by type
  const filteredUpcomingEvents = useMemo(() => {
    return upcomingEvents.filter((e) => selectedEventTypes.includes(e.type));
  }, [upcomingEvents, selectedEventTypes]);

  const filteredPastEvents = useMemo(() => {
    return pastEvents.filter((e) => selectedEventTypes.includes(e.type));
  }, [pastEvents, selectedEventTypes]);

  if (loading) {
    return (
      <div className="space-y-0">
        <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold">Clan Events</h1>
            <p className="text-blue-100 text-lg mt-2">Wars, challenges, and more</p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-0">
        <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold">Clan Events</h1>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-red-500">Error loading events: {error}</p>
        </div>
      </div>
    );
  }

  const toggleEventType = (type: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="space-y-0 min-h-screen bg-gradient-to-b from-black to-blue-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900/50 to-purple-900/50 text-white py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold">Events & Calendar</h1>
            <p className="text-blue-200 text-lg">
              Clan activities and universal Clash events
            </p>
          </div>
        </div>
      </section>

      {/* Active Clan Events Section */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="text-3xl mr-3">🎯</span>
            Current Clan Activities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CWL Status */}
            <CWLCard cwlStatus={cwlStatus} />
            
            {/* War Status */}
            <WarCard warStatus={warStatus} />
            
            {/* Raid Status */}
            <RaidCard raidStatus={raidStatus} />
          </div>
        </div>
      </section>

      {/* Universal Clash Events */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="text-3xl mr-3">📅</span>
            Universal Clash Events
          </h2>
          
          {universalEvents.length > 0 ? (
            <div className="space-y-4">
              {universalEvents.map((event) => (
                <UniversalEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-center py-8">
              <p className="text-white/60">Loading universal events...</p>
            </Card>
          )}
        </div>
      </section>

      {/* Clan Scheduled Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="text-3xl mr-3">📋</span>
            Scheduled Clan Events
          </h2>

          {/* Filter Section */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <label className="block text-sm font-semibold text-white mb-3">Filter by Type</label>
            <div className="flex flex-wrap gap-3">
              {(["war", "cwl", "challenge", "meeting", "other"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => toggleEventType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    selectedEventTypes.includes(type)
                      ? "bg-blue-600 text-white border border-blue-400"
                      : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <span className="text-lg">{eventTypeEmoji[type]}</span>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {events.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-center py-12">
              <p className="text-xl text-white/50">No scheduled events yet.</p>
            </Card>
          ) : (
            <div className="space-y-12">
              {/* Upcoming Events */}
              {filteredUpcomingEvents.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center text-white">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                    Upcoming
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredUpcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {filteredPastEvents.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center text-white/70">
                    <span className="w-2 h-2 bg-white/40 rounded-full mr-3"></span>
                    Past
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPastEvents.map((event) => (
                      <EventCard key={event.id} event={event} past />
                    ))}
                  </div>
                </div>
              )}

              {/* No filtered results */}
              {filteredUpcomingEvents.length === 0 && filteredPastEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-white/50">No events match your filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function CWLCard({ cwlStatus }: any) {
  if (!cwlStatus) return null;

  if (cwlStatus.status === "inactive") {
    return (
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏆</span>
          <div>
            <h3 className="text-lg font-bold text-white">Clan War League</h3>
            <p className="text-sm text-white/60">Not in CWL</p>
          </div>
        </div>
        <p className="text-white/70 text-sm">We will enter CWL next season. Check back soon!</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-purple-900/20 backdrop-blur-md border border-purple-400/30 hover:border-purple-400/60 transition-all">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-pulse">🏆</span>
          <div>
            <h3 className="text-lg font-bold text-white">Clan War League</h3>
            <p className="text-sm text-purple-200">ACTIVE</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/10">
          <div>
            <p className="text-xs text-white/60">Our Rank</p>
            <p className="text-2xl font-bold text-purple-300">#{cwlStatus.rank}/{cwlStatus.totalClans}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Wins</p>
            <p className="text-2xl font-bold text-green-400">{cwlStatus.clanWins}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Destruction</p>
            <p className="text-2xl font-bold text-blue-400">{cwlStatus.destruction?.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Members</p>
            <p className="text-2xl font-bold text-yellow-400">{cwlStatus.members}</p>
          </div>
        </div>

        {cwlStatus.opponents && cwlStatus.opponents.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/70">Opponents</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {cwlStatus.opponents.map((opp: any, idx: number) => (
                <div key={idx} className="flex justify-between text-xs bg-white/5 p-2 rounded">
                  <span className="text-white/80 truncate">{opp.name}</span>
                  <span className="text-yellow-400 font-semibold">{opp.wins}W</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function WarCard({ warStatus }: any) {
  if (!warStatus) return null;

  if (warStatus.status === "inactive") {
    return (
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">⚔️</span>
          <div>
            <h3 className="text-lg font-bold text-white">Clan War</h3>
            <p className="text-sm text-white/60">Not in war</p>
          </div>
        </div>
        <p className="text-white/70 text-sm">No active war at the moment.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-red-500/20 to-red-900/20 backdrop-blur-md border border-red-400/30 hover:border-red-400/60 transition-all">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce">⚔️</span>
          <div>
            <h3 className="text-lg font-bold text-white">Clan War</h3>
            <p className="text-sm text-red-200">IN PROGRESS</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white/5 p-3 rounded">
            <p className="text-xs text-white/60 mb-2">vs. {warStatus.opponent?.name}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Our Clan</p>
                <p className="text-2xl font-bold text-blue-400">{warStatus.clan?.stars}⭐</p>
                <p className="text-xs text-white/60">{warStatus.clan?.destruction?.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60">vs</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{warStatus.opponent?.name}</p>
                <p className="text-2xl font-bold text-red-400">{warStatus.opponent?.stars}⭐</p>
                <p className="text-xs text-white/60">{warStatus.opponent?.destruction?.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-2 rounded">
              <p className="text-white/60">Team Size</p>
              <p className="font-bold text-white">{warStatus.teamSize}v{warStatus.teamSize}</p>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <p className="text-white/60">Attacks Used</p>
              <p className="font-bold text-white">{warStatus.clan?.attacks}/{warStatus.teamSize}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function RaidCard({ raidStatus }: any) {
  if (!raidStatus) return null;

  if (raidStatus.status === "inactive") {
    return (
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">💰</span>
          <div>
            <h3 className="text-lg font-bold text-white">Clan Capital Raid</h3>
            <p className="text-sm text-white/60">Not in raid</p>
          </div>
        </div>
        <p className="text-white/70 text-sm">No active raid at the moment.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 backdrop-blur-md border border-yellow-400/30 hover:border-yellow-400/60 transition-all">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-pulse">💰</span>
          <div>
            <h3 className="text-lg font-bold text-white">Clan Capital Raid</h3>
            <p className="text-sm text-yellow-200">IN PROGRESS</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/10">
          <div>
            <p className="text-xs text-white/60">Total Loot</p>
            <p className="text-2xl font-bold text-yellow-300">{raidStatus.totalLoot}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Attacks</p>
            <p className="text-2xl font-bold text-blue-400">{raidStatus.attacks}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Defenses</p>
            <p className="text-2xl font-bold text-red-400">{raidStatus.defenseCount}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Status</p>
            <p className="text-sm font-bold text-green-400 capitalize">{raidStatus.state}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function UniversalEventCard({ event }: any) {
  const now = new Date();
  const daysUntil = event.startDate ? Math.ceil((event.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const isActive = event.startDate && event.endDate && now >= event.startDate && now <= event.endDate;

  const typeEmojis: { [key: string]: string } = {
    clan_games: "🎮",
    season_end: "🏁",
    cwl: "🏆",
    raid: "💰",
    war: "⚔️",
  };

  const emoji = typeEmojis[event.type] || "📅";

  return (
    <Card className={`backdrop-blur-md transition-all ${
      isActive
        ? "bg-gradient-to-r from-green-500/20 to-green-900/20 border border-green-400/40"
        : "bg-white/10 border border-white/20 hover:border-white/40"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-white">{event.name}</h3>
              {isActive && (
                <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded mt-1">
                  NOW ACTIVE
                </span>
              )}
            </div>
          </div>
          <p className="text-white/70 text-sm mb-3">{event.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
        <div className="bg-white/5 p-3 rounded">
          <p className="text-xs text-white/60">Starts</p>
          <p className="font-semibold text-white">
            {event.startDate?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
          <p className="text-xs text-white/60">
            {event.startDate?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="bg-white/5 p-3 rounded">
          <p className="text-xs text-white/60">Ends</p>
          <p className="font-semibold text-white">
            {event.endDate?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
          <p className="text-xs text-white/60">
            {event.endDate?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="bg-white/5 p-3 rounded">
          <p className="text-xs text-white/60">Time Left</p>
          <p className={`font-bold text-lg ${daysUntil <= 0 ? "text-green-400" : "text-blue-400"}`}>
            {daysUntil <= 0 ? "Active" : `${daysUntil}d`}
          </p>
        </div>
      </div>
    </Card>
  );
}

function EventCard({ event, past = false }: any) {
  const eventType = event.type as keyof typeof eventTypeEmoji;
  const emoji = eventTypeEmoji[eventType] || "📌";
  const eventTypeLabel = EVENT_TYPES[eventType as keyof typeof EVENT_TYPES];

  const eventDate = new Date(event.date);
  const now = useMemo(() => new Date(), []);
  const isToday = eventDate.toDateString() === now.toDateString();
  const isThisWeek =
    eventDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000 && eventDate > now;

  // Calculate days until event
  const daysUntil = useMemo(() => {
    if (past) return null;
    const timeDiff = eventDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  }, [eventDate, now, past]);

  return (
    <Card
      className={`bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all h-full hover:shadow-lg group ${
        past ? "opacity-50" : ""
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{event.title}</h3>
                <p className="text-sm text-blue-200 font-medium">{eventTypeLabel}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-col items-end">
            {!past && (
              <>
                {isToday && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Today
                  </span>
                )}
                {isThisWeek && !isToday && (
                  <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    This Week
                  </span>
                )}
                {event.status === "ongoing" && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    Ongoing
                  </span>
                )}
                {daysUntil !== null && daysUntil > 7 && (
                  <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    In {daysUntil} {daysUntil === 1 ? "day" : "days"}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <p className="text-white/80 leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-white/60">Scheduled</p>
            <p className="font-semibold text-white">
              {eventDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: eventDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Time</p>
            <p className="font-semibold text-white">
              {eventDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
