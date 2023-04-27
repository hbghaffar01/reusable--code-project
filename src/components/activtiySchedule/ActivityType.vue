<template>
  <div>
    <b-modal
      id="activityTypeModal"
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
            Steps 2 / 3
          </p>
        </div>
        <form>
          <div class="my-3">
            <div class="d-flex gap-4 relative">
              <div class="w-1/2">
                <label class="text-sm font-style flex items-center"> Enter Activity Name
                  <sub class="steric-sign label-required">&nbsp;*</sub>
                  <img
                    alt="tooltip"
                    src="../../assets/images/modal/Tooltip.svg"
                    class="cursor-pointer"
                  >
                </label>
                <input
                  v-if="showActivities"
                  type="text"
                  class="invite-ipt ipt-padding"
                  value="Enter Activity Name"
                >
                <b-form-select
                  v-else
                  v-model="selectedActivityType"
                  class="invite-ipt py-0"
                  :options="activityTypeOptions"
                  style="padding: 10px"
                />
              </div>
              <div class="flex items-end">
                <b-button
                  class="upload-btn d-flex items-center justify-around font-style text-light"
                  type="button"
                  @click="showActivities = !showActivities"
                >
                  <img
                    alt="Plus Icon"
                    src="../../assets/images/modal/PlusIcon.svg"
                    width="12px"
                    class="mr-1"
                  >
                  Create
                </b-button>
              </div>
              <div class="w-1/2">
                <label class="text-sm font-style flex items-center"> Max Participants allowed (Capacity)
                  <sub class="steric-sign label-required">&nbsp;*</sub>
                  <img
                    alt="tooltip"
                    src="../../assets/images/modal/Tooltip.svg"
                    class="cursor-pointer"
                  >
                </label>
                <input
                  type="text"
                  class="invite-ipt ipt-padding"
                  value="300"
                >
              </div>
            </div>
          </div>
          <div
            v-if="showActivities"
            class="my-3"
          >
            <label class="text-sm font-style flex items-center"> Enter Description
              <sub class="steric-sign label-required">&nbsp;*</sub>
              <img
                alt="tooltip"
                src="../../assets/images/modal/Tooltip.svg"
                class="cursor-pointer"
              >
            </label>
            <textarea
              type="text"
              class="invite-ipt ipt-padding"
              placeholder="Enter description"
              rows="6"
            />
          </div>
          <div
            v-if="showActivities"
            class="my-3"
          >
            <label class="text-sm font-style flex items-center"> Select an Activity Type
              <sub class="steric-sign label-required">&nbsp;*</sub>
              <img
                alt="tooltip"
                src="../../assets/images/modal/Tooltip.svg"
                class="cursor-pointer"
              >
            </label>
            <div class="activity-type-filter-box">
              <ScheduleActivityTypes :activities="payload.activities" />
            </div>
          </div>
        </form>
        <div
          class="flex items-center justify-between my-12"
          :class="{'mt-96' : !showActivities}"
        >
          <img
            alt="Arrow"
            src="../../assets/images/modal/backArrow.svg"
            width="32px"
            class="cursor-pointer"
            @click="backToCreateActivity"
          >
          <div class="flex justify-end items-center gap-10 w-full">
            <p
              class="base-color-main m-0 cursor-pointer font-style"
              @click="$bvModal.hide('activityTypeModal')"
            >
              Cancel
            </p>
            <b-button
              v-b-modal.recurrenceModal
              class="next-btn-pkg d-flex items-center justify-around"
              @click="showActivityRecurrenceModal"
            >
              Next
              <img
                alt="Arrow"
                src="../../assets/images/modal/Arrow-1.svg"
                width="10px"
              >
            </b-button>
          </div>
        </div>
      </main>
    </b-modal>
    <ActivityScheduleDetails />
  </div>
</template>

<script>
import ActivityScheduleDetails from '@/components/activtiySchedule/ActivityScheduleDetails.vue'
import ScheduleActivityTypes from '@/components/activtiySchedule/ScheduleActivityTypes.vue'
import { BButton, BFormSelect } from 'bootstrap-vue'
import { getGroupActivityTypes } from '@/apiManager/groups'

export default {
  name: 'ActivityType',
  components: {
    BButton,
    BFormSelect,
    ActivityScheduleDetails,
    ScheduleActivityTypes,
  },
  data() {
    return {
      selectedActivityType: null,
      activityTypeOptions: [
        { value: null, text: 'Select Activity Type' },
        { value: 'waterSport', text: 'Water Sport' },
        { value: 'tableTennis', text: 'Table Tennis' },
        { value: 'football', text: 'Football' },
      ],
      showActivities: false,
      payload: {
        activities: [],
      },
    }
  },
  created() {
    this.getGroupActivities()
  },
  methods: {
    async getGroupActivities() {
      try {
        const { data } = await getGroupActivityTypes()
        this.payload.activities = data.map(activity => ({
          ...activity,
          isSelected: false,
          image: `${process.env.VUE_APP_ASSETS_PREFIX}activity/${activity.imageName}`,
        }))
      } catch (error) {
        console.error(error)
      }
    },
    showActivityRecurrenceModal() {
      this.$bvModal.hide('activityTypeModal')
      this.$bvModal.show('recurrenceModal')
    },
    backToCreateActivity() {
      this.$bvModal.hide('activityTypeModal')
      this.$bvModal.show('createActivityModal')
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/global.scss";
@import "@/@core/mixins/ui/_button.scss";

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
