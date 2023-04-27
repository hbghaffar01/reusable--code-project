<template>
  <div class="display-2">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'Display2',
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

  .display-2 {
    font-size: 4.5rem;
    font-family: $fontFamily;
    color: $fontColor;
  }
</style>
