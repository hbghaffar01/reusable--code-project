<template>
  <main class="m-2">
    <div class="flex justify-end">
      <img
        alt="close"
        src="../../assets/images/modal/closeBlack.svg"
        class="cursor-pointer rounded"
        @click="$bvModal.hide('deleteModal')"
      >
    </div>
    <div class="flex flex-col items-center mx-24 mt-8 mb-12">
      <img
        alt="Error State"
        src="../../assets/images/modal/ErrorState.svg"
        class="error-state"
        width="80"
      >
      <p class="heading-modal my-2">
        Are you sure?
      </p>
      <p class="text-lg text-dark">
        Are you sure you want to remove this record?
      </p>
      <div class="flex gap-3 justify-around items-center w-full mt-3">
        <b-button
          class="btn-cancel"
          @click="$bvModal.hide('deleteModal')"
        >
          Cancel
        </b-button>
        <b-button
          class="btn-remove"
          @click="remove"
        >
          Remove
        </b-button>
      </div>
    </div>
  </main>
</template>

<script>
import { BButton } from 'bootstrap-vue'

export default {
  name: 'DeleteModal',
  components: {
    BButton,
  },
  methods: {
    remove() {
      this.$emit('remove')
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/@core/scss/base/core/colors/palette-variables.scss";
@import "@/@core/mixins/ui/_button.scss";

.btn-cancel {
  margin: 0 0 1rem 0;
  width: 200px;
  @include button($core-direction-base, transparent, $core-direction-base, 40px);
  box-shadow: none !important;
}

.btn-remove {
  margin: 0 0 1rem 0;
  width: 200px;
  @include button($white, $core-direction-base, $core-direction-base, 40px);
}
</style>
