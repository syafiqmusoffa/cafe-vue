import { api } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue-sonner";

// ✅ GET Semua Table
export const useTables = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: async () => (await api.get("/tables")).data, // Pastikan endpoint GET /tables sudah ada
  });
};

// ✅ Tambah Table
export const useAddTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTable: { table_number: number }) =>
      (await api.post("/tables", newTable)).data,
    onSuccess: () => {
      toast.success("Meja berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["table-status"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.error || "Gagal menambah meja"),
  });
};

// ✅ Delete Table
export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/tables/${id}`)).data,
    onSuccess: () => {
      toast.success("Meja berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["table-status"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.error || "Gagal menghapus meja"),
  });
};
