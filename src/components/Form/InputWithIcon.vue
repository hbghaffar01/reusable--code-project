<template>
  <div class="input">
    <slot name="input" />
    <Icon class="input-icon" :type="icon" />
  </div>
</template>

<script>
import { Icon } from '@/components/UIElements'

export default {
  name: 'InputWithIcon',
  components: {
    Icon,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';

.input {
  display: flex;
  align-items: center;
  position:relative;
  width: 100%;

  &-icon {
    position: absolute;
    right: 0.8rem;
    color: $fontColor;
  }
}
</style>
