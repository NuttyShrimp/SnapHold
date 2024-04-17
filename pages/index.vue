<script setup lang='ts'>
import type { Event, Photo } from '@prisma/client';

const { data: events, pending, error } = useFetch<(Event & { photos: Photo[] })[]>("/api/events");
const now = new Date();
const activeEvents = computed(() => events.value?.filter(e => new Date(e.endAt) > now) ?? []);
const endedEvents = computed(() => events.value?.filter(e => new Date(e.endAt) < now) ?? []);

definePageMeta({
  middleware: ["protected"]
})
</script>
<template>
  <h2 class="text-center mt-0">Events</h2>
  <div v-if="pending" class="flex flex-col justify-center items-center h-full">
    <p class="text-center">Loading...</p>
    <UProgress animation="carousel" />
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <h4 class="text-gray-600 dark:text-gray-400">Currently Active</h4>
    <div v-for="event in activeEvents">
      <EventListEntry :key="event.id" :event="event" />
    </div>
    <h4 class="text-gray-600 dark:text-gray-400">Past events</h4>
    <div v-for="event in endedEvents">
      <EventListEntry :key="event.id" :event="event" />
    </div>
  </div>
</template>
