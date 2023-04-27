<template>
  <td>
    {{ value }}
    <slot name="children" />
  </td>
</template>

<script>
export default {
  name: 'TD',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/base/colors";

  td {
    padding: 13px;
    vertical-align: middle;
    text-align: center;
    min-width: 30px;
    background-color: $secondary-bg
  }
</style>
