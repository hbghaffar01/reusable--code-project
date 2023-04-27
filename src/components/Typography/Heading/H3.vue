<template>
  <h3>{{ value }}</h3>
</template>

<script>
export default {
  name: 'H3',
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
  h3 {
    font-family: $fontFamily;
    color: $fontColor;
    font-size: 2.5rem;
  }
</style>
