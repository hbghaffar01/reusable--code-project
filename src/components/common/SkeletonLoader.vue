<template>
  <b-card>
    <b-skeleton width="100%" />
    <b-skeleton width="85%" />
    <b-skeleton width="55%" />
    <b-skeleton width="70%" />
    <b-skeleton width="75%" />
    <b-skeleton width="85%" />
    <b-skeleton width="85%" />
    <b-skeleton width="55%" />
    <b-skeleton width="70%" />
    <b-skeleton width="85%" />
    <b-skeleton width="55%" />
    <b-skeleton width="70%" />
    <b-skeleton width="75%" />
    <b-skeleton width="85%" />
    <b-skeleton width="90%" />
    <b-skeleton width="100%" />
  </b-card>
</template>

<script>
import { BCard, BSkeleton } from 'bootstrap-vue'

export default {
  name: 'SkeletonLoader',
  components: {
    BCard, BSkeleton,
  },
}
</script>

<style scoped>

</style>
