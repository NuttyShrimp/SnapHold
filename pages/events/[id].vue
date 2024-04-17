<script lang="ts" setup>
const route = useRoute();
const { data: event, error, pending } = useFetch(`/api/events/${route.params.id}`);

definePageMeta({
  middleware: ["protected"]
})
</script>

<template>
  <div v-if="pending || !event" class="flex flex-col justify-center items-center h-full">
    <p class="text-center">Loading...</p>
    <UProgress animation="carousel" />
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="h-full w-full">
    <RunningEvent v-if="new Date(event!.endAt) > new Date()" :event="event!" />
    <EventGallery v-else :event="event" />
  </div>
</template>