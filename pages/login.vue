<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: [],
})

const user = useUser();

const handleGoogleLogin = () => {
  navigateTo("/login/google", {
    external: true
  });
}

const handleMicrosoftLogin = () => {
  navigateTo("/login/microsoft", {
    external: true
  });
}

onMounted(() => {
  if (user.value) {
    navigateTo("/")
  }
})
</script>
<template>
  <div class="flex justify-center">
    <h1 class="text-2xl mt-4">SnapHold</h1>
  </div>
  <div class="flex flex-col gap-2 h-[80%] items-center justify-end not-prose">
    <UButton icon="i-mdi-microsoft" size="lg" color="blue" variant="solid" label="Login with microsoft"
      :trailing="false" @click="handleMicrosoftLogin" />
    <UButton icon="i-devicon-plain-google" size="lg" color="primary" variant="solid" label="Login with google"
      :trailing="false" @click="handleGoogleLogin" />
  </div>
</template>
