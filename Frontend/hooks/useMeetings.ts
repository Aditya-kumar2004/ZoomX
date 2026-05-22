import { useQuery } from '@tanstack/react-query';
import { meetingAPI } from '@/services/api';

export const useUpcomingMeetings = () => {
  return useQuery({
    queryKey: ['meetings', 'upcoming'],
    queryFn: meetingAPI.getUpcoming,
    staleTime: 30_000, // 30 seconds
  });
};

export const useRecentMeetings = () => {
  return useQuery({
    queryKey: ['meetings', 'recent'],
    queryFn: meetingAPI.getRecent,
  });
};
