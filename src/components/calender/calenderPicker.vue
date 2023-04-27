<template>
  <div>
    <flat-pickr
      v-model="date"
      :config="config"
      placeholder="Select date"
      class="invite-ipt"
      @on-change="handleOnClose"
    />
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'

export default {
  components: {
    flatPickr,
  },
  props: {
    mode: {
      type: String,
      default: 'single',
    },
    minDate: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      date: this.minDate,
      config: {
        mode: 'single',
        dateFormat: 'j M Y',
        inline: true,
      },
    }
  },
  methods: {
    handleOnClose() {
      this.$emit('dateSelected', this.date)
    },
  },
}
</script>

<style scoped lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
@import "@/@core/mixins/ui/_input.scss";

.invite-ipt {
  width: 64%;
  @include input(10px, $black, 14px, 400, 17px, #caa8f5, 5px);
}

</style>
