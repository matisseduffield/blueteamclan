"use client";

import { useState, useMemo } from "react";
import { useMembers } from "@/lib/hooks/useDatabase";
import Card from "@/components/common/Card";
import { formatTrophies } from "@/lib/utils";

const roleColors = {
  leader: { bg: "bg-red-100", text: "text-red-800", badge: "bg-red-600" },
  coleader: { bg: "bg-orange-100", text: "text-orange-800", badge: "bg-orange-600" },
  elder: { bg: "bg-purple-100", text: "text-purple-800", badge: "bg-purple-600" },
  member: { bg: "bg-blue-100", text: "text-blue-800", badge: "bg-blue-600" },
};

const roleDescriptions = {
  leader: "The visionary leader steering Blue Team to victory",
  coleader: "Trusted strategists who help lead the clan",
  elder: "Experienced players mentoring our members",
  member: "Active members climbing the trophy ranks",
};

export default function MembersPage() {
  const { members, loading, error } = useMembers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["leader", "coleader", "elder", "member"]);

  // Sort members by role
  const roleOrder = { leader: 0, coleader: 1, elder: 2, member: 3 };
  const sortedMembers = [...members].sort(
    (a, b) => (roleOrder[a.role as keyof typeof roleOrder] ?? 4) - (roleOrder[b.role as keyof typeof roleOrder] ?? 4)
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTrophies = members.reduce((sum, m) => sum + m.trophies, 0);
    return {
      totalMembers: members.length,
      totalTrophies,
      averageTrophies: members.length > 0 ? Math.round(totalTrophies / members.length) : 0,
    };
  }, [members]);

  // Filter members
  const filteredMembers = useMemo(() => {
    return sortedMembers.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRoles.includes(member.role);
      return matchesSearch && matchesRole;
    });
  }, [sortedMembers, searchQuery, selectedRoles]);

  // Group filtered members by role
  const groupedMembers = useMemo(() => {
    return {
      leader: filteredMembers.filter((m) => m.role === "leader"),
      coleader: filteredMembers.filter((m) => m.role === "coleader"),
      elder: filteredMembers.filter((m) => m.role === "elder"),
      member: filteredMembers.filter((m) => m.role === "member"),
    };
  }, [filteredMembers]);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

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

      {/* Statistics Section */}
      <section className="py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-center space-y-2">
                <p className="text-white/60 text-sm">Total Members</p>
                <p className="text-4xl font-bold text-blue-400">{stats.totalMembers}</p>
              </div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-center space-y-2">
                <p className="text-white/60 text-sm">Total Trophies</p>
                <p className="text-4xl font-bold text-yellow-400">{formatTrophies(stats.totalTrophies)}</p>
              </div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-center space-y-2">
                <p className="text-white/60 text-sm">Average Trophies</p>
                <p className="text-4xl font-bold text-purple-400">{formatTrophies(stats.averageTrophies)}</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Search Members</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filters */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Filter by Role</label>
            <div className="flex flex-wrap gap-3">
              {(["leader", "coleader", "elder", "member"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedRoles.includes(role)
                      ? "bg-blue-600 text-white border border-blue-400"
                      : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Leaders */}
          {groupedMembers.leader.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Leaders <span className="text-lg font-normal text-white/60 ml-2">({groupedMembers.leader.length})</span>
              </h2>
              <p className="text-white/60 text-sm mb-6">{roleDescriptions.leader}</p>
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
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Co-Leaders <span className="text-lg font-normal text-white/60 ml-2">({groupedMembers.coleader.length})</span>
              </h2>
              <p className="text-white/60 text-sm mb-6">{roleDescriptions.coleader}</p>
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
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Elders <span className="text-lg font-normal text-white/60 ml-2">({groupedMembers.elder.length})</span>
              </h2>
              <p className="text-white/60 text-sm mb-6">{roleDescriptions.elder}</p>
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
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Members <span className="text-lg font-normal text-white/60 ml-2">({groupedMembers.member.length})</span>
              </h2>
              <p className="text-white/60 text-sm mb-6">{roleDescriptions.member}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {groupedMembers.member.map((member) => (
                  <MemberCard key={member.id} member={member} compact />
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-white/50">No members match your filters.</p>
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
