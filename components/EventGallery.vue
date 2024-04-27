<script lang="ts" setup>
import type { Photo, User } from '@prisma/client';

const route = useRoute();
const { data: photos, pending, error } = useFetch(`/api/events/${route.params.id}/photos`)
const isOpen = ref(false);
const photoSelected = ref<Photo & { user: User } | null>(null);

const openModal = (photo: Photo & { user: User }) => {
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
  <div v-if="pending || !photos" class="flex flex-col justify-center items-center h-full">
    <p class="text-center">Loading...</p>
    <UProgress animation="carousel" />
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="flex flex-wrap gap-2 not-prose">
      <div v-for="photo in photos" :key="photo.id" class="m-2">
        <img :src="photo.url" alt="photo" class="w-24 h-auto rounded" @click="() => openModal(photo)" />
        <p class="text-xs">{{ photo.user.name }}</p>
      </div>
    </div>
  </div>
  <UModal :ui="{ container: 'items-center' }" v-model="isOpen">
    <div class="p-4">
      <img :src="photoSelected?.url" alt="photo" class="w-auto h-auto rounded" />
      <p class="text mt-2">{{ photoSelected?.user.name }}</p>
    </div>
  </UModal>
</template>
