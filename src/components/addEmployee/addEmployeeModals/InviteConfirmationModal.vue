<template>
  <main class="mx-20 my-16">
    <div class="flex items-center justify-between">
      <p class="text-lg font-style m-0">
        Invitation Sent
      </p>
      <p class="base-color-main text-sm font-weight-bolder m-0">
        Steps 2 / 2
      </p>
    </div>
    <!--Hero-image-->
    <div class="content-main flex flex-col items-center justify-center">
      <img
        alt="tick"
        src="../../../assets/images/modal/tick.svg"
        width="80"
        class="mb-8"
      >
      <p class="heading-modal">
        Invitation Sent
      </p>
    </div>
    <!--Shared Linked Input-->
    <div class="content-main">
      <p class="text-sm font-style">
        Sharing link
      </p>
      <SharingLink />
    </div>
    <!--back-create Section-->
    <div class="back-create mt-16 mb-10 flex items-center justify-end ">
      <div class="flex items-center gap-10">
        <button
          class="base-color-main"
          @click="$bvModal.hide('invitation-sent-modal')"
        >
          Close
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import SharingLink from '@/components/addEmployee/addEmployeeModals/ModalItems/SharingLink.vue'

export default {
  name: 'InviteConfirmationModal',
  components: { SharingLink },
}
</script>

<style lang="scss" scoped>
@import "@/@core/scss/base/core/colors/palette-variables.scss";

.content-main {
  margin: 150px 0;
}

</style>
