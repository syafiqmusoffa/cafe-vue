import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { User, CreateUserDTO } from "../types/user";
import { toast } from "vue-sonner";
import { api } from "@/utils/api";

// ✅ Ambil semua kasir
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const data = (await api.get("/cashiers")).data;
      return data.map((user: any) => ({
        id: Number(user.ID),
        name: user.name,
        username: user.username,
        role: user.role,
        status: user.status
      }));
    },
  });
};

// ✅ Tambah kasir
export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newUser: CreateUserDTO) =>
      (await api.post("/cashiers", newUser)).data,
    onSuccess: () => {
      toast.success("Kasir berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => toast.error(err.message || "Gagal menambah kasir"),
  });
};

// ✅ Hapus kasir
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await api.delete(`/cashiers/${id}`)).data,
    onSuccess: () => {
      toast.success("Kasir berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => toast.error(err.message || "Gagal menghapus kasir"),
  });
};

// ✅ Update kasir
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update: {
      id: number;
      name?: string;
      status?: string;
    }) => (await api.put(`/cashiers/${update.id}`, update)).data,
    onSuccess: () => {
      toast.success("Kasir berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => toast.error(err.message || "Gagal update kasir"),
  });
};

export function useUpdateCashierStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: boolean }) => {
      const res = await api.patch(`/cashiers/${id}/status`, { status });
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
       toast.success("Status kasir sudah berubah");
    },
    onError: () => {
      toast.error("status gagal diperbarui")
    }
  });
}
