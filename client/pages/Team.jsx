import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export default function Team() {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Load team members from API
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Team</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Invite team members and manage roles.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button size="sm" className="w-full md:w-auto text-xs md:text-sm">
              Invite member
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full md:w-auto text-xs md:text-sm"
            >
              Manage roles
            </Button>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="mt-8 p-8 text-center border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              No team members yet. Invite your first team member to get started.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="font-semibold text-sm md:text-base">
                  {m.name}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">
                  {m.role}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
