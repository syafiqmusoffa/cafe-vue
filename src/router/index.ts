import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../store/auth";
import LoginView from "../views/LoginView.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import KasirDashboard from "../views/KasirDashboard.vue";
import HomeView from "@/views/HomeView.vue";
import OrderPage from "@/views/OrderPage.vue";
import UserManagement from "@/components/UserManagement.vue";
import TableManagement from "@/components/TableManagement.vue";
import ProductManagement from "@/components/ProductManagement.vue";
import DashboardKasir from "@/components/DashboardKasir.vue";
import OrderList from "@/components/OrderList.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "home", component: HomeView },
  { path: "/login", name: "Login", component: LoginView },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "cashier", component: UserManagement },
      { path: "tables", component: TableManagement },
      { path: "products", component: ProductManagement },
    ],
  },
  {
    path: "/kasir",
    component: KasirDashboard,
    meta: { requiresAuth: true, role: "cashier" },
    children: [
      { path: "orders", component: DashboardKasir },
      { path: "order-list", component: OrderList },
    ],
  },
  {
    path: "/order/:table_number",
    name: "orderPage",
    component: OrderPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard
router.beforeEach(
  (to: RouteLocationNormalized, _, next: NavigationGuardNext) => {
    const auth = useAuthStore();

    // ✅ Jika menuju "/" (halaman publik), langsung lanjut tanpa cek login
    if (to.path === "/") {
      return next();
    }

    // ✅ Jika sudah login & menuju halaman login → redirect ke dashboard sesuai role
    if (to.path === "/login" && auth.token) {
      if (auth.role === "admin") {
        return next("/admin");
      } else if (auth.role === "cashier") {
        return next("/kasir");
      }
    }

    // ✅ Jika route butuh auth
    if (to.meta.requiresAuth) {
      if (!auth.token) {
        // Belum login → ke login
        return next("/login");
      } else if (to.meta.role && to.meta.role !== auth.role) {
        // Sudah login tapi salah role → lempar ke dashboard sesuai role
        if (auth.role === "admin") return next("/admin");
        if (auth.role === "cashier") return next("/kasir");
        return next("/login");
      }
    }

    // ✅ Jika semua sesuai, lanjut
    next();
  }
);

export default router;
