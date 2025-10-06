import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useAuth = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/me");
      return res.data;
    },
    retry: false,
  });
  return { user: data, isLoading, isError };
};