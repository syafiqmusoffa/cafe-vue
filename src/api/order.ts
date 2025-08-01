import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export const useOrdersActive = () => {
  return useQuery({
    queryKey: ["orders-active"],
    queryFn: async () => {
      const res = await api.get("/orders/active");
      return res.data.filter(
        (o: any) => o.status !== "paid" && o.status !== "canceled"
      );
    },
    refetchInterval: 300,
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.put(`/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-active"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["table-status"] });
    },
  });
};