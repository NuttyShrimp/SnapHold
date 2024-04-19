<script setup lang="ts">
definePageMeta({
  layout: false
})

const user = useUser();

const handleGoogleLogin = () => {
  navigateTo("/login/google");
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
  <div class="flex h-[80%] items-end justify-center not-prose">
    <UButton icon="i-devicon-plain-google" size="lg" color="primary" variant="solid" label="Login with google"
      :trailing="false" @click="handleGoogleLogin" />
  </div>
</template>
