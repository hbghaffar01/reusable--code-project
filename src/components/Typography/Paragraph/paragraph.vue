<template>
  <p>{{ value }}</p>
</template>

<script>
export default {
  name: 'Paragraph',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
}
</script>
