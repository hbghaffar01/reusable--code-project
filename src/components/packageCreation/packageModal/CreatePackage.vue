<template>
  <main class="mx-20 my-16">
    <div class="flex items-center justify-between">
      <p class="text-lg font-style m-0">
        Create Package
      </p>
      <p class="base-color-main text-sm font-weight-bolder">
        Steps
        <span class="pl-1"> 1 / 3 </span>
      </p>
    </div>
    <!--Package Name-->
    <form>
      <div class="my-3 position-relative">
        <label class="text-sm font-style"> Package Name</label>
        <sub class="steric-sign text-danger">&nbsp;*</sub>
        <div
          class="d-flex justify-content-between gap-4 relative"
        >
          <input
            v-model="createPackage.name"
            class="invite-ipt position-relative"
            value="Package Name"
            type="text"
            :maxlength="maxlength"
          >
          <Tooltip
            :msg="'This is the user facing name of the package.'"
            target-id="packageName"
            class="tooltip-icon"
          />
        </div>
        <!--        ERROR -->
        <div>
          <span
            v-if="createPackage.name.length > 50"
            class="error-message text-sm font-style"
          >Input max length must be 50</span>
        </div>
      </div>
      <div class="my-3">
        <label class="text-sm font-style"> Select Package Type </label>
        <sub class="steric-sign text-danger">&nbsp;*</sub>
        <div class="d-flex justify-content-between gap-4 relative">
          <b-form-select
            v-model="package_type"
            class="invite-ipt"
          >
            <b-form-select-option value="0">
              Select Package type
            </b-form-select-option>
            <b-form-select-option
              v-for="(type, index) in packageTypes"
              :key="index"
              :value="type.id"
            > {{ type.name }} </b-form-select-option>
          </b-form-select>
        </div>
      </div>

      <!--Valid Section-->
      <div class="flex items-center gap-16 my-3">
        <div class="w-1/4 position-relative">
          <label class="text-sm font-style"> Validity Day(s) </label>
          <sub class="steric-sign text-danger">&nbsp;*</sub>
          <div class="d-flex justify-content-between gap-4 relative">
            <input
              v-model="createPackage.validity_days"
              placeholder="0"
              class="invite-ipt"
              type="number"
            >
            <Tooltip
              :msg="'This is how long the user has to use the package after purchase, after this duration the package will expire.'"
              target-id="validity"
              class="tooltip-icon"
            />
          </div>
        </div>
        <div class="w-1/4 position-relative">
          <label class="text-sm font-style"> Session(s) </label>
          <sub class="steric-sign text-danger">&nbsp;*</sub>
          <div class="d-flex justify-content-between gap-4 relative">
            <input
              v-model="createPackage.visits"
              placeholder="0"
              class="invite-ipt position-relative"
              type="number"
            >
            <Tooltip
              :msg="'This is how many sessions the user can book with the package and it can be used to create multiple access packages.'"
              target-id="session"
              class="tooltip-icon"
            />
          </div>
        </div>
        <div class="w-1/2">
          <div class="d-flex align-items-center gap-3">
            <label class="text-sm font-style">
              Does this package has end date
            </label>
            <Tooltip
              :msg="'This is when the package will be removed from sale on the system. Users who have bought this package will still be able to use it up until the package expires due to its “validity” but it won’t be available for purchase.'"
              target-id="endDate"
              class="mb-1"
            />
          </div>
          <div class="flex gap-24">
            <label
              class="checkbox-container text-sm font-normal checkbox-padding"
            >
              <input
                v-model="createPackage.repeat_monthly"
                type="checkbox"
                @click="visible(true)"
              >
              <span class="text-base font-weight-bolder ml-3">Yes</span>
              <span :class="showCalendar ? 'checkbox-label-active' : 'checkbox-label-disabled'" />
            </label>
            <label class="checkbox-container text-sm font-normal checkbox-padding">
              <input
                v-model="createPackage.repeat_monthly"
                type="checkbox"
                @click="visible(false)"
              >
              <span class="text-base font-weight-bolder ml-3">No</span>
              <span :class="!showCalendar ? 'checkbox-label-active' : 'checkbox-label-disabled'" />
            </label>
          </div>
        </div>
      </div>

      <!--Calendar Section-->
      <div
        v-show="showCalendar"
        class="w-1/2"
      >
        <label class="text-sm font-style">
          Ending Date
        </label>
        <sub class="steric-sign text-danger">&nbsp;*</sub>
        <calenderPicker
          mode="multiple"
          :min-date="createPackage.expires_on"
          @dateSelected="dateSelected"
        />
      </div>
    </form>

    <div class="my-12 flex items-center justify-end">
      <div class="flex items-center gap-10">
        <p
          class="base-color-main m-0 cursor-pointer font-style"
          @click="$bvModal.hide('createPackageModal')"
        >
          Cancel
        </p>
        <b-button
          v-b-modal.createPackageModal2
          class="next-btn-pkg d-flex items-center justify-around"
          :class="{ 'btn-active': createPackage.name && createPackage.validity_days && createPackage.visits && package_type && (createPackage.repeat_monthly === false && createPackage.expires_on === '')}"
          :disabled="createPackage.name.length > 50 || !createPackage.validity_days || !createPackage.visits || !package_type || (createPackage.repeat_monthly === false && createPackage.expires_on === '')"
          @click="
            showNext();
            $bvModal.hide('createPackageModal');
          "
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
import calenderPicker from '@/components/calender/calenderPicker.vue'
import { BButton, BFormSelect, BFormSelectOption } from 'bootstrap-vue'
import { getPackagesListType } from '@/apiManager/packages'
import Tooltip from '@/components/Tooltip/Tooltip.vue'

