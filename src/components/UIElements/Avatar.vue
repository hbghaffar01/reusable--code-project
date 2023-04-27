<template>
  <div :class="`_avatar _avatar-${size}`">
    <ImageElement :src="src" :alt="alt" class="_avatar-image" />
  </div>
</template>

<script>
import ImageElement from './ImageElement.vue'

export default {
  name: 'Avatar',
  components: {
    ImageElement,
  },
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'md',
    },
  },
  setup() {
    return {}
  },
}
</script>

<style lang="scss">
  @import '@/assets/scss/base/colors';

  ._avatar {
    border-radius: 100%;
    border: 1px solid rgba($primary-light, 0.1);
    display: flex;
    &-image {
      border-radius: 100%;
      max-width: 100%;
    }
    &-lg {
      width: 56px;
      height: 56px;
    }
    &-md {
      width: 36px;
      height: 36px;
    }
    &-sm {
      width: 24px;
      height: 24px;
    }
  }

</style>
