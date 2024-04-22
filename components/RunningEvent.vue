<script setup lang="ts">
import type { SerializedEvent } from '~/utils/types';
import type Camera from './Camera.vue';

defineProps<{ event: SerializedEvent }>();
const route = useRoute();

const { data, pending, error, refresh } = useFetch(`/api/events/${route.params.id}/photos/left`)

const camera = ref<typeof Camera | null>();
const cameraLoaded = ref(false);

const handleUnsupported = (e: Error) => {
  console.log(e)
}

const handleCamError = (e: Error) => {
  console.error(e)
}

const handleTakePhoto = () => {
  if (!camera.value || !cameraLoaded.value || !data) return;
  camera.value.takePhoto();
}
const handlePhotoTaken = async (e: { blob: Blob, image_data_url: string }) => {
  const fd = new FormData();
  fd.append("photo", e.blob);
  await $fetch(`/api/events/${route.params.id}/photos`, {
    method: "POST",
    body: fd
  });
  refresh();
}

const handleCameraStart = () => {
  cameraLoaded.value = true;
}

const handleCameraStop = () => {
  cameraLoaded.value = false;
}

</script>
<template>
  <div v-if="error">
    <p>Error: {{ error }}</p>
  </div>
  <div v-else class="relative h-full flex flex-col">
    <div class="flex flex-row justify-between absolute top-0 left-0 w-full z-10 p-4">
      <div class="flex-1">
        <UButton icon="i-heroicons-chevron-left" variant="soft" size="sm" square to="/" />
      </div>
      <div class="flex-1 text-center">
        <p class="font-bold m-0">{{ event.name }}</p>
      </div>
      <div class="flex-1 flex justify-end">
        <UButton icon="i-fa6-solid-camera-rotate" variant="soft" size="sm" square @click="camera?.rotateCamera" />
      </div>
    </div>
    <div class="flex flex-1 items-center justify-center ">
      <ClientOnly fallback-tag="span" fallback="Loading the camera...">
        <Camera ref="camera" @unsupported="handleUnsupported" @error="handleCamError" @photo-taken="handlePhotoTaken"
          @start="handleCameraStart" @stop="handleCameraStop" />
      </ClientOnly>
    </div>
    <div class="flex flex-row z-10 w-full items-center rounded-t bg-cool-800 p-2">
      <div class="flex-1 pl-2">
        <div class="w-20" v-if="data === undefined || pending">
          <UProgress animation="carousel" />
        </div>
        <div class="w-min flex flex-row font-bold not-prose items-center text-cool-100" v-else>
          <p class="text-4xl text-center italic font-extrabold">{{ data }}</p>
          <div class="ml-1">
            <p class="text-md">SHOTS</p>
            <p class="text-xs">REMAINING</p>
          </div>
        </div>
      </div>
      <div class="flex-1 flex justify-center">
        <div class="h-16 w-16 rounded-full bg-white cursor-pointer"
          :class="{ '!bg-cool-400 cursor-wait': !data || pending || !cameraLoaded }" @click="handleTakePhoto"></div>
      </div>
      <div class="flex-1">
      </div>
    </div>
  </div>
</template>
