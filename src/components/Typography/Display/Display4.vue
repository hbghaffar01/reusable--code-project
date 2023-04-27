<template>
  <div class="display-4">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'Display4',
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

  .display-4 {
    font-size: 3.5rem;
    font-family: $fontFamily;
    color: $fontColor;
  }
</style>
