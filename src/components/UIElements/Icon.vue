<template>
  <i :class="`cd-icon-${type} ${size}`" />
</template>

<script>
export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'sm',
    },
  },
}
</script>

<style lang="scss" scoped>
  .xl {
    font-size: 5rem;
  }
  .lg {
    font-size: 3rem;
  }
  .md {
    font-size: 1.5rem;
  }
  .sm {
    font-size: 1rem;
  }
</style>
