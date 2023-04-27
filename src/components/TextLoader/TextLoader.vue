<template>
  <div class="text-loader" :style="`width: ${width}; height: ${height}`" />
</template>

<script>
export default {
  name: 'TextLoader',
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '1rem',
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/base/colors';
  @import '@/assets/scss/base/animations';

  .text-loader {
    display: inline-block;
    background: $gray;
    animation: fade 1s ease infinite;
    border-radius: 0.6rem;
    max-width: 100%;
  }
</style>
