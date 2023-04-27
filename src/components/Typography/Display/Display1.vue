<template>
  <div class="display-1">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'Display1',
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

  .display-1 {
    font-size: 5rem;
    font-family: $fontFamily;
    color: $fontColor;
  }
</style>
