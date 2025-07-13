<template>
  <UApp :locale="ja">
    <header
      class="w-full sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
    >
      <div class="w-full h-16 px-8 flex items-center justify-between">
        <ULink to="/">Noise.log</ULink>
        <ClientOnly v-if="!colorMode?.forced">
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="ghost"
            @click="isDark = !isDark"
          />
        </ClientOnly>
      </div>
    </header>

    <main class="p-6">
      <UContainer>
        <NuxtPage />
      </UContainer>
    </main>
  </UApp>
</template>

<script setup lang="ts">
import { ja } from "@nuxt/ui/locale";

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>
