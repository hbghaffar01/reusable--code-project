<template>
  <th>
    {{ value }}
    <slot name="children" />
  </th>
</template>

<script>
export default {
  name: 'TH',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  th {
    padding: 20px 0;
    vertical-align: middle;
    text-align: center;
    min-width: 30px;
  }
</style>
