<template>
  <img :alt="alt" :src="src">
</template>

<script>
export default {
  name: 'ImageElement',
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  },
}
</script>
