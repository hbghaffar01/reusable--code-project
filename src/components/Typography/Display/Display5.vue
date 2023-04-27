<template>
  <div class="display-5">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'Display5',
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

  .display-5 {
    font-size: 3rem;
    font-family: $fontFamily;
    color: $fontColor;
  }
</style>
