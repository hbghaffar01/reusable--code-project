<template>
  <tbody ref="tableBody" class="custom-table-body">
    <slot name="children" />
  </tbody>
</template>

<script>
export default {
  name: 'Tbody',
  props: {
    numberOfPages: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    const { tableBody } = this.$refs
    let currentPage = 0
    tableBody.addEventListener('scroll', () => {
      if (tableBody.scrollTop + tableBody.clientHeight >= tableBody.scrollHeight) {
        currentPage++
        if (currentPage < this.numberOfPages) {
          this.$emit('onScroll', currentPage)
        }
      }
    })
  },

}
</script>

<style lang="scss">
  @import "@/assets/scss/base/colors";
  @import "@/assets/scss/base/variables";

  $marginTop: 10px;
  $marginBottom: 10px;
  $padding: 30px;
  $extraPadding: $horizontalMenuHeight + $contentTopPadding + $pageHeadHeight + $tableTheadHeight + $marginTop + $marginBottom + $padding;

  .custom-table-body {
    overflow-y: auto;
    height: calc(100vh - #{$extraPadding});
    display: block;
    margin-right: 3px;
    margin-top: $marginTop;
    margin-bottom: $marginBottom;
    tr {
      &:not(:first-child) {
        margin-top: 10px;
      }
      background-color: $white;
      width: 100%;
      display: table;
      table-layout: fixed;

      td {
        &:first-child {
          clip-path: inset(0 -1px 0 3px round 10px 0 0 10px);
        }
        &:last-child {
          clip-path: inset(0 5px 0 0 round 0 10px 10px 0);
        }
      }
    }
  }
</style>
