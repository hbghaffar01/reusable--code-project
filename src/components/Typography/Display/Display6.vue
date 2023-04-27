<template>
  <div class="display-6">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'Display6',
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

  .display-6 {
    font-size: 2.5rem;
    font-family: $fontFamily;
    color: $fontColor;
  }
</style>
