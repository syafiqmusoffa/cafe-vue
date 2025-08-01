// src/api/useTableStatus.ts
import { useQuery } from "@tanstack/vue-query";
import { api } from "@/utils/api"; // axios instance
import type { Ref } from "vue";

export type Table = {
  id: number;
  table_number: number;
  is_occupied: boolean;
};

export const useTableStatus = (tableId: Ref<number>) => {
  return useQuery<Table>({
    queryKey: ["table-status"],
    queryFn: async () => {
      const { data } = await api.get(`/tables/${tableId.value}`);
      return data;
    },
    enabled: !!tableId.value,
    refetchInterval: 300,
  });
};
