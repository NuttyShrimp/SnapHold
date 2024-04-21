<script setup lang="ts">
import type { Event, Photo } from "@prisma/client";

const props = defineProps<{ event: (Event & { photos: Photo[] }); showPreview?: boolean }>()
const toast = useToast();

const timeInfoClass = 'text-sm text-gray-500'

const handleEntryClick = () => {
  const now = new Date();
  if (new Date(props.event.startAt) > now) {
    toast.add({
      title: "Event has not started yet!",
      color: "amber"
    })
    return;
  }
  navigateTo(`/events/${props.event.id}`)
}
</script>
<template>
  <div class="flex flex-row items-center cursor-pointer not-prose" @click="handleEntryClick">
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
</template>
