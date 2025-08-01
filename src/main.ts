import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { Toaster } from 'vue-sonner';
import { useAuthStore } from './store/auth';
import "vue-sonner/style.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
app.use(VueQueryPlugin);
app.component("Toaster", Toaster);
const auth = useAuthStore();
auth.checkTokenValidity();