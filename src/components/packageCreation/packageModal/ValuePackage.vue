<template>
  <main class="mx-20 my-16">
    <div class="flex items-center justify-between">
      <h2 class="text-lg text-black font-bold font-style">
        Value for Package
      </h2>
      <p class="activeText text-sm font-bold">
        Steps<span class="pl-2">3 / 3</span>
      </p>
    </div>

    <form
      class="mt-12 mb-24 form_Promotion"
      @input="calculateQuery"
    >
      <!--Package Select Section-->
      <!-- <div class="flex items-center">
        <div class="w-1/2">
          <div class="flex gap-3 items-center">
            <label class="text-sm font-style">
              Is this package for public?
            </label>
            <img
              alt="Tooltip"
              src="@/assets/images/modal/Tooltip.svg"
              class="cursor-pointer mb-1"
            />
          </div>
          <div class="flex gap-20">
            <label class="checkbox-container text-sm font-normal">
              <input
                checked
                type="public"
                name="check_2"
                @click="visiblePublic(true)"
              />
              <span class="text-base font-weight-bolder ml-3">Yes</span>
              <span class="checkbox-label-active" v-if="isActive" />
              <span class="checkbox-label-disabled" v-else />
            </label>
            <label class="checkbox-container text-sm font-normal">
              <input
                type="public"
                name="check_2"
                @click="visiblePublic(false)"
              />
              <span class="text-base font-weight-bolder ml-3">No</span>
              <span class="checkbox-label-disabled" v-if="isActive" />
              <span class="checkbox-label-active" v-else />
            </label>
          </div>
        </div>

        <div class="w-1/2">
          <div class="flex gap-3 items-center">
            <label class="text-sm font-style">
              Is this package for Corporate?
            </label>
            <img
              alt="Tooltip"
              src="@/assets/images/modal/Tooltip.svg"
              class="cursor-pointer mb-1"
            />
          </div>
          <div class="flex gap-20">
            <label class="checkbox-container text-sm font-normal">
              <input
                checked
                type="corporate"
                name="check_1"
                @click="visibleCorporate(false)"
              />
              <span class="text-base font-weight-bolder ml-3">Yes</span>
              <span class="checkbox-label-disabled" v-if="isActive" />
              <span class="checkbox-label-active" v-else />
            </label>
            <label class="checkbox-container text-sm font-normal">
              <input
                type="corporate"
                name="check_2"
                @click="visibleCorporate(true)"
              />
              <span class="text-base font-weight-bolder ml-3">No</span>
              <span class="checkbox-label-active" v-if="isActive" />
              <span class="checkbox-label-disabled" v-else />
            </label>
          </div>
        </div>
      </div> -->

      <!--Public Rate-->
      <div class="my-12 flex items-center justify-between">
        <div>
          <label
            class="text-sm font-style"
            value="public"
          >Public Rate (00.00)</label>
          <div class="flex items-center gap-4 mr-8">
            <div>
              <input
                v-model="valuePackage.public_rate"
                placeholder="0"
                type="number"
                class="text-center block p-1 border border-1.5 invite-ipt border-purple-300 rounded-lg w-full outline-0"
                trim
              >
            </div>
            <div>
              <input
                disabled
                value="Dirhams (AED)"
                type="text"
                class="drop_down_arrow text-center block p-1 border border-1.5 invite-ipt border-purple-300 rounded-lg w-full outline-0"
                trim
              >
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4 mr-8">
          <div>
            <label
              class="text-sm font-style"
              type="public"
            >Corporate Discount(%)</label>
            <input
              v-model="valuePackage.corporateDiscount"
              type="number"
              placeholder="0"
              class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
              trim
              disabled
            >
          </div>
          <div>
            <label
              class="text-sm font-style"
              type="public"
            >Price After Discount</label>
            <input
              v-model="valuePackage.CorporatePriceAfterDiscount"
              placeholder="0"
              type="number"
              class="block text-center p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
              trim
              disabled
            >
          </div>
        </div>
      </div>

      <!--Discount-->
      <div class="my-12 flex items-center justify-between">
        <div class="flex items-center gap-4 mr-8">
          <div>
            <label
              class="text-sm font-style"
              type="public"
            >Discount (%)</label>
            <input
              v-model="valuePackage.discount"
              placeholder="0"
              type="number"
              class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
              trim
            >
          </div>
          <div>
            <label
              class="text-sm font-style"
              type="public"
            >Price After Discount</label>
            <input
              v-model="valuePackage.PriceAfterDiscount"
              placeholder="0"
              type="number"
              class="block text-center p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
              trim
              disabled
            >
          </div>
        </div>
        <div>
          <label class="text-sm font-style">Corporate Rate (00.00)</label>
          <div class="flex items-center gap-4 mr-8">
            <div>
              <input
                v-model="valuePackage.corporate_rate"
                placeholder="5.00"
                type="number"
                class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
                trim
                disabled
              >
            </div>
            <div>
              <input
                disabled
                placeholder="0"
                type="number"
                class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
                trim
              >
            </div>
          </div>
        </div>
      </div>

      <!--Value Rate Rate-->
      <!--      <div class="my-12 flex items-center justify-between">-->
      <!--        <div>-->
      <!--          <label class="text-sm font-style">Value-added tax (VAT)</label>-->
      <!--          <div class="flex items-center gap-4 mr-8">-->
      <!--            <div>-->
      <!--              <input-->
      <!--                v-model="valuePackage.vat"-->
      <!--                placeholder="5.00"-->
      <!--                type="number"-->
      <!--                class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"-->
      <!--                trim-->
      <!--              >-->
      <!--            </div>-->
      <!--            <div>-->
      <!--              <input-->
      <!--                placeholder="5 %"-->
      <!--                type="number"-->
      <!--                class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"-->
      <!--                trim-->
      <!--              >-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <label class="text-sm font-style">Value-added tax (VAT)</label>-->
      <!--          <div class="flex items-center gap-4">-->
      <!--            <div>-->
      <!--              <input-->
      <!--                placeholder="5.00"-->
      <!--                type="number"-->
      <!--                class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"-->
      <!--                trim-->
      <!--              >-->
      <!--            </div>-->
      <!--            <div>-->
      <!--              <input-->
      <!--                placeholder="5 %"-->
      <!--                type="number"-->
      <!--                class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"-->
      <!--                trim-->
      <!--              >-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--Public Rate-->
      <div class="my-12 flex items-center justify-between">
        <div>
          <label class="text-sm font-style">Public Commission Rate</label>
          <div class="flex items-center gap-4 mr-8">
            <div>
              <input
                v-model="valuePackage.individual_rate_commission"
                placeholder="0"
                type="number"
                class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
                trim
                disabled
              >
            </div>
            <div>
              <input
                disabled
                type="text"
                placeholder="0"
                class="activeText text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
                trim
              >
            </div>
          </div>
        </div>
        <div>
          <label class="text-sm font-style">Corporate Rate (00.00)</label>
          <div class="flex items-center gap-4 mr-8">
            <div>
              <input
                v-model="valuePackage.corporate_rate_commission"
                placeholder="5.00"
                type="number"
                class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
                trim
                disabled
              >
            </div>
            <div>
              <input
                disabled
                type="number"
                placeholder="0"
                class="text-center block p-1 border border-1.5 border-purple-300 invite-ipt rounded-lg w-full outline-0"
                trim
              >
            </div>
          </div>
        </div>
      </div>
    </form>
    <div class="flex items-center justify-between mb-12 mt-96">
      <b-button
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
          @click="$bvModal.hide('createPackageModal3')"
        >
          Cancel
        </p>
        <b-button
          class="next-btn-pkg d-flex items-center justify-around"
          :class="{ 'btn-active': valuePackage.public_rate }"
          :disabled="!valuePackage.public_rate"
          @click="setData"
        >
          {{ editData.id ? 'Update' : 'Create' }}
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
import { updatePackage } from '@/apiManager/packages'

