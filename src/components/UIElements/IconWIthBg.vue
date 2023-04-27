<template>
  <Icon :class="bg" :size="size" :type="type" :style="`width: ${bgSize}; height: ${bgSize}`" />
</template>

<script>
import { Icon } from '@/components/UIElements'

export default {
  name: 'IconWIthBg',
  components: { Icon },
  props: {
    bg: {
      type: String,
      default: 'primary',
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '',
    },
    bgSize: {
      type: String,
      default: '5rem',
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';

.primary, .secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $primary-default;
  color: $white;
  border-radius: 50%;
  padding: 20px;
}

.secondary {
  background-color: $secondary-default;
}
</style>
