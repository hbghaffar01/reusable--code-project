<template>
  <div>
    <b-modal
      id="createActivityModal"
      size="lg"
      hide-header
      hide-footer
    >
      <main class="mx-20 my-16">
        <div class="flex items-center justify-between">
          <p class="text-lg font-style m-0">
            Schedule Activity
          </p>
          <p class="base-color-main text-sm font-weight-bolder m-0">
            Steps {{ getCurrentStep() }} / {{ getTotalSteps }}
          </p>
        </div>
        <KeepAlive>
          <component
            :is="activeComponent"
            :days="weekdays"
            :payload="payload"
            :is-edit="isEdit"
            :edit-data="editData"
            @onChangeDuration="updateDuration"
            @onChangeDateRange="updateDateRange"
            @onChangePackageId="updatePackageId"
            @onChangedLocationField="updateLocationField"
            @onUpdateGoogleLocation="updateOutsideLocation"
            @onUpdateStartTime="setStartTime"
            @disableNextOnCreatingActivity="disableOnCreatingActivity"
          />
        </KeepAlive>
        <div
          class="flex items-center justify-between my-12"
        >
          <div
            v-if="getCurrentStep() !== 1"
            class="back-step cursor-pointer"
            @click="previousStep"
          >
            <back-arrow-icon />
          </div>

          <div class="flex justify-end items-center gap-10 w-full">
            <p
              class="base-color-main m-0 cursor-pointer font-style"
              @click="hideModal"
            >
              Cancel
            </p>
            <b-button
              class="next-btn-pkg d-flex items-center justify-around"
              :disabled="disableNext"
              @click="nextStep"
            >
              {{ getCurrentStep() === 3 ? setBtnText : 'Next' }}
              <next-arrow-icon />
            </b-button>
          </div>
        </div>
      </main>
    </b-modal>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue'
import SelectActivityTypeForm from '@/components/activities/SelectActivityTypeForm.vue'
import ScheduleActivityForm from '@/components/activities/ScheduleActivityForm.vue'
import BasicInfoForm from '@/components/activities/BasicInfoForm.vue'
import NextArrowIcon from '@/svgs/next-arrow-icon.vue'
import BackArrowIcon from '@/svgs/back-arrow-icon.vue'
import { createScheduleActivity, updateScheduleActivity } from '@/apiManager/scheduleActivity'

