<template>
  <input :class="inputStyle" :type="inputType" @input="$emit('input', $event.target.value)">
</template>
<script>
export default {
  name: 'Input',
  props: {
    inputType: {
      type: String,
      default: 'text',
    },
    inputStyle: {
      type: String,
      default: '',
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base/colors";
@import "@/assets/scss/base/variables";

input {
  color: $black;
  border: 1.5px solid $primary-default;
  border-radius: 7px;
  padding: 10px 15px;
  font-family: $fontFamily;
  font-size: 1rem;
  line-height: 1.33;
  font-weight: normal;

  &.round {
    border-radius: 35px;
  }

  &.narrow {
    max-height: 35px;
    font-size: 0.75rem;
  }

  &:focus, &:active, &:focus-visible {
    border-color: $primary-default;
    outline: none;
  }

  &[readonly], &:disabled {
    background-color: $gray;
    border-color: rgba($fontColor, 0.02);
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
