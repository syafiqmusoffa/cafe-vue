// src/types/product.ts

export type ProductCategory = "coffee" | "non_coffee" | "snack" | "heavy_meal";

export interface Product {
  id: number;
  productName: string; // backend sudah kirim "productName" -> camelCase
  description: string;
  available: boolean
  category: ProductCategory;
  price: number;
  img_url?: string; // ✅ pakai snake_case sesuai API
  imgPublicId?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface CreateProductDTO {
  productName: string;
  description: string;
  category: ProductCategory;
  price: number;
  img_url?: File; // untuk upload gambar
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
    id: number;
    data: CreateProductDTO
}
