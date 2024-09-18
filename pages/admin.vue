<script setup lang="ts">
definePageMeta({
  middlewate: ["admin"]
})

const state = reactive({
  name: "",
  startAt: "",
  endAt: "",
  photoLimit: 25
});

const createEvent = async () => {
  await $fetch("/api/events", {
    method: "POST",
    body: JSON.stringify({
      name: state.name,
      startAt: new Date(state.startAt).toISOString(),
      endAt: new Date(state.endAt).toISOString(),
      photoLimit: state.photoLimit
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
      <UInput v-model="state.name" color="primary" variant="outline" placeholder="Name" />
      <input v-model="state.startAt" type="datetime-local" placeholder="Start at" />
      <input v-model="state.endAt" type="datetime-local" placeholder="End at" />
      <UInput v-model="state.photoLimit" type="number" min="5" max="50" color="primary" variant="outline"
        placeholder="Photolimiet" />
      <UButton label="create" @click="createEvent" />
    </div>
  </div>
</template>
