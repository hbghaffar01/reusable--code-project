<template>
  <div>
    <!-- TODO:   to make the Label, sub, and tooltip separate components I'm including tooltip so maybe in the future if we want to use some other tooltip component it will be only one component change.-->
    <label
      :for="inputId"
      class="text-sm font-style flex items-center"
    >
      <span>{{ label }}</span>
      <sub
        v-if="isRequired"
        class="text-danger text-lg label-required"
      >*</sub>

      <Tooltip
        v-if="tooltipMsg"
        :msg="tooltipMsg"
        :target-id="inputId"
      />
    </label>
    <input
      :id="inputId"
      :type="type"
      :class="inputClass"
      :value="value"
      :disabled="isDisabled"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event)"
    >
  </div>
</template>

<script>
import Tooltip from '@/components/Tooltip/Tooltip.vue'

export default {
  name: 'InputComponent',
  components: { Tooltip },
  props: {
    label: {
      type: String,
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    tooltipMsg: {
      type: String,
      default: '',
    },
    inputId: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    inputClass: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/@core/scss/base/core/colors/palette-variables.scss";
@import "@/@core/mixins/ui/_input.scss";
.invite-ipt {
  width: 100%;
  @include input(0 10px, $black, 14px, 400, 17px, #caa8f5, 5px);
}
.ipt-padding {
  padding: 10px;
}
.label-required {
  margin: 0 0.5rem;
}
</style>
