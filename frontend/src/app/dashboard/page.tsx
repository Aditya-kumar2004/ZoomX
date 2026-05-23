"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActionGrid } from "@/components/dashboard/ActionGrid";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { RecentMeetings } from "@/components/dashboard/RecentMeetings";
import { useUpcomingMeetings, useRecentMeetings } from "@/hooks/useMeetings";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: upcoming = [], isLoading: loadingUpcoming } = useUpcomingMeetings();
  const { data: recent = [], isLoading: loadingRecent } = useRecentMeetings();

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["meetings"] });
  };

  const loading = loadingUpcoming || loadingRecent;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-[#8888AA] mt-1">Here's what's happening with your meetings.</p>
          </div>
        </div>

        <ActionGrid />
        <UpcomingMeetings meetings={upcoming} loading={loading} />
        <RecentMeetings meetings={recent} loading={loading} onDelete={refetch} />
      </div>
    </DashboardLayout>
  );
}
