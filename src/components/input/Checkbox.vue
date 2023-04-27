<template>
  <label class="checkbox-container text-sm font-normal m-0">
    <input
      type="checkbox"
      :disabled="isDisabled"
      @change="$emit('onToggleCheckbox', label)"
    >
    <span class="text-base font-weight-bolder checkbox-margin">
      {{ label }}</span>
    <span :class="isChecked ? 'checkbox-label-active' : 'checkbox-label-disabled'" />
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    label: {
      type: String,
      required: true,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/global.scss";
@import "@/@core/mixins/ui/_button.scss";
@import "@/@core/mixins/ui/_input.scss";
@import "@/@core/scss/base/core/colors/palette-variables.scss";
@import '@core/scss/vue/libs/vue-select.scss';
</style>
