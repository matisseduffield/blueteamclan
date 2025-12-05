"use client";

import { useState, useMemo } from "react";
import { useEvents } from "@/lib/hooks/useDatabase";
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
            <h1 className="text-5xl font-bold">Clan Events</h1>
            <p className="text-blue-200 text-lg">
              Wars, challenges, and community events
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-center space-y-2">
                <p className="text-white/60 text-sm">Upcoming Events</p>
                <p className="text-4xl font-bold text-green-400">{stats.upcomingCount}</p>
              </div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-center space-y-2">
                <p className="text-white/60 text-sm">Total Events</p>
                <p className="text-4xl font-bold text-blue-400">{stats.totalCount}</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <label className="block text-sm font-semibold text-white mb-3">Filter by Event Type</label>
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
      </section>

      {/* Events Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-white/50">No events scheduled yet.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Upcoming Events */}
              {filteredUpcomingEvents.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-8 flex items-center text-white">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                    Upcoming Events
                  </h2>
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
                  <h2 className="text-3xl font-bold mb-8 flex items-center text-white/80">
                    <span className="w-2 h-2 bg-white/40 rounded-full mr-3"></span>
                    Past Events
                  </h2>
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
