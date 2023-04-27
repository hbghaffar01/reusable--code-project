<template>
  <FlatPicker
    v-model="dateRange"
    class="invite-calender"
    :config="{ mode: 'range', inline: 'true', dateFormat: 'Y-m-d', minDate: minDate }"
    @input="setDate"
  />
</template>

<script>
import FlatPicker from 'vue-flatpickr-component'

export default {
  name: 'RangeCalender',
  components: {
    FlatPicker,
  },
  props: {
    range: {
      type: String,
      required: true,
    },
    minDate: {
      type: [Date, null, undefined],
      default: null,
    },
  },
  data() {
    return {
      dateRange: this.range,
    }
  },
  watch: {
    range: {
      handler() {
        this.dateRange = this.range
      },
      deep: true,
    },
  },
  methods: {
    setDate() {
      this.$emit('selectedDate', this.dateRange)
    },
  },
}
</script>

<style scoped lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
@import "@/@core/mixins/ui/_input.scss";

.invite-calender {
  width: 64%;
  @include input(10px, $black, 14px, 400, 17px, #CAA8F5, 5px);
}
</style>
