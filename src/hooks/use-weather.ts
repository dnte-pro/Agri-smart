import { useQuery } from "@tanstack/react-query";
import { fetchForecast, describe, emojiFor, recommendationsFor } from "@/lib/weather";

export function useWeather() {
  return useQuery({
    queryKey: ["weather", "nairobi"],
    queryFn: () => fetchForecast(),
    staleTime: 1000 * 60 * 30,
  });
}

export { describe, emojiFor, recommendationsFor };
