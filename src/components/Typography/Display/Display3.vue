<template>
  <div class="display-3">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'Display3',
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

  .display-3 {
    font-size: 4rem;
    font-family: $fontFamily;
    color: $fontColor;
  }
</style>
