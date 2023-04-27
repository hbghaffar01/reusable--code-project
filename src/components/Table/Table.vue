<template>
  <table :class="type">
    <slot name="children" />
  </table>
</template>

<script>
export default {
  name: 'Table',
  props: {
    type: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/base/colors";

  table {
    width: 100%;
    border-radius: 7px;
    overflow: hidden;
    background-color: $white;
    &.default {
      display: block;
    }

    &.striped {
      display: block;
    }
  }
</style>
