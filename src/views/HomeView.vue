<template>
  <section class="min-h-screen bg-[url('/coffee-bg.jpg')] bg-cover bg-center flex flex-col items-center justify-center text-white px-4">
    <div class="backdrop-blur-sm bg-black/50 rounded-xl p-6 max-w-2xl text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-4">Selamat Datang di <span class="text-yellow-400">Kopi Kita</span></h1>
      <p class="text-lg md:text-xl mb-6">
        Temukan aroma dan rasa kopi terbaik dari biji pilihan khas Nusantara.
      </p>
      <button
       class="bg-yellow-500 hover:bg-yellow-600 transition px-6 py-3 rounded-full text-lg font-semibold"
      >
        Buka kamera mu lalu scan qr code di meja, selamat memesan!! :)
      </button>
    </div>
  </section>

  <section class="bg-white text-gray-800 py-16 px-4">
    <div class="max-w-5xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-6">Kenapa Memilih Kami?</h2>
      <p class="mb-8 text-lg text-gray-600">Kami menyajikan pengalaman ngopi yang tak terlupakan, dari suasana hangat hingga cita rasa kopi yang autentik.</p>
      <div class="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon="☕"
          title="Kopi Berkualitas"
          desc="Disajikan dari biji kopi pilihan dengan proses yang tepat."
        />
        <FeatureCard
          icon="🏡"
          title="Suasana Nyaman"
          desc="Tempat cozy untuk nongkrong, kerja, atau sekedar bersantai."
        />
        <FeatureCard
          icon="🧑‍🍳"
          title="Barista Profesional"
          desc="Tim barista berpengalaman siap memanjakan selera Anda."
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FeatureCard from '@/components/FeatureCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

</script>