export default {
  name: 'CreatePackage',
  components: {
    BButton,
    calenderPicker,
    BFormSelect,
    BFormSelectOption,
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
      showCalendar: !this.editData.repeat_monthly,
      createPackage: this.editData,
      package_type: this.editData.package_type.id,
      packageTypes: [],
      maxlength: 60,
    }
  },
  created() {
    getPackagesListType()
      .then(response => {
        this.packageTypes = response.data
      })
  },
  methods: {
    showNext() {
      this.createPackage.validity_days = parseInt(this.createPackage.validity_days)
      this.createPackage.visits = parseInt(this.createPackage.visits)
      this.createPackage.package_type.id = this.package_type
      this.createPackage.package_type_id = this.createPackage.package_type.id
      this.$emit('showNext', this.createPackage)
    },
    visible(val) {
      this.showCalendar = val
    },
    dateSelected(date) {
      this.createPackage.expires_on = `${new Date(date).toLocaleDateString('en-CA')}T00:00:00.000Z`
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/global.scss";
@import "@/@core/mixins/ui/_button.scss";
@import "@/@core/mixins/ui/_input.scss";
@import "@/@core/scss/base/core/colors/palette-variables.scss";

.invite-ipt {
  width: 100%;
  @include input(10px, $black, 14px, 400, 17px, #caa8f5, 5px);
  z-index: 1;
}
.error-message {
  color: red !important;
}
.next-btn-pkg {
  @include button($white, $core-direction-base, $core-direction-base, 40px);
  padding: 10px 15px;
  width: 100px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
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

// active label input
.checkbox-label-active {
  position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: white;
    border: 2px solid #CAA8F5;
    border-radius: 50%;
    background-color: #690fad;
    border-color: #690FAD;
}
.checkbox-label-active:after {
    content: "";
    position: absolute;
    display: block;
}
.checkbox-container input:checked ~ .checkbox-label-active:after {
    display: block;
    left: 5px;
    top: 2px;
    width: 6px;
    height: 11px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}

.checkbox-container .checkbox-label-active:after {
    left: 5px;
    top: 2px;
    width: 6px;
    height: 11px;
    border: solid #fff;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}
// disabled label input
.checkbox-label-disabled {
  position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: white;
    border: 2px solid #CAA8F5;
    border-radius: 50%;
    background-color: #CAA8F5;
    border-color: #CAA8F5;
}
.checkbox-label-disabled:after {
    content: "";
    position: absolute;
    display: block;
}
.checkbox-container input:checked ~ .checkbox-label-disabled:after {
    left: 5px;
    top: 2px;

}
.tooltip-icon {
  position: absolute;
  z-index: 2;
  top: 13px;
  right: 10px;
}
.checkbox-container .checkbox-label-disabled:after {
    display: block;
    left: 5px;
    top: 2px;
    width: 6px;
    height: 11px;
    border: solid #CAA8F5;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    width: 6px;
    height: 11px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}

</style>
