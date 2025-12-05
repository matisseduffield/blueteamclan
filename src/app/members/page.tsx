"use client";

import { useMembers } from "@/lib/hooks/useDatabase";
import Card from "@/components/common/Card";
import { formatTrophies } from "@/lib/utils";

const roleColors = {
  leader: { bg: "bg-red-100", text: "text-red-800", badge: "bg-red-600" },
  coleader: { bg: "bg-orange-100", text: "text-orange-800", badge: "bg-orange-600" },
  elder: { bg: "bg-purple-100", text: "text-purple-800", badge: "bg-purple-600" },
  member: { bg: "bg-blue-100", text: "text-blue-800", badge: "bg-blue-600" },
};

export default function MembersPage() {
  const { members, loading, error } = useMembers();

  // Sort members by role
  const roleOrder = { leader: 0, coleader: 1, elder: 2, member: 3 };
  const sortedMembers = [...members].sort(
    (a, b) => (roleOrder[a.role as keyof typeof roleOrder] ?? 4) - (roleOrder[b.role as keyof typeof roleOrder] ?? 4)
  );

  if (loading) {
    return (
      <div className="space-y-0">
        <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold">Clan Members</h1>
            <p className="text-blue-100 text-lg mt-2">Meet the {members.length} heroes of Blue Team</p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-500">Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-0">
        <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold">Clan Members</h1>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-red-500">Error loading members: {error}</p>
        </div>
      </div>
    );
  }

  // Group members by role
  const groupedMembers = {
    leader: sortedMembers.filter((m) => m.role === "leader"),
    coleader: sortedMembers.filter((m) => m.role === "coleader"),
    elder: sortedMembers.filter((m) => m.role === "elder"),
    member: sortedMembers.filter((m) => m.role === "member"),
  };

  return (
    <div className="space-y-0 min-h-screen bg-gradient-to-b from-black to-blue-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900/50 to-purple-900/50 text-white py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold">Clan Members</h1>
            <p className="text-blue-200 text-lg">
              Meet the {members.length} heroes of Blue Team
            </p>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Leaders */}
          {groupedMembers.leader.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Leaders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedMembers.leader.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {/* Co-Leaders */}
          {groupedMembers.coleader.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Co-Leaders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedMembers.coleader.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {/* Elders */}
          {groupedMembers.elder.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Elders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedMembers.elder.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Members */}
          {groupedMembers.member.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Members ({groupedMembers.member.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {groupedMembers.member.map((member) => (
                  <MemberCard key={member.id} member={member} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MemberCard({ member, compact = false }: any) {
  const role = member.role as keyof typeof roleColors;
  const colors = roleColors[role] || roleColors.member;

  if (compact) {
    return (
      <Card className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:shadow-lg h-full">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-white line-clamp-2">{member.name}</h3>
            </div>
            <span className={`${colors.badge} text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2`}>
              {member.role}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold text-blue-400">{formatTrophies(member.trophies)}</p>
              <p className="text-xs text-white/50">Trophies</p>
            </div>
            {member.townHallLevel && (
              <div className="text-right">
                <p className="text-sm font-bold text-purple-300">TH {member.townHallLevel}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:shadow-lg h-full">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{member.name}</h3>
            <p className="text-sm text-white/60">{member.tag}</p>
          </div>
          <span className={`${colors.badge} text-white text-sm font-bold px-3 py-1 rounded`}>
            {member.role}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div>
            <p className="text-sm text-white/60">Trophies</p>
            <p className="text-2xl font-bold text-blue-400">{formatTrophies(member.trophies)}</p>
          </div>
          {member.townHallLevel && (
            <div>
              <p className="text-sm text-white/60">Town Hall</p>
              <p className="text-2xl font-bold text-purple-400">{member.townHallLevel}</p>
            </div>
          )}
        </div>

        {member.donations > 0 || member.donationsReceived > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/60">Donated</p>
              <p className="font-semibold text-white">{member.donations}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Received</p>
              <p className="font-semibold text-white">{member.donationsReceived}</p>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
