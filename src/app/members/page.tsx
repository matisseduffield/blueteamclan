"use client";

import { useMembers } from "@/lib/hooks/useDatabase";
import Card from "@/components/common/Card";
import { formatTrophies } from "@/lib/utils";

export default function MembersPage() {
  const { members, loading, error } = useMembers();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Members</h1>
        <p className="text-gray-500">Loading members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Members</h1>
        <p className="text-red-500">Error loading members: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Clan Members</h1>

      {members.length === 0 ? (
        <p className="text-gray-500">No members yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTrophies(member.trophies)}
                    </div>
                    <p className="text-xs text-gray-500">Trophies</p>
                  </div>
                </div>

                {member.avatar && (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg"></div>
                )}

                <p className="text-sm text-gray-600">
                  Joined{" "}
                  {new Date(member.joinDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
