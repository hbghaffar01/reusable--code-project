<template>
  <h6>{{ value }}</h6>
</template>

<script>
export default {
  name: 'H6',
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

  h6 {
    font-family: $fontFamily;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.3;
    color: $fontColor;
  }
</style>
