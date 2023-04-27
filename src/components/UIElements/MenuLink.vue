<template>
  <Link :class="{ 'active': route.name === content.href }" @click="handleClick">
    <template v-slot:children>
      <slot name="icon" />
      <span v-if="showTitle">{{ content.title }}</span>
    </template>
  </Link>
</template>

<script>
import Link from './Link.vue'

export default {
  name: 'MenuLink',
  components: {
    Link,
  },
  props: {
    route: {
      type: Object,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
    showTitle: {
      type: Boolean,
      default: true,
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
  @import '@/assets/scss/base/colors';

  a {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.3;
    color: $white;
    padding-left: 15px;

    &:hover {
      color: $white;
      background: linear-gradient(89deg, rgba($primary-light-r, $primary-light-g, $primary-light-b, 0.2) 15%, rgba($primary-default-r, $primary-default-g, $primary-default-b, 0.65) 100%);
    }

    &.active {
      background: linear-gradient(180deg, rgba($primary-light-r, $primary-light-g, $primary-light-b, 0.2) 15%, rgba($primary-default-r, $primary-default-g, $primary-default-b, 0.65) 100%);
    }
  }
</style>
