<template>
  <router-link v-if="to" :to="to">
    {{ value }}
    <slot name="children" />
  </router-link>
  <a v-else @click="handleClick">
    {{ value }}
    <slot name="children" />
  </a>
</template>

<script>
export default {
  name: 'Link',
  props: {
    to: {
      type: String,
    },
    value: {
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

<style lang="scss">
  a {
    display: flex;
    column-gap: 5px;
    align-items: center;
  }
</style>
