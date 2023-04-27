<template>
  <div ref="dropdown" class="dropdown">
    <button @click="toggleDropdown">
      <slot name="toggler" />
    </button>
    <transition name="dropdown">
      <div v-if="isOpen" :class="`dropdown-content ${position}`">
        <ul class="dropdown-list">
          <slot name="listItems" />
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    position: {
      type: String,
      default: 'right',
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        document.addEventListener('click', this.closeDropdown)
      } else {
        document.removeEventListener('click', this.closeDropdown)
      }
    },
    closeDropdown(event) {
      if (!this.$refs.dropdown.contains(event.target)) {
        this.isOpen = false
        document.removeEventListener('click', this.closeDropdown)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';
@import '@/assets/scss/base/animations';

.dropdown {
  position: relative;
  &-content {
    position: absolute;
    top: 100%;
    background-color: $white;
    min-width: 160px;
    overflow: hidden;
    padding: 0;
    z-index: 1;
    animation: dropdown-slide-in 500ms ease-in-out;

    box-shadow: 0px 4px 7px rgba($black, 0.25);
    border-radius: 11px;

    &.right {
      right: 0;
    }

    &.left {
      left: 0;
    }
  }
  &-list {
    margin-bottom: 0;
    li {
      a {
        display: flex;
        column-gap: 5px;
        white-space: nowrap;
        cursor: pointer;
      }
    }
  }
}
</style>
