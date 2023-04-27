<template>
  <button :class="`${btnType} ${btnStyle} ${size}`" @click="handleClick">
    {{ value }}
    <slot name="children" />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    value: {
      type: String,
      default: '',
    },
    btnType: {
      type: String,
      default: '',
    },
    btnStyle: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/base/colors";
  @import "@/assets/scss/base/variables";

  button {
    background-color: transparent;
    padding: 14px 28px;
    border-radius: 2.5rem;
    font-family: $fontFamily;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.3;

    &.round {
      border-radius: 100%;
    }
    &.square {
      border-radius: 6px;
    }
    &.sm {
      width: 24px;
      height: 24px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.md {
      width: 36px;
      height: 36px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.lg {
      width: 46px;
      height: 46px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.primary {
      background-color: $primary-default;
      color: $white;

      &:hover {
        background-color: $primary-light;
      }
      &.active {
        background-color: $primary-dark;
      }
      &:disabled {
        background-color: $gray;
        color: rgba($fontColor, 0.3);
      }
    }

    &.secondary {
      background-color: $secondary-default;
      color: $white;

      &:hover {
        background-color: $secondary-light;
      }
    }
    &.default {
      background-color: $white;
      color: $black;
      box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.25);

      &:hover {
        background-color: rgba($white, 0.8);
      }
    }
  }
</style>
