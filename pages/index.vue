<template>
  <ContentRenderer v-if="page" :value="page" />
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData(() =>
  queryCollection("content").path("/").first()
);

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
});
</script>
