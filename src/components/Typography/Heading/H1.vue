<template>
  <h1>{{ value }}</h1>
</template>

<script>
export default {
  name: 'H1',
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
  h1 {
    font-family: $fontFamily;
    color: $fontColor;
    font-size: 3.5rem;
  }
</style>
