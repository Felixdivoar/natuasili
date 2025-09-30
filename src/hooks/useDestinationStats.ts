import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DestinationStats {
  activeProjects: number;
  protectedAreas: number;
  hectaresProtected: number;
  communitiesInvolved: number;
}

export const useDestinationStats = (destination: string) => {
  return useQuery({
    queryKey: ["destination-stats", destination],
    queryFn: async (): Promise<DestinationStats> => {
      // Get count of experiences for this destination
      const { count: experienceCount } = await supabase
        .from("experiences")
        .select("*", { count: "exact", head: true })
        .eq("visible_on_marketplace", true)
        .ilike("location_text", `%${destination}%`);

      return {
        activeProjects: experienceCount || 0,
        protectedAreas: 0,
        hectaresProtected: 0,
        communitiesInvolved: 0,
      };
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
};
