<template>
  <tr>
    <slot name="children" />
  </tr>
</template>

<script>
export default {
  name: 'TR',
}
</script>

<style lang="scss" scoped>
  tr {
    background: transparent !important;
  }
</style>
