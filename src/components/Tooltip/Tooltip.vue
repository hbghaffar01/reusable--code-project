<template>
  <div>
    <img
      :id="targetId"
      alt="tooltip"
      src="../../assets/images/modal/Tooltip.svg"
      class="cursor-pointer"
      @click="showTooltip = !showTooltip"
    >
    <b-tooltip
      ref="tooltip"
      v-b-toggle.tooltip
      :target="targetId"
      placement="auto"
      triggers="click"
      :show="showTooltip"
    >
      {{ msg }}
    </b-tooltip>
  </div>
</template>

<script>
export default {
  name: 'TooltipVue',
  props: {
    msg: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showTooltip: false,
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdown)
  },
  methods: {
    closeDropdown(event) {
      if (
        this.$refs.tooltip
          && !this.$refs.tooltip.$el.contains(event.target)
          && event.target.id !== this.targetId
      ) {
        this.showTooltip = false
      }
    },
  },
}
</script>

<style>
</style>
