"use client";

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

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  const upcomingEvents = sortedEvents.filter(
    (e) => new Date(e.date) > new Date() || e.status === "scheduled"
  );
  const pastEvents = sortedEvents.filter(
    (e) => new Date(e.date) <= new Date() && e.status !== "scheduled"
  );

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold">Clan Events</h1>
            <p className="text-blue-100 text-lg">
              Wars, challenges, and community events
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No events scheduled yet.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-900">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                    Upcoming Events
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Past Events
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} past />
                    ))}
                  </div>
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
  const now = new Date();
  const isToday = eventDate.toDateString() === now.toDateString();
  const isThisWeek =
    eventDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000 && eventDate > now;

  return (
    <Card
      className={`hover:shadow-xl transition-all h-full ${
        past ? "opacity-75" : "hover:scale-105"
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600 font-medium">{eventTypeLabel}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
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
              </>
            )}
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Scheduled</p>
            <p className="font-semibold text-gray-900">
              {eventDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: eventDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Time</p>
            <p className="font-semibold text-gray-900">
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
