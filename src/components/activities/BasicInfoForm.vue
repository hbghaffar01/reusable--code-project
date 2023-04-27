<template>
  <div>
    <CreateZone
      :is-create-zone="showLocationFields"
      @onUpdateLocation="setGoogleLocation"
      @onCreatedZone="getZones"
      @onHideCreateZoneModal="hideZoneModal"
    />
    <form>
      <div class="mt-3 flex items-center gap-4">
        <div class="w-1/2">
          <label class="text-sm font-style flex items-center"> Select Activity Type </label>
          <div
            disabled="true"
            class="flex gap-24"
          >
            <Checkbox
              label="Paid"
              :is-disabled="isEdit"
              :is-checked="!payload.is_free"
              @onToggleCheckbox="toggleCheckbox"
            />
            <Checkbox
              label="Free"
              :is-disabled="isEdit"
              :is-checked="payload.is_free"
              @onToggleCheckbox="toggleCheckbox"
            />
          </div>
        </div>
        <div class="w-1/2">
          <label class="text-sm font-style flex items-center"> Select Class Type </label>
          <div class="flex gap-24">
            <Checkbox
              label="Physical"
              :is-disabled="isEdit"
              :is-checked="!payload.offer_online"
              @onToggleCheckbox="toggleCheckbox"
            />
            <Checkbox
              label="Virtual"
              :is-disabled="isEdit"
              :is-checked="payload.offer_online"
              @onToggleCheckbox="toggleCheckbox"
            />
          </div>
        </div>
      </div>
      <div class="my-3">
        <InputComponent
          label="Select Facility"
          :is-required="true"
          :tooltip-msg="'Applicable only for companies with multiple offices.'"
          input-id="facility"
          type="text"
          input-class="invite-ipt ipt-padding"
          :value="userInformation.fullName"
          :is-disabled="true"
        />
      </div>

      <div
        v-if="!payload.offer_online"
        class="my-3"
      >
        <div
          :class="`gap-4 relative ${showLocationFields ? 'hide':'d-flex'}`"
        >
          <div class="w-1/2">
            <label class="text-sm font-style flex items-center"> Select or Create Zone
              <sub class="text-danger text-lg label-required">*</sub>
              <Tooltip
                :msg="'A zone is a location identifier, for example, Conference Room 1.'"
                target-id="zone"
              />
            </label>
            <b-form-select
              v-model="payload.facilityZone_id"
              :disabled="isEdit"
              class="invite-ipt py-0"
              :options="zones"
              style="padding: 10px"
            />

          </div>

          <div
            v-if="showPinLocation && !isEdit"
            class="w-1/2 relative"
          >
            <label class="text-sm font-style flex items-center"> Add Pin Location or Select Default
              <sub class="text-danger text-lg label-required">*</sub>
              <Tooltip
                :msg="'Select a specific Add Pin Location by selecting it from google map'"
                target-id="pin-address"
              />
            </label>
            <input
              type="text"
              class="invite-ipt ipt-padding"
              placeholder="Add Pin Location"
              @click="showCreateZoneModal"
            >
            <img
              alt="tooltip"
              src="@/assets/images/modal/PinMarker.svg"
              class="absolute cursor-pointer right-4 top-12 pt-1"
            >
          </div>

          <div
            v-if="!isEdit"
            class="flex items-end"
          >
            <b-button
              class="upload-btn d-flex items-center justify-around font-style text-light"
              type="button"
              @click="togglePinLocation"
            >
              <plus-icon />
              <span class="create-btn">Create</span>
            </b-button>
          </div>
        </div>

        <div
          v-if="showLocationFields && !isEdit"
          class="flex items-center gap-4"
        >
          <div class="w-1/2">
            <label class="text-sm font-style flex items-center"> Enter Location Name
              <sub class="text-danger text-lg label-required">*</sub>
              <Tooltip
                :msg="'Type how you want the activity location to appear to users, for example Fitness First Motor City.'"
                target-id="location"
              />
            </label>
            <div class="d-flex justify-content-between gap-4 relative">
              <input
                type="text"
                class="invite-ipt ipt-padding"
                placeholder="Location Name"
              >
            </div>
          </div>
          <div class="w-1/2">
            <label class="text-sm font-style flex items-center">Location from Google
              <sub class="text-danger text-lg label-required">*</sub>
            </label>
            <div class="d-flex justify-content-between gap-4 relative">
              <input
                class="invite-ipt ipt-padding"
                type="text"
                placeholder="Add Pin Location"
                :value="payload.pinaddress"
                @click="showCreateZoneModal"
              >
              <img
                alt="tooltip"
                src="@/assets/images/modal/PinMarker.svg"
                class="absolute cursor-pointer right-4 top-0 pt-1"
              >
            </div>
          </div>
        </div>
        <div
          v-if="!isEdit"
          class="flex mt-1"
        >
          <Checkbox
            label="This activity take place outside of my location"
            :is-checked="showLocationFields"
            @onToggleCheckbox="toggleCheckbox"
          />
        </div>
      </div>
      <div class="d-flex gap-4 relative">
        <div class="w-full">
          <label class="text-sm font-style flex items-center"> Select Instructor
            <sub class="text-danger text-lg label-required" />
            <Tooltip
              :msg="'Create & Select the Instructor that will be facilitating the class.'"
              target-id="instructor"
            />
          </label>
          <b-form-select
            v-model="payload.instructor_id"
            class="invite-ipt py-0"
            :options="instructors"
            style="padding: 10px"
          />
        </div>
      </div>
      <div
        v-if="!payload.is_free"
        class="my-3"
      >
        <label class="text-sm font-style flex items-center"> Assign Packages (Multiple)
          <sub class="text-danger text-lg label-required">*</sub>
          <Tooltip
            :msg="'Select the package(s) that a user can use against the activity.'"
            target-id="multiple-package"
          />
        </label>
        <b-form-group>
          <v-select
            v-model="selected"
            :options="packageListing"
            label="label"
            track-by="value"
            :multiple="true"
            :disabled="isEdit"
          />
        </b-form-group>
      </div>
    </form>
  </div>
