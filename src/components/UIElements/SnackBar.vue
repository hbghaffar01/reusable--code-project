<template>
  <span>
    {{ value }}
  </span>
</template>

<script>
export default {
  name: 'SnackBar',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/base/colors";
@import "@/assets/scss/base/animations";

span {
  color: $white;
  background-color: $primary-light;
  min-width: 250px;
  margin-left: -125px;
  border-radius: 2px;
  padding: 10px;
  text-align: center;
  left: 50%;
  bottom: 30px;
  z-index: 1;
  position: fixed;
  animation: fade-in 0.5s, fade-out 0.5s 2.5s;
}
</style>
