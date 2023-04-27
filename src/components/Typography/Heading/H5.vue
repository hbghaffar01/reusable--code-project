<template>
  <h5>{{ value }}</h5>
</template>

<script>
export default {
  name: 'H5',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/base/variables";
  @import "@/assets/scss/base/colors";
  h5 {
    font-family: $fontFamily;
    color: $fontColor;
    font-size: 1.5rem;
  }
</style>
