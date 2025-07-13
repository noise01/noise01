<template>
  <ContentRenderer v-if="page" :value="page" />
  <div v-else>
    <h1>Page Not Found</h1>
    <p>お探しのページは見つかりませんでした。</p>
    <NuxtLink to="/">トップページに戻る</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection("content").path(route.path).first();
});
</script>
