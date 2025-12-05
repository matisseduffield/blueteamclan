"use client";

import { useEvents } from "@/lib/hooks/useDatabase";
import Card from "@/components/common/Card";
import { EVENT_TYPES } from "@/lib/constants";

export default function EventsPage() {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Events</h1>
        <p className="text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Events</h1>
        <p className="text-red-500">Error loading events: {error}</p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Clan Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No events scheduled yet.</p>
      ) : (
        <>
          {upcomingEvents.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4 text-blue-600">Upcoming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{event.title}</h3>
                          <p className="text-sm text-blue-600">
                            {EVENT_TYPES[event.type as keyof typeof EVENT_TYPES]}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === "ongoing"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">{event.description}</p>

                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {pastEvents.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4 text-gray-600">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="opacity-75">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{event.title}</h3>
                          <p className="text-sm text-gray-500">
                            {EVENT_TYPES[event.type as keyof typeof EVENT_TYPES]}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          Completed
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">{event.description}</p>

                      <p className="text-sm font-semibold text-gray-500">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
