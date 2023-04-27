<template>
  <h4>{{ value }}</h4>
</template>

<script>
export default {
  name: 'H4',
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

  h4 {
    font-family: $fontFamily;
    font-weight: 500;
    font-size: 2rem;
    line-height: 1.3;
    color: $fontColor;
  }
</style>