</template>

<script>
import { BFormSelect, BButton, BFormGroup } from 'bootstrap-vue'
import vSelect from 'vue-select'
import { mapGetters } from 'vuex'
import { getPackagesList } from '@/apiManager/packages'
import PlusIcon from '@/svgs/plus-icon.vue'
import { getScheduleInstructor } from '@/apiManager/scheduleActivity'
import CreateZone from '@/components/activities/CreateZone.vue'
import { fetchZones } from '@/apiManager/zone'
import Checkbox from '@/components/input/Checkbox.vue'
import InputComponent from '@/components/input/InputComponent.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import 'vue-select/dist/vue-select.css'

export default {
  name: 'BasicInfoForm',
  components: {
    InputComponent,
    Checkbox,
    CreateZone,
    Tooltip,
    BFormSelect,
    BButton,
    PlusIcon,
    vSelect,
    BFormGroup,
  },
  props: {
    payload: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    editData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      selected: this.payload.packageIds,
      selectedPackageId: '',
      selectedFacility: 'coreDirection',
      selectedZone: null,
      zones: [],
      selectedInstructor: null,
      instructors: [],
      selectedPackage: null,
      packages: [],
      showLocationFields: false,
      showPinLocation: false,
      showInstructorFields: false,
      packageListing: [],
    }
  },
  watch: {
    selected(newVal, oldVal) {
      const values = newVal.map(option => option.value)
      if (newVal !== oldVal) {
        this.$emit('onChangePackageId', values)
      }
    },
    showLocationFields(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit('onChangedLocationField', newValue)
      }
    },
  },
  mounted() {
    this.getPackages()
    this.getInstructors()
    this.getZones()
  },
  methods: {
    toggleCheckbox(checkboxType) {
      // TODO: optimize this code
      switch (checkboxType) {
        case 'Paid':
          this.payload.is_free = false
          break
        case 'Free':
          this.payload.is_free = true
          break
        case 'Physical':
          this.payload.offer_online = false
          break
        case 'Virtual':
          this.payload.offer_online = true
          break
        default:
          this.showLocationFields = !this.showLocationFields
          break
      }
    },
    setGoogleLocation(location) {
      this.$emit('onUpdateGoogleLocation', location)
    },
    async getZones() {
      try {
        const { data } = await fetchZones()
        this.zones = data.map(zone => ({
          value: zone.id,
          text: zone.title,
        }))
      } catch (e) {
        console.log(e)
      }
    },
    async getPackages() {
      try {
        const { data } = await getPackagesList(this.getPackagesPayload())
        data.forEach(val => {
          this.packageListing.push({
            value: val.id,
            label: val.name,
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async getInstructors() {
      try {
        const { data } = await getScheduleInstructor()
        this.instructors = data.map(instructor => ({
          value: instructor.id,
          text: `${instructor.firstName} ${instructor.lastName}`,
        }))
      } catch (e) {
        console.log(e)
      }
    },
    getPackagesPayload() {
      return {
        limit: 100,
        offset: 0,
        packageName: '',
        packageType: '',
      }
    },
    showCreateZoneModal() {
      this.togglePinLocation()
      this.$bvModal.show('CreateZoneModal')
    },
    hideZoneModal() {
      this.$bvModal.hide('CreateZoneModal')
    },
    togglePinLocation() {
      this.showPinLocation = !this.showPinLocation
    },

  },
  computed: {
    ...mapGetters({
      loggedinUser: 'user/loggedInUserInformation',
    }),
    userInformation() {
      return this.loggedinUser
    },
  },

}
</script>

<style scoped lang="scss">
@import "@/assets/scss/global.scss";
@import "@/@core/mixins/ui/_button.scss";
@import "@/@core/mixins/ui/_input.scss";
@import "@/@core/scss/base/core/colors/palette-variables.scss";
@import '@core/scss/vue/libs/vue-select.scss';
.invite-ipt {
  width: 100%;
  @include input(0 10px, $black, 14px, 400, 17px, #caa8f5, 5px);
}

.label-required {
  margin: 0 0.5rem;
}

.upload-btn {
  @include button($white, $core-direction-base, $core-direction-base, 5px);
  width: fit-content;
  height: 2.9rem;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  z-index: 2;
}

.ipt-padding {
  padding: 10px;
}

.create-btn {
  margin-left: 5px;
}
</style>
