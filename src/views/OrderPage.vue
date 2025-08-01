<script setup lang="ts">
import { useCreateOrder } from "@/api/createOrder";
import { useProducts } from "@/api/products";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import Button from "@/components/ui/button/Button.vue";
import { Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useTableStatus } from "@/api/tableStatus";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart } from "lucide-vue-next";
import Badge from "@/components/ui/badge/Badge.vue";
import DialogDescription from "@/components/ui/dialog/DialogDescription.vue";

const totalItems = computed(() =>
  cart.value.reduce((sum, item) => sum + item.quantity, 0)
);

const route = useRoute();
const tableNumber = parseInt(route.params.table_number as string);
const tableId = ref(tableNumber);

type CartItem = {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
};
const {
  data: table,
  isLoading: loadingTable,
  isError,
} = useTableStatus(tableId);
const isOccupied = computed(() => table.value?.is_occupied);
const cart = ref<CartItem[]>([]);

// 🔁 Fetch product list
const { data: products, isLoading } = useProducts();

// ➕ Tambah produk ke keranjang
const addToCart = (product: any) => {
  if (!product.available) {
    toast.error("Produk tidak tersedia");
    return;
  }

  const existing = cart.value.find((item) => item.product_id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.value.push({
      product_id: product.id,
      name: product.productName,
      price: product.price,
      quantity: 1,
    });
  }
};

const increaseQty = (id: number) => {
  const item = cart.value.find((i) => i.product_id === id);
  if (item) item.quantity++;
};

const decreaseQty = (id: number) => {
  const item = cart.value.find((i) => i.product_id === id);
  if (item && item.quantity > 1) item.quantity--;
  else removeFromCart(id);
};

const removeFromCart = (product_id: number) => {
  cart.value = cart.value.filter((item) => item.product_id !== product_id);
};

// 🔄 Buat order
const { mutate: createOrder, isPending } = useCreateOrder();

const submit = () => {
  if (cart.value.length === 0) return alert("Cart masih kosong!");

  createOrder(
    {
      table_id: tableId.value,
      items: cart.value.map(({ product_id, quantity }) => ({
        product_id,
        quantity,
      })),
    },
    {
      onSuccess: () => {
        cart.value = [];
        toast.success("Order berhasil dibuat, tunggu divalidasi");
      },
      onError: () => {
        toast.error("Gagal mengirim pesanan.");
      },
    }
  );
 ;
};
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-8">
    <!-- Floating Cart Button -->
<Dialog>
  <DialogTrigger as-child>
    <button
      class=" right-6 bottom-0 z-50 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg fixed"
    >
      <ShoppingCart class="w-5 h-5" />
      <Badge
        v-if="totalItems > 0"
        class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs"
      >
        {{ totalItems }}
      </Badge>
    </button>
  </DialogTrigger>

  <DialogContent class="max-w-lg mx-auto">
    <DialogHeader>
      <DialogTitle>🛒 Keranjang</DialogTitle>
    </DialogHeader>

    <div v-if="cart.length">
      <div
        v-for="item in cart"
        :key="item.product_id"
        class="flex justify-between items-center py-3 border-b"
      >
        <div>
          <div class="font-medium text-gray-800">
            {{ item.name }} x {{ item.quantity }}
          </div>
          <div class="text-sm text-gray-500">
            @ Rp {{ item.price.toLocaleString() }}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button size="sm" @click="decreaseQty(item.product_id)">-</Button>
          <Button size="sm" @click="increaseQty(item.product_id)">+</Button>
          <Button
            size="sm"
            variant="destructive"
            @click="removeFromCart(item.product_id)"
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div class="flex justify-between font-bold text-lg pt-6">
        <span>Total</span>
        <span class="text-green-700">
          Rp
          {{
            cart
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toLocaleString()
          }}
        </span>
      </div>

      <button
        @click="submit"
        class="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
        :disabled="isPending"
      >
        Kirim ke Kasir
      </button>
    </div>
    <div v-else class="text-gray-500 text-center py-6">Keranjang kosong</div>
    <DialogDescription/>
  </DialogContent>
</Dialog>

    <h2 class="text-2xl font-bold text-center text-gray-800">
      Pesanan Meja #{{ tableNumber }}
    </h2>
    <div class="text-center">
      <p>Cek ketersediaan meja di bawah ini</p>
      <div v-if="loadingTable" class="text-gray-500">Memuat status meja...</div>
      <div v-else-if="isError" class="text-red-500">
        Meja tidak tersedia
      </div>
      <div v-else>
        <div v-if="isOccupied" class="text-red-600 font-semibold">
          🔒 Meja sudah ada order, tolong tanyakan ke waiters jika kamu belum memesan
        </div>
        <div v-else class="text-green-600 font-semibold">✅ Meja tersedia</div>
      </div>
    </div>
    <!-- 🔹 Produk List -->
    <div v-if="isLoading" class="text-center text-gray-500">
      Memuat produk...
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in products || []"
        :key="product.id || product"
        class="border rounded-xl p-4 shadow-md hover:shadow-lg transition duration-200 bg-white flex flex-col justify-between"
      >
        <div>
          <img
            :src="product.img_url || 'https://via.placeholder.com/150'"
            alt="img"
            class="w-full h-48 object-cover rounded-lg mb-3"
          />
          <h3 class="text-lg font-bold text-gray-800 mb-1">
            {{ product.productName }}
          </h3>
          <p class="text-sm text-gray-500 mb-1">{{ product.description }}</p>
          <p class="text-sm text-yellow-600 font-semibold">
            Rp {{ product.price.toLocaleString() }}
          </p>
        </div>
        <p
          v-if="!product.available"
          class="text-sm text-red-500 font-semibold mt-1"
        >
          🔒 Tidak tersedia
        </p>

        <button
          @click="addToCart(product)"
          :disabled="!product.available"
          class="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md py-2 font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>

 
  </div>
</template>
