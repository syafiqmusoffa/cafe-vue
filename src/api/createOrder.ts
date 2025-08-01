import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

type OrderPayload = {
  table_id: number;
  items: { product_id: number; quantity: number }[];
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OrderPayload) => {
      const { data } = await api.post("/orders", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-active"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["table-status"] });
    },
  });
};
