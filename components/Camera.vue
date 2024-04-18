<script setup lang="ts">
const emit = defineEmits(['start', "stop", 'error', 'unsupported', 'photoTaken']);

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null);
const shutter = ref<HTMLDivElement | null>(null);

const preferredCameraLabels = ['back', 'usb']
const imageType = 'image/jpeg';
const deviceStorageToken = '_snaphold_device_id'

const deviceId = ref<ConstrainDOMString | null>(null);
const cameras = reactive<MediaDeviceInfo[]>([]);
const inited = ref(false);

const buildConstraints = (deviceId?: ConstrainDOMString) => {
  const c: MediaStreamConstraints = { video: { facingMode: "environment" }, audio: false };
  if (deviceId) {
    if (typeof c.video !== 'object' || c.video === null) {
      c.video = {}
    }
    c.video.deviceId = deviceId
  }
  return c;
}

const loadCameras = () => {
  navigator.mediaDevices
    .enumerateDevices()
    .then(deviceInfos => {
      for (let i = 0; i !== deviceInfos.length; ++i) {
        let deviceInfo = deviceInfos[i];
        if (deviceInfo.kind === 'videoinput' && cameras.find(el => el.deviceId === deviceInfo.deviceId) === undefined) {
          cameras.push(deviceInfo);
        }
      }
    })
    .then(() => {
      if (!inited.value) {
        if (deviceId.value === null) {
          start();
        }
        inited.value = true;
      }
    })
    .catch(error => emit('unsupported', error));
}

const loadCamera = (deviceId: ConstrainDOMString) => {
  navigator.mediaDevices
    .getUserMedia(buildConstraints(deviceId))
    .then(stream => {
      if (!video.value) {
        console.error('Video element not found')
        return;
      };
      video.value.srcObject = stream

      window.localStorage.setItem(deviceStorageToken, deviceId.toString())
    })
    .catch(err => emit('error', err));
}

const testMediaAccess = () => {
  navigator.mediaDevices
    .getUserMedia(buildConstraints())
    .then(stream => {
      let tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      loadCameras();
    })
    .catch(err => emit('error', err))
}

const setupMedia = () => {
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = (constraints?: MediaStreamConstraints) => {
      let getUserMedia =
        // @ts-expect-error Legacy boi
        navigator.getUserMedia ||
        // @ts-expect-error Legacy boi
        navigator.webkitGetUserMedia ||
        // @ts-expect-error Legacy boi
        navigator.mozGetUserMedia ||
        // @ts-expect-error Legacy boi
        navigator.msGetUserMedia ||
        // @ts-expect-error Legacy boi
        navigator.oGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        );
      }
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
  testMediaAccess();
}

const start = () => {
  if (deviceId.value) {
    loadCamera(deviceId.value);
  } else {
    // check if there is any remembered device and if so, use them
    const rememberedDevice = window.localStorage.getItem(deviceStorageToken);
    if (rememberedDevice && cameras.find(el => el.deviceId === rememberedDevice)) {
      deviceId.value = rememberedDevice;
    } else if (cameras.length > 1) {
      for (const label of preferredCameraLabels) {
        const camera = cameras.find(el => el.label.toLowerCase().indexOf(label) !== -1)
        if (camera) {
          deviceId.value = camera.deviceId;
          break;
        }
      }
    }
    // nothing found, use first if there is any
    if (!deviceId.value && cameras.length > 0) {
      deviceId.value = cameras[0].deviceId;
    }
  }
  emit('start');
}

const clear = (video: HTMLVideoElement) => {
  (video.srcObject as MediaStream).getTracks().forEach(track => {
    track.stop();
    video.srcObject = null;
  });
}

const stop = () => {
  if (video.value?.srcObject) {
    clear(video.value);
  }
  emit('stop');
}

const changeCamera = (newdeviceId: ConstrainDOMString) => {
  if (deviceId.value !== newdeviceId) {
    deviceId.value = newdeviceId;
    return // will be recalled due to watcher
  }
  stop();
  if (newdeviceId) {
    start();
  }
}

const takePhoto = () => {
  if (!video.value || !canvas.value) return;
  canvas.value.height = video.value.videoHeight;
  canvas.value.width = video.value.videoWidth;
  let ctx = canvas.value.getContext('2d');

  ctx?.drawImage(video.value, 0, 0, video.value.videoWidth, video.value.videoHeight);

  let image_data_url = canvas.value.toDataURL(imageType);
  canvas.value.toBlob(blob => {

    if (shutter.value) {
      shutter.value.classList.add('on');
      setTimeout(() => {
        if (!shutter.value) return;
        shutter.value.classList.remove('on');
      }, 30 * 2 + 45);
    }
    emit('photoTaken', { blob, image_data_url });
  }, imageType);
}

const rotateCamera = () => {
  if (cameras.length < 2) return;
  const current = cameras.findIndex(el => el.deviceId === deviceId.value);
  const next = (current + 1) % cameras.length;
  deviceId.value = cameras[next].deviceId;

}

onMounted(() => {
  setupMedia();
});

onBeforeUnmount(() => {
  stop();
})

watch(deviceId, (newId) => {
  changeCamera(newId as ConstrainDOMString);
})

defineExpose({
  takePhoto,
  rotateCamera
})
</script>
<template>
  <div class="not-prose">

    <video v-if="deviceId" ref="video" class="w-full object-contain" autoplay />
    <div v-else>
      <USkeleton class="w-[95vw] h-[85svh]" />
    </div>

    <canvas ref="canvas" style="display: none;" />
    <div ref="shutter" class="shutter"></div>
  </div>
</template>

<style scoped>
.shutter {
  opacity: 0;
  transition: all 30ms ease-in;
  position: fixed;
  height: 0%;
  width: 0%;
  pointer-events: none;

  background-color: black;

  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%)
}

.shutter.on {
  opacity: 1;
  /* Shutter Transparency */
  height: 100%;
  width: 100%;
}
</style>
