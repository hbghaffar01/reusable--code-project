<template>
  <thead :class="`custom-table-head ${type}`">
    <slot name="children" />
  </thead>
</template>

<script>
export default {
  name: 'Thead',
  props: {
    type: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss">
  @import '@/assets/scss/base/colors';
  @import '@/assets/scss/base/variables';

  .custom-table-head {
    &.primary-gradient {
      tr {
        display: table;
        table-layout: fixed;
        width: 100%;
        height: $tableTheadHeight;
        background: linear-gradient(89deg, rgba($primary-default-r, $primary-default-g, $primary-default-b, 0.6) 15%, $primary-default 100%) !important;
        color: $white;
      }
    }
  }
</style>
