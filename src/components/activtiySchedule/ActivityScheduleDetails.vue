<template>
  <div>
    <b-modal
      id="recurrenceModal"
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
            Steps 3 / 3
          </p>
        </div>
        <form>
          <div
            v-if="activity.selectClassType"
            class="my-3"
          >
            <label class="text-sm font-style flex items-center"> Enter Login URL
              <sub class="steric-sign label-required">&nbsp;*</sub>
              <img
                alt="tooltip"
                src="../../assets/images/modal/Tooltip.svg"
                class="cursor-pointer"
              >
            </label>
            <div class="d-flex justify-content-between gap-4 relative">
              <input
                type="text"
                class="invite-ipt ipt-padding"
                placeholder="Paste your virtual session URL here"
              >
            </div>
          </div>
          <div
            v-if="activity.selectClassType"
            class="flex items-center gap-4 my-3"
          >
            <div class="w-1/2">
              <label class="text-sm font-style flex items-center"> Meeting ID </label>
              <div class="d-flex justify-content-between gap-4 relative">
                <input
                  type="text"
                  class="invite-ipt ipt-padding"
                  placeholder="Paste meeting ID here"
                >
              </div>
            </div>
            <div class="w-1/2">
              <label class="text-sm font-style flex items-center"> Meeting Password </label>
              <input
                class="invite-ipt ipt-padding"
                type="password"
                placeholder="Set up a password for login"
              >
            </div>
          </div>
          <div
            class="my-3"
          >
            <div class="d-flex gap-4 relative">
              <div class="w-1/2">
                <label class="text-sm font-style flex items-center"> Start Time
                  <sub class="steric-sign label-required">&nbsp;*</sub>
                  <img
                    alt="tooltip"
                    src="../../assets/images/modal/Tooltip.svg"
                    class="cursor-pointer"
                  >
                </label>
                <input
                  type="text"
                  class="invite-ipt ipt-padding text-center"
                  value="HH/MM"
                  onfocus="this.type='time'"
                >
              </div>
              <div class="w-1/2">
                <label class="text-sm font-style flex items-center"> End Time
                  <sub class="steric-sign label-required">&nbsp;*</sub>
                  <img
                    alt="tooltip"
                    src="../../assets/images/modal/Tooltip.svg"
                    class="cursor-pointer"
                  >
                </label>
                <input
                  type="text"
                  class="invite-ipt ipt-padding text-center"
                  value="HH/MM"
                  onfocus="this.type='time'"
                >
              </div>
            </div>
          </div>
          <div class="my-3 w-1/2">
            <label class="text-sm font-style flex items-center">
              Date
            </label>
            <RangeCalender :range="range" />
          </div>
          <div class="my-3 flex justify-center flex-col gap-2">
            <label class="text-sm font-style flex items-center"> Select Recurrence Day(s) </label>
            <div class="flex flex-wrap justify-between gap-12">
              <label class="checkbox-container text-sm font-normal m-0">
                <input
                  v-model="dates.saturday"
                  type="checkbox"
                >
                <span class="text-base font-weight-bolder checkbox-margin">Saturday</span>
                <span
                  v-if="dates.saturday"
                  class="checkbox-label-active"
                />
                <span
                  v-else
                  class="checkbox-label-disabled"
                />
              </label>
              <label class="checkbox-container text-sm font-normal m-0">
                <input
                  v-model="dates.sunday"
                  type="checkbox"
                >
                <span class="text-base font-weight-bolder checkbox-margin">Sunday</span>
                <span
                  v-if="dates.sunday"
                  class="checkbox-label-active"
                />
                <span
                  v-else
                  class="checkbox-label-disabled"
                />
              </label>
              <label class="checkbox-container text-sm font-normal m-0">
                <input
                  v-model="dates.monday"
                  type="checkbox"
                >
                <span class="text-base font-weight-bolder checkbox-margin">Monday</span>
                <span
                  v-if="dates.monday"
                  class="checkbox-label-active"
                />
                <span
                  v-else
                  class="checkbox-label-disabled"
                />
              </label>
              <label class="checkbox-container text-sm font-normal m-0">
                <input
                  v-model="dates.tuesday"
                  type="checkbox"
                >
                <span class="text-base font-weight-bolder checkbox-margin">Tuesday</span>
                <span
                  v-if="dates.tuesday"
                  class="checkbox-label-active"
                />
                <span
                  v-else
                  class="checkbox-label-disabled"
                />
              </label>
              <label class="checkbox-container text-sm font-normal m-0">
                <input
                  v-model="dates.wednesday"
                  type="checkbox"
                >
                <span class="text-base font-weight-bolder checkbox-margin">Wednesday</span>
                <span
                  v-if="dates.wednesday"
                  class="checkbox-label-active"
                />
                <span
                  v-else
                  class="checkbox-label-disabled"
                />
              </label>
              <label class="checkbox-container text-sm font-normal m-0">
                <input
                  v-model="dates.thursday"
                  type="checkbox"
                >
                <span class="text-base font-weight-bolder checkbox-margin">Thursday</span>
                <span
                  v-if="dates.thursday"
                  class="checkbox-label-active"
                />
                <span
                  v-else
                  class="checkbox-label-disabled"
                />
              </label>
              <label class="checkbox-container text-sm font-normal m-0">
                <input
                  v-model="dates.friday"
                  type="checkbox"
                >
                <span class="text-base font-weight-bolder checkbox-margin">Friday</span>
                <span
                  v-if="dates.friday"
                  class="checkbox-label-active"
                />
                <span
                  v-else
                  class="checkbox-label-disabled"
                />
              </label>
            </div>
          </div>
        </form>
        <div class="flex items-center justify-between my-12">
          <img
            alt="Arrow"
            src="../../assets/images/modal/backArrow.svg"
            width="32px"
            class="cursor-pointer"
            @click="backToActivityType"
          >
          <div class="flex justify-end items-center gap-10 w-full">
            <p
              class="base-color-main m-0 cursor-pointer font-style"
              @click="$bvModal.hide('recurrenceModal')"
            >
              Cancel
            </p>
            <b-button
              class="next-btn-pkg d-flex items-center justify-around"
            >
              Create Activity
            </b-button>
          </div>
        </div>
      </main>
    </b-modal>
  </div>
</template>

<script>
import RangeCalender from '@/components/calender/RangeCalender.vue'
import { BButton } from 'bootstrap-vue'

export default {
  name: 'ActivityScheduleDetails',
  components: { RangeCalender, BButton },
  props: {
    payload: {
      type: Object,
      required: false,
    },
    dates: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      range: '',
    }
  },
  methods: {
    backToActivityType() {
      this.$bvModal.hide('recurrenceModal')
      this.$bvModal.show('activityTypeModal')
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
</style>
