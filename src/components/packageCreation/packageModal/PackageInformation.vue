<template>
  <main class="mx-20 my-16">
    <div class="flex items-center justify-between">
      <p class="text-lg font-style m-0">
        Package Information
      </p>
      <p class="base-color-main text-sm font-weight-bolder">
        Steps
        <span class="pl-1"> 2 / 3 </span>
      </p>
    </div>
    <!--Package Information-->
    <form class="mt-12 mb-6 form_Promotion">
      <div class="my-3">
        <div class="flex items-center">
          <label class="text-sm font-style">
            Package Information
            <sub class="steric-sign text-danger">&nbsp;*</sub>
          </label>
          <Tooltip
            :msg="'This is a user-facing description and should include package Terms & Conditions and any extra information about the package you’d like to include.'"
            target-id="packageInformation"
            class="ml-1 mb-1"
          />
        </div>
        <textarea
          v-model="description"
          rows="4"
          cols="80"
          name="the-textarea"
          class="p-1 invite-ipt textarea-pkg"
          maxlength="250"
        />
      </div>
    </form>
    <div class="flex items-center justify-between mt-96 mb-12">
      <b-button
        v-b-modal.createPackageModal
        class="back-btn-pkg d-flex items-center gap-3"
        @click="backBtnAction"
      >
        <img
          alt="Arrow"
          src="@/assets/images/modal/back-arrow.svg"
          width="10px"
        >
        Go back
      </b-button>
      <div class="flex items-center gap-10">
        <p
          class="base-color-main m-0 cursor-pointer font-style"
          @click="$bvModal.hide('createPackageModal2')"
        >
          Cancel
        </p>
        <b-button
          v-b-modal.createPackageModal3
          class="next-btn-pkg d-flex items-center justify-around"
          :class="{ 'btn-active': description }"
          :disabled="!description"
          @click="setDescription()"
        >
          Next
          <img
            alt="Arrow"
            src="@/assets/images/modal/Arrow-1.svg"
            width="10px"
          >
        </b-button>
      </div>
    </div>
  </main>
</template>

<script>
import { BButton } from 'bootstrap-vue'
import Tooltip from '@/components/Tooltip/Tooltip.vue'

export default {
  name: 'PackageInformation',
  components: {
    BButton,
    Tooltip,
  },
  props: {
    editData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      description: this.editData.description,
    }
  },
  methods: {
    backBtnAction() {
      this.$bvModal.hide('createPackageModal2')
      this.$bvModal.show('createPackageModal')
    },
    setDescription() {
      this.$bvModal.hide('createPackageModal2')
      this.$emit('showNext', { description: this.description })
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/@core/mixins/ui/_button.scss";
@import "@/@core/mixins/ui/_input.scss";
@import "@/@core/scss/base/core/colors/palette-variables.scss";

.invite-ipt {
  width: 100%;
  @include input(10px, $black, 14px, 400, 17px, #caa8f5, 5px);
}

.next-btn-pkg {
  @include button($white, $core-direction-base, $core-direction-base, 40px);
  padding: 10px 15px;
  width: 100px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}
.back-btn-pkg {
  @include button($core-direction-base, $white, $white, 40px);
  padding: 10px 0;
  width: 100px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-decoration: none;
  box-shadow: none !important;
}
.btn-core {
  margin: 0 0 1rem 0;
  @include button($white, $core-direction-base, $core-direction-base, 40px);

  &:hover {
    transform: Scale(1.05);
  }
}
.btn-active {
  background-color: $core-direction-base !important;
  border: 1px solid $core-direction-base !important;
}
</style>
