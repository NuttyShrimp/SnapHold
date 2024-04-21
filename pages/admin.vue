<script setup lang="ts">
definePageMeta({
  middlewate: ["admin"]
})

const name = ref('')
const startAt = ref('')
const endAt = ref('')
const photoLimit = ref(25);

const createEvent = async () => {
  const res = await $fetch("/api/events", {
    method: "POST",
    body: JSON.stringify({
      name: name.value,
      startAt: new Date(startAt.value).toISOString(),
      endAt: new Date(endAt.value).toISOString(),
      photoLimit: photoLimit.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
}
</script>
<template>
  <div class="container p-4 mx-auto">
    <div class="flex flex-col gap-4 items-center">
      <UInput v-model="name" color="primary" variant="outline" placeholder="Name" />
      <input v-model="startAt" type="datetime-local" placeholder="Start at" />
      <input v-model="endAt" type="datetime-local" placeholder="End at" />
      <UInput v-model="photoLimit" type="number" min="5" max="50" color="primary" variant="outline"
        placeholder="Photolimiet" />
      <UButton label="create" @click="createEvent" />
    </div>
  </div>
</template>