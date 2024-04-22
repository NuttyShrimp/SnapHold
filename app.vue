<script setup lang="ts">
import adapter from "webrtc-adapter";
console.log(adapter.browserDetails.browser)
</script>
<template>
  <div class='prose dark:prose-invert !max-w-[100vw] w-screen h-screen'>
    <NuxtPwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
