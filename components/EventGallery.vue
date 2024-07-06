<script lang="ts" setup>
import type { User } from '@prisma/client';
import dayjs from 'dayjs';

defineProps<{ event: SerializedEvent }>();
const route = useRoute();
const { data: photos, status, error } = useFetch(`/api/events/${route.params.id}/photos`)
const isOpen = ref(false);
const photoSelected = ref<PhotoData | null>(null);

declare type PhotoData = SerializedPhoto & { user: User };

// Map photos to record of date to array of photos
const mappedPhotos = computed(() => {
  if (!photos.value) return {}
  let mapped: Record<string, PhotoData[]> = {};
  photos.value.forEach((photo) => {
    const date = dayjs(photo.created_at).format("YYYY-MM-DD");
    if (!mapped[date]) {
      mapped[date] = [];
    }
    mapped[date].push(photo);
  });
  return mapped;
});

const openModal = (photo: PhotoData) => {
  photoSelected.value = photo;
  isOpen.value = true;
};

watch(isOpen, (value) => {
  setTimeout(() => {
    if (!value) {
      photoSelected.value = null;
    }
  }, 500);
});
</script>
<template>
  <h1 class="text-xl font-bold m-0 p-2 flex items-center gap-2">
    <UButton icon="i-heroicons-chevron-left" variant="soft" size="sm" square to="/" /> {{ event.name }}
  </h1>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="status !== 'success' || !photos" class="flex flex-col justify-center items-center h-full">
    <p class="text-center">Loading...</p>
    <UProgress animation="carousel" />
  </div>
  <div v-else>
    <div class="flex flex-wrap gap-2 not-prose w-full">
      <div v-for="date in Object.keys(mappedPhotos)" class="w-full px-2">
        <h3 class="font-semibold text-lg">{{ date }}</h3>
        <div class="flex flex-wrap justify-center">
          <div v-for="photo in mappedPhotos[date]" :key="photo.id" class="p-1 m-1 flex flex-col items-center w-fit">
            <img :src="photo.url" alt="photo" class="w-24 h-auto rounded" @click="() => openModal(photo)" />
            <p class="text-xs">{{ photo.user.name }} - {{ dayjs(photo.created_at).format("HH:mm") }}</p>
          </div>
        </div>
        <hr class="border-gray-500" />
      </div>
    </div>
  </div>
  <UModal :ui="{ container: 'items-center' }" v-model="isOpen">
    <div class="p-4">
      <img :src="photoSelected?.url" alt="photo" class="w-auto h-auto rounded" />
      <p class="text mt-2">{{ photoSelected?.user.name }} -
        <span>{{ dayjs(photoSelected?.created_at).format("YYYY-MM-DD HH: mm") }}</span>
      </p>
    </div>
  </UModal>
</template>
