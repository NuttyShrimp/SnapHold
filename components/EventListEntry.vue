<script setup lang="ts">
import type { Event, Photo } from "@prisma/client";

defineProps<{ event: (Event & { photos: Photo[] }); showPreview?: boolean }>()

const timeInfoClass = 'text-sm text-gray-500'
</script>
<template>
  <NuxtLink :to="`/events/${event.id}`" class="not-prose">
    <div class="flex flex-row items-center">
      <div class="h-20 w-12 rounded-lg flex items-center justify-center overflow-hidden">
        <NuxtImg v-if="event.photos.length > 0 && showPreview" :src="event.photos[0].url"
          class="object-contain h-20 w-12" />
        <div v-else class="text-3xl">
          <UIcon name="i-heroicons-camera" />
        </div>
      </div>
      <div class="ml-2">
        <p class="font-semibold p-0">
          {{ event.name }}
        </p>
        <p v-if="$dayjs(event.startAt).isAfter($dayjs())" :class="timeInfoClass">
          Starts in {{ $dayjs(event.startAt).fromNow() }}
        </p>
        <p v-else-if="$dayjs(event.startAt).isBefore($dayjs()) && $dayjs(event.endAt).isAfter($dayjs())"
          :class="timeInfoClass">
          Ends {{ $dayjs(event.endAt).fromNow() }}
        </p>
        <p v-else :class="timeInfoClass">
          Ended {{ $dayjs(event.endAt).fromNow() }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
