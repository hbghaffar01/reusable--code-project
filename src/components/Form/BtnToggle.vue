<template>
  <div class="checkbox-toggle">
    <input id="checkbox" type="checkbox">
    <label for="checkbox" />
  </div>
</template>

<script>

export default {
  name: 'BtnToggle',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';

.checkbox-toggle{
  height: 16px;
  input{
    visibility: hidden;
    position: absolute;
    width: 31px;
    height: 16px;
  }
  label{
    width: 31px;
    height: 16px;
    background: $secondary-default;
    margin: 0 !important;
    position: relative;
    border-radius: 30px;
    cursor: pointer;
    &::before{
      content: "";
      position: absolute;
      left: 2px;
      top: 1px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: $white;
    }
  }
  input:checked~label::before{
    left: unset;
    right: 2px;
  }
}
</style>
