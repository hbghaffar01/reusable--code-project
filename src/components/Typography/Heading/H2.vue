<template>
  <h2>{{ value }}</h2>
</template>

<script>
export default {
  name: 'H2',
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
  h2 {
    font-family: $fontFamily;
    color: $fontColor;
    font-size: 3rem;
  }
</style>
