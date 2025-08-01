import { Product, UpdateProductDTO } from "@/types/products";
import { api } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue-sonner";

// ✅ Ambil semua produk
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => (await api.get("/products")).data,
  });
};

// ✅ Tambah produk (dengan gambar)
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) =>
      (await api.post("/products", formData)).data,
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Gagal menambah produk");
    },
  });
};
// ✅ Update produk (dengan gambar baru opsional)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return (
        await api.put(`/product/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// ✅ Hapus produk
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/product/${id}`)).data,
    onSuccess: () => {
      toast.success("Produk berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.error || "Gagal menghapus produk"),
  });
};

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      available,
    }: {
      id: Number;
      available: Boolean;
    }) => {
      const res = await api.patch(`/product/${id}`, { available });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Status produk sudah diubah");
    },
    onError: () => {
      toast.error("Status gagal diperbarui");
    },
  });
}
