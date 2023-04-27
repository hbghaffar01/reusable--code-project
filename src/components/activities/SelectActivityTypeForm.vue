<template>
  <form>
    <div class="my-3">
      <div class="d-flex gap-4 relative">
        <div class="w-1/2">
          <label class="text-sm font-style flex items-center"> Enter Activity Name
            <sub class="text-danger text-lg label-required">*</sub>
            <Tooltip
              :msg="'This is the user-facing name for the activity'"
              target-id="activity-name"
            />
          </label>
          <input
            v-model="activityTypeData.name"
            type="text"
            :class="`invite-ipt ipt-padding ${showActivities?'':'hide'}`"
            placeholder="Enter Activity Name"
          >
          <b-form-select
            v-model="payload.activity_id"
            :disabled="isEdit"
            :class="`invite-ipt py-0 ${showActivities?'hide':''}`"
            :options="activityTypes"
            style="padding: 10px"
          />
        </div>
        <div
          v-if="!isEdit"
          class="flex items-end"
        >
          <b-button
            class="upload-btn d-flex items-center justify-around font-style text-light"
            type="button"
            @click="saveActivityShow"
          >
            <plus-icon />
            <span class="create-btn">Create</span>
          </b-button>
        </div>
        <div class="w-1/2">
          <label class="text-sm font-style flex items-center"> Max Participants allowed (Capacity)
            <sub class="text-danger text-lg label-required">*</sub>
            <Tooltip
              :msg="'This is the capacity limit of the class'"
              target-id="participants"
            />
          </label>
          <input
            v-model.number="payload.slots"
            type="text"
            class="invite-ipt ipt-padding"
          >
        </div>
      </div>
    </div>
    <div
      :class="`my-3 ${showActivities ? '' : 'hide'}`"
    >
      <label class="text-sm font-style flex items-center"> Enter Description
        <sub class="text-danger text-lg label-required">*</sub>
      </label>
      <textarea
        v-model="activityTypeData.description"
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
        <sub class="text-danger text-lg label-required">*</sub>
        <Tooltip
          :msg="'Choose which activity type your activity fits into so users can find your activity more easily.'"
          target-id="select-activity"
        />
      </label>
      <div class="activity-type-filter-box">
        <ScheduleActivityTypes
          :activities="activities"
          @onToggleActivity="toggleActivity"
        />
      </div>
    </div>
  </form>
</template>

<script>
import ScheduleActivityTypes from '@/components/activtiySchedule/ScheduleActivityTypes.vue'
import { BButton, BFormSelect } from 'bootstrap-vue'
import { getGroupActivityTypes } from '@/apiManager/groups'
import Tooltip from '@/components/Tooltip/Tooltip.vue'
import PlusIcon from '@/svgs/plus-icon.vue'
import {
  createScheduleActivityType,
  getScheduleActivityType,
} from '@/apiManager/scheduleActivity'

export default {
  name: 'SelectActivityTypeFrom',
  components: {
    Tooltip,
    BButton,
    BFormSelect,
    ScheduleActivityTypes,
    PlusIcon,
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
  },
  data() {
    return {
      selectedActivityType: null,
      activityTypes: [],
      showActivities: false,
      activityTypeData: {
        activity_type_id: 0,
        name: '',
        description: '',
        imageName: '',
      },
      activities: [],
    }
  },
  created() {
    this.getGroupActivities()
    this.getCustomActivities()
  },
  methods: {
    async getCustomActivities() {
      const { data } = await getScheduleActivityType()
      this.activityTypes = [{ value: null, text: 'Select Activity' }, ...data.map(activity => ({
        value: activity.id,
        text: activity.name,
      }))]
    },
    async getGroupActivities() {
      try {
        const { data } = await getGroupActivityTypes()

        this.activities = data.map(activity => ({
          ...activity,
          isSelected: false,
          image: `${process.env.VUE_APP_ASSETS_PREFIX}activity/${activity.imageName}`,
        }))
      } catch (error) {
        console.error(error)
      }
    },
    async saveNewActivity() {
      try {
        const { statusCode } = await createScheduleActivityType(this.getCreateScheduleActivityPayload())
        if (statusCode === 201) {
          this.makeToast('Activity type has been created successfully.', 'success', 'Success')
          this.getCustomActivities()
        }
      } catch (e) {
        console.error(e)
      }
    },
    saveActivityShow() {
      if (this.showActivities) {
        if (this.activityTypeData.name && this.activityTypeData.description && this.activityTypeData.activity_type_id) {
          this.saveNewActivity()
        }
      }
      this.showActivities = !this.showActivities
      this.$emit('disableNextOnCreatingActivity', this.showActivities)
    },
    getCreateScheduleActivityPayload() {
      return this.activityTypeData
    },
    toggleActivity(selectedActivity) {
      this.activities = this.activities.map(activity => ({
        ...activity,
        isSelected: activity.id === selectedActivity.id,
      }))
      const updatedActivity = this.activities.find(activity => activity.isSelected)
      if (updatedActivity) {
        this.activityTypeData.activity_type_id = updatedActivity.id
        this.activityTypeData.imageName = updatedActivity.image
      }
    },
    makeToast(msg, variant, title) {
      this.$bvToast.toast(msg, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: true,
      })
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

.create-btn {
  margin-left: 5px;
}
</style>