const INITIAL_PAYLOAD = {
  startDate: '',
  endDate: '',
  duration: null,
  recurrence: [],
  is_recommended: true,
  session_type: 'Morning',
  is_location: false,
  offer_online: false,
  allow_corepass: false,
  is_free: false,
  activity_id: null,
  instruction_file: '',
  pinaddress: '',
  city: '',
  latitude: '',
  longitude: '',
  login_url_online: '',
  login_password_online: '',
  meeting_id_online: '',
  slots: null,
  facilityZone_id: null,
  packageIds: [],
  instructor_id: null,
}
const WEEK_DAYS = [{
  name: 'Saturday',
  isChecked: false,
},
{
  name: 'Sunday',
  isChecked: false,
}, {
  name: 'Monday',
  isChecked: false,
}, {
  name: 'Tuesday',
  isChecked: false,
}, {
  name: 'Wednesday',
  isChecked: false,
}, {
  name: 'Thursday',
  isChecked: false,
}, {
  name: 'Friday',
  isChecked: false,
}]
export default {
  name: 'CreateActivity',
  components: {
    BackArrowIcon,
    NextArrowIcon,
    BasicInfoForm,
    BButton,
    SelectActivityTypeForm,
    ScheduleActivityForm,
  },
  props: {
    editData: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      startTime: '',
      TOTAL_STEPS: 3,
      CURRENT_STEPS: 1,
      isOutsideLocation: false,
      weekdays: JSON.parse(JSON.stringify(WEEK_DAYS)),
      payload: { ...INITIAL_PAYLOAD },
      activeComponent: BasicInfoForm,
      disableNext: false,
    }
  },
  computed: {
    getTotalSteps() {
      return this.TOTAL_STEPS
    },
    setBtnText() {
      if (!this.isEdit) {
        return 'Create'
      }
      return 'Update'
    },
  },
  watch: {
    isEdit: {
      handler() {
        if (this.isEdit) this.setPayload()
      },
      deep: true,
    },
  },
  mounted() {
    if (this.isEdit) this.setPayload()
  },
  methods: {
    getCurrentStep() {
      if (this.CURRENT_STEPS) {
        return this.CURRENT_STEPS
      }
    },
    updatePackageId(packageId) {
      console.log(packageId, 'packageId')
      this.payload.packageIds = packageId
    },

    updateDuration(duration) {
      if (duration < 1) {
        this.makeToast('End time must be greater than start time.', 'danger', 'Error')
        return false
      }
      this.payload.duration = duration
    },
    updateLocationField(value) {
      if (value) {
        this.payload.facilityZone_id = null
      } else {
        this.payload.pinaddress = ''
        this.payload.city = ''
        this.payload.latitude = ''
        this.payload.longitude = ''
      }
      this.isOutsideLocation = value
    },
    previousStep() {
      this.CURRENT_STEPS -= 1
      switch (this.getCurrentStep()) {
        case 1:
          this.activeComponent = BasicInfoForm
          break
        case 2:
          this.activeComponent = SelectActivityTypeForm
          break
        default:
          this.activeComponent = ScheduleActivityForm
      }
    },
    async nextStep() {
      if (!this.validateStepsPayload()) return false
      if (this.getCurrentStep() === 3) {
        if (this.isEdit) {
          const data = {
            schedule_date: this.startTime ? `${this.editData.schedule_date.split('T')[0]}T${this.startTime}:00.000Z` : this.editData.schedule_date,
            slots: this.payload.slots,
            instructor_id: this.payload.instructor_id,
          }
          updateScheduleActivity(data, this.editData.id)
            .then(response => {
              if (response.statusCode === 200) {
                this.makeToast('Activity Schedule has been updated successfully.', 'success', 'Success')
                this.hideModal()
                this.$emit('updateList')
              }
              if (response.statusCode === 400) {
                this.makeToast(response.message, 'danger', 'Error')
              }
            })
        } else {
          this.payload.recurrence = this.weekdays
            .filter(day => day.isChecked)
            .map(day => day.name)
          this.payload.startDate = this.updateHourAndMinutes(this.startTime)
          this.payload.endDate = `${this.payload.endDate.split('T')[0]}T23:59:59.000Z`
          const {
            statusCode,
            message,
          } = await createScheduleActivity(this.payload)
          if (statusCode === 201) {
            this.makeToast('Activity Schedule has been created successfully.', 'success', 'Success')
            this.hideModal()
            this.$emit('updateList')
          }
          if (statusCode === 400) {
            this.makeToast(message[0], 'danger', 'Error')
          }
          return false
        }
      }
      if (this.CURRENT_STEPS !== this.TOTAL_STEPS) {
        this.CURRENT_STEPS += 1
      }
      this.activeComponent = this.CURRENT_STEPS === 2 ? SelectActivityTypeForm : ScheduleActivityForm
    },
    validateStepsPayload() {
      if (this.getCurrentStep() === 1 && !this.validateFirstStep()) return false
      if (this.getCurrentStep() === 2 && !this.validateSecondStep()) return false
      if (this.getCurrentStep() === 3 && !this.validateThirdStep()) return false
      return true
    },
    updateDateRange(range) {
      if (range.includes('to')) {
        const [startDate, endDate] = range.split('to')
        this.payload.startDate = this.getFormattedDateInISOFormat(startDate)
        this.payload.endDate = this.getFormattedDateInISOFormat(endDate)
      } else {
        const [startDate] = range.split('to')
        this.payload.startDate = this.getFormattedDateInISOFormat(startDate)
        this.payload.endDate = this.getFormattedDateInISOFormat(startDate)
      }
    },
    getFormattedDateInISOFormat(date) {
      const dateObject = new Date(date)
      const localDate = dateObject.getDate()
      dateObject.setUTCHours(0, 0, 0, 0)
      dateObject.setUTCDate(localDate)
      return dateObject.toISOString()
    },
    updateOutsideLocation({
      city, latitude, longitude, pinaddress,
    }) {
      Object.assign(this.payload, {
        city, latitude, longitude, pinaddress,
      })
    },
    hideModal() {
      this.resetData()
      this.CURRENT_STEPS = 1
      this.activeComponent = BasicInfoForm
      this.$bvModal.hide('createActivityModal')
    },
    validateFirstStep() {
      // TODO: we are unable to send your suggested code to production as we need to ensure that all edge cases are covered. We will optimise this at a later time.
      if (!this.payload.offer_online && !this.payload.facilityZone_id) {
        this.makeToast('Facility Zone field is required.', 'danger', 'Error')
        return false
      }

      if (!this.isEdit && this.isOutsideLocation && !this.payload.pinaddress) {
        this.makeToast('Location name and location from Google are required fields.', 'danger', 'Error')
        return false
      }

      if (!this.payload.is_free && this.payload.packageIds.length === 0) {
        this.makeToast('Package field is required.', 'danger', 'Error')
        return false
      }

      return true
    },
    validateSecondStep() {
      if (!this.payload.slots) {
        this.makeToast('Max participants field is required.', 'danger', 'Error')
        return false
      }
      if (this.isEdit && this.payload.slots < this.editData.bookingCount) {
        this.makeToast('Slots can not be less than booking count', 'danger', 'Error')
        return false
      }
      if (!this.payload.activity_id) {
        this.makeToast('Activity type field is required.', 'danger', 'Error')
        return false
      }
      return true
    },
    validateThirdStep() {
      if (!this.isEdit && !this.payload.duration) {
        this.makeToast('Start and End Time fields are required.', 'danger', 'Error')
        return false
      }
      if (this.payload.login_url_online) {
        const url = this.payload.login_url_online
        const pattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/
        if (!pattern.test(url)) {
          this.makeToast('This is Invalid Url.', 'danger', 'Error')
          return false
        }
      }
      return true
    },
    resetData() {
      this.payload = { ...INITIAL_PAYLOAD }
      this.weekdays = JSON.parse(JSON.stringify(WEEK_DAYS))
      this.$emit('cancel')
    },
    updateHourAndMinutes(startTime) {
      const [hour, minutes] = startTime.split(':')
      const date = new Date(this.payload.startDate)
      date.setUTCHours(parseInt(hour, 10))
      date.setUTCMinutes(parseInt(minutes, 10))
      return date.toISOString()
    },

    makeToast(msg, variant, title) {
      this.$bvToast.toast(msg, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: true,
      })
    },
    setStartTime(startTime) {
      this.startTime = startTime
    },
    setPayload() {
      this.payload.is_free = this.editData.activity_schedule?.is_free
      this.payload.offer_online = this.editData.activity_schedule?.offer_online
      this.payload.facilityZone_id = this.editData.activity_schedule?.facility_zones?.id
      this.payload.activity_id = this.editData.activity_schedule?.activity?.id
      this.payload.slots = this.editData.slots
      this.payload.instructor_id = this.editData.instructor?.id
      this.payload.packageIds = []
      this.editData.activity_schedule.activity_schedule_package.map(key => {
        this.payload.packageIds.push({
          label: key.package.name,
          value: key.package.id,
        })
      })
    },
    disableOnCreatingActivity(key) {
      this.disableNext = key
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

.next-btn-pkg {
  @include button($white, $core-direction-base, $core-direction-base, 40px);
  padding: 10px 15px;
  width: 100px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}
</style>
