"use client";

import Card from "@/components/common/Card";
import { useCWLStatus, useRaidStatus, useUniversalEvents, useWarStatus } from "@/lib/hooks/useClashStatus";

type UniversalEvent = {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  type?: string;
  source?: string;
};

export default function EventsPage() {
  const { cwlStatus } = useCWLStatus();
  const { warStatus } = useWarStatus();
  const { raidStatus } = useRaidStatus();
  const { events: universalEvents } = useUniversalEvents();

  return (
    <div className="space-y-0 min-h-screen bg-gradient-to-b from-black to-blue-950">
      <section className="bg-gradient-to-b from-blue-900/50 to-purple-900/50 text-white py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold">Events & Calendar</h1>
            <p className="text-blue-200 text-lg">Clan activities and universal Clash events</p>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="text-3xl mr-3">🎯</span>
            Current Clan Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CWLCard cwlStatus={cwlStatus} />
            <WarCard warStatus={warStatus} />
            <RaidCard raidStatus={raidStatus} />
          </div>
        </div>
      </section>

      <section className="py-16">
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
  const source = event.source || "predicted_pattern";

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
        ? "bg-gradient-to-r from-emerald-500/25 to-emerald-900/25 border border-emerald-400/50"
        : "bg-slate-900/60 border border-slate-700/70 hover:border-slate-500/80"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl drop-shadow-sm">{emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-white drop-shadow-sm">{event.name}</h3>
              {isActive && (
                <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded mt-1">
                  NOW ACTIVE
                </span>
              )}
              {source !== "official" && (
                <span className="inline-block bg-amber-600 text-white text-[10px] font-semibold px-2 py-1 rounded mt-1">
                  Pattern-based schedule
                </span>
              )}
            </div>
          </div>
          <p className="text-white/85 text-sm mb-3 leading-relaxed">{event.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
        <div className="bg-slate-800/80 p-3 rounded border border-slate-700/60">
          <p className="text-xs text-white/70">Starts</p>
          <p className="font-semibold text-white drop-shadow-sm">
            {event.startDate?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
          <p className="text-xs text-white/70">
            {event.startDate?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="bg-slate-800/80 p-3 rounded border border-slate-700/60">
          <p className="text-xs text-white/70">Ends</p>
          <p className="font-semibold text-white drop-shadow-sm">
            {event.endDate?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
          <p className="text-xs text-white/70">
            {event.endDate?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="bg-slate-800/80 p-3 rounded border border-slate-700/60">
          <p className="text-xs text-white/70">Time Left</p>
          <p className={`font-bold text-lg drop-shadow-sm ${daysUntil <= 0 ? "text-emerald-300" : "text-sky-300"}`}>
            {daysUntil <= 0 ? "Active" : `${daysUntil}d`}
          </p>
        </div>
      </div>
    </Card>
  );
}
