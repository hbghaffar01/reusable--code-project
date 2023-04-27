<template>
  <form>
    <div
      v-if="payload.offer_online"
      class="my-3"
    >
      <label class="text-sm font-style flex items-center"> Enter Login URL
        <sub class="text-danger text-lg label-required">*</sub>
        <Tooltip
          :msg="'You can create a class on any online platform and paste the credentials here for participants. The interested participants will recieve the invitation to this class via email after booking..'"
          target-id="login-url"
        />
      </label>
      <div class="d-flex justify-content-between gap-4 relative">
        <input
          v-model="payload.login_url_online"
          :disabled="isEdit"
          type="text"
          class="invite-ipt ipt-padding"
          placeholder="Paste your virtual session URL here"
        >
      </div>
    </div>
    <div
      v-if="payload.offer_online"
      class="my-3"
    >
      <div class="d-flex gap-4 relative">
        <div class="w-1/2">
          <label class="text-sm font-style flex items-center"> Meeting ID
          </label>
          <input
            v-model="payload.meeting_id_online"
            :disabled="isEdit"
            type="text"
            class="invite-ipt ipt-padding"
            placeholder="Paste meeting ID here"
          >
        </div>
        <div class="w-1/2">
          <label class="text-sm font-style flex items-center"> Meeting Password
          </label>
          <input
            v-model="payload.login_password_online"
            :disabled="isEdit"
            type="text"
            class="invite-ipt ipt-padding"
            placeholder="Set up a password for login"
          >
        </div>
      </div>
    </div>
    <div
      class="my-3"
    >
      <div class="d-flex gap-4 relative">
        <div class="w-1/2">
          <label class="text-sm font-style flex items-center"> Start Time
            <sub class="text-danger text-lg label-required">*</sub>
            <Tooltip
              :msg="'Start time, please enter in 24hr clock format.'"
              target-id="start-time"
            />
          </label>
          <input
            v-model="startTime"
            type="time"
            class="invite-ipt ipt-padding text-center"
            value="HH/MM"
            @change="calculateDuration($event,'startTime')"
          >
        </div>
        <div class="w-1/2">
          <label class="text-sm font-style flex items-center"> End Time
            <sub class="text-danger text-lg label-required">*</sub>
            <Tooltip
              :msg="'End time, please enter in 24hr clock format.'"
              target-id="end-time"
            />
          </label>
          <input
            v-model="endTime"
            type="time"
            class="invite-ipt ipt-padding text-center"
            value="HH/MM"
            @change="calculateDuration($event,'endTime')"
          >
        </div>
      </div>
    </div>
    <div
      v-if="!isEdit"
      class="my-3 w-1/2"
    >
      <label class="text-sm font-style flex items-center">
        Date
      </label>
      <FlatPicker
        v-model="dateRange"
        class="invite-calender"
        :config="config"
        @input="setDate"
      />
    </div>
    <div class="my-3 flex justify-center flex-col gap-2">
      <label class="text-sm font-style flex items-center"> Select Recurrence Day(s) </label>
      <div class="flex flex-wrap justify-between gap-12">
        <label
          v-for="day in days"
          :key="day.name"
          class="checkbox-container text-sm font-normal m-0"
        >
          <input
            v-model="day.isChecked"
            :disabled="isEdit"
            type="checkbox"
          >
          <span class="text-base font-weight-bolder checkbox-margin">{{ day.name }}</span>
          <span :class="{ 'checkbox-label-active': day.isChecked, 'checkbox-label-disabled': !day.isChecked }" />
        </label>
      </div>
    </div>
  </form>

</template>

<script>
import FlatPicker from 'vue-flatpickr-component'
import Tooltip from '../Tooltip/Tooltip.vue'
import { makeToast } from '@/utils'

export default {
  name: 'ScheduleActivityForm',
  components: { Tooltip, FlatPicker },
  props: {
    days: {
      type: Array,
      required: true,
    },
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
      startTime: '',
      endTime: '',
      dateRange: '',
      config: {
        mode: 'range',
        inline: 'true',
        altFormat: 'M j, Y',
        dateFormat: 'Y-m-d',
        minDate: new Date(),
        makeToast,
      },
    }
  },
  mounted() {
    if (this.isEdit) {
      this.startTime = this.editData.schedule_date.split('T')[1].substring(0, 5)
      const minutes = this.startTime.split(':')[1]
      const endMinutes = this.editData.duration + parseInt(minutes)
      if (endMinutes >= 60) {
        const hours = (endMinutes / 60).toString()
        const endHours = parseInt(this.startTime.split(':')[0]) + parseInt(hours.split('.')[0])
        this.endTime = `${endHours}:${endMinutes % 60 < 10 ? `0${endMinutes % 60}` : endMinutes % 60}`
      } else {
        this.endTime = `${this.startTime.split(':')[0]}:${endMinutes % 60 < 10 ? `0${endMinutes % 60}` : endMinutes % 60}`
      }
    }
  },
  methods: {
    makeToast(msg, variant, title) {
      this.$bvToast.toast(msg, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: true,
      })
    },
    calculateDuration(event, field) {
      this[field] = event.target.value
      if (this.startTime && this.endTime) {
        const start = new Date(`1970-01-01 ${this.startTime}`)
        const end = new Date(`1970-01-01 ${this.endTime}`)
        const diff = end.getTime() - start.getTime()
        const minutes = diff / (60 * 1000)
        this.$emit('onChangeDuration', minutes)
        this.$emit('onUpdateStartTime', this.startTime)
      }
    },
    setDate() {
      this.$emit('onChangeDateRange', this.dateRange)
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

.ipt-padding {
  padding: 10px;
}

.next-btn-pkg {
  @include button($white, $core-direction-base, $core-direction-base, 40px);
  padding: 10px 15px;
  width: 150px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}
.tooltip-margin {
  margin-left: 5px;
}
.invite-calender {
  width: 64%;
  @include input(10px, $black, 14px, 400, 17px, #CAA8F5, 5px);
}
</style>