export default {
  name: 'ValuePackage',
  components: {
    BButton,
  },
  props: {
    editData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valuePackage: this.editData,
    }
  },
  mounted() {
    console.log(this.editData, 'in props')
  },
  methods: {
    setData() {
      this.valuePackage.public_rate = parseInt(this.valuePackage.public_rate)
      this.valuePackage.corporate_rate = parseInt(this.valuePackage.corporate_rate)
      this.valuePackage.discount = parseInt(this.valuePackage.discount) ? parseInt(this.valuePackage.discount) : 0
      this.valuePackage.individual_rate_commission = parseInt(this.valuePackage.individual_rate_commission)
      this.valuePackage.corporate_rate_commission = parseInt(this.valuePackage.corporate_rate_commission)
      delete this.valuePackage.corporateDiscount
      delete this.valuePackage.CorporatePriceAfterDiscount
      delete this.valuePackage.PriceAfterDiscount
      if (this.editData.id) {
        this.updatePackage()
      } else {
        if (this.editData.repeat_monthly === true) {
          this.setDate()
        }
        this.createPackage()
      }
    },
    setDate() {
      let dateYear = new Date()
      const timestamp = dateYear.getTime() + 5 * 365 * 24 * 60 * 60 * 1000
      dateYear = new Date(timestamp)
      this.editData.expires_on = `${new Date(dateYear).toLocaleDateString('en-CA')}T00:00:00.000Z`
      console.log(this.createPackage.expires_on)
    },
    createPackage() {
      this.$emit('createPackage', this.valuePackage)
    },
    updatePackage() {
      this.$emit('updatePackage', this.valuePackage)
    },
    calculateQuery() {
      const userRate = this.valuePackage.public_rate
      const userDiscount = this.valuePackage.discount
      this.valuePackage.corporateDiscount = ((userRate * userDiscount) / 100).toFixed(2)
      this.valuePackage.corporate_rate = (userRate - this.valuePackage.corporateDiscount).toFixed(2)
      this.valuePackage.CorporatePriceAfterDiscount = userRate - this.valuePackage.corporateDiscount
      this.valuePackage.PriceAfterDiscount = userRate - userDiscount
      this.valuePackage.individual_rate_commission = (userRate - (userRate * (0.15))).toFixed(2)
      this.valuePackage.corporate_rate_commission = (this.valuePackage.individual_rate_commission - (this.valuePackage.individual_rate_commission * (userDiscount / 100))).toFixed(2)
    },
    backBtnAction() {
      this.$bvModal.hide('createPackageModal3')
      this.$bvModal.show('createPackageModal2')
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

.invite-ipt-disabled {
  width: 100%;
  @include input(10px, $black, 14px, 400, 17px, #eae2f4, 5px);
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
