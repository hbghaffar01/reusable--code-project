<template>
  <Popup ref="EditCapacityPopup" :size="POPUP_SIZES.MEDIUM" :animation="POPUP_ANIMATIONS.FADE">
    <template v-slot:children>
      <div class="editor">
        <H4 class="editor-heading" :value="$t('activity.editCapacity.heading')" />
        <div class="editor-group">
          <H6 :value="activityInformation.scheduleDetail.activity_schedule.activity.name || '' " />
          <div v-if="activityInformation.scheduleDetail.instructor" class="editor-group-instructor">
            <span>{{ $t('activity.editCapacity.with') }}</span>
            {{ activityInformation.scheduleDetail.instructor ? activityInformation.scheduleDetail.instructor.firstName : '' }}
            <Paragraph :value="`${activityInformation.scheduleDetail.instructor ? activityInformation.scheduleDetail.instructor.firstName : ''} ${activityInformation.scheduleDetail.instructor ? activityInformation.scheduleDetail.instructor.lastName : ''}`" />
          </div>
        </div>
        <div class="editor-subGroup">
          <div class="editor-type">
            <H6 :value="$t('activity.editCapacity.type')" />
            <Paragraph :value="activityInformation.scheduleDetail.activity_schedule.activity.activity_type.name || '' " />
          </div>
          <div class="editor-type">
            <H6 :value="$t('activity.editCapacity.payment')" />
            <Paragraph :value="getPaymentType(activityInformation.scheduleDetail.activity_schedule.is_free || '', activityInformation.scheduleDetail.activity_schedule.offer_online || '' )" />
          </div>
        </div>
        <div class="editor-subGroup">
          <div class="editor-type">
            <H6 :value="$t('activity.editCapacity.date')" />
            <Paragraph :value="formattedDate(activityInformation.scheduleDetail.schedule_date)" />
          </div>
          <div class="editor-type">
            <H6 :value="$t('activity.editCapacity.status')" />
            <Paragraph :value="getStatus(activityInformation.scheduleDetail.schedule_date, activityInformation.scheduleDetail.duration)" />
          </div>
        </div>
        <div class="editor-subGroup">
          <div class="editor-type">
            <H6 :value="$t('activity.editCapacity.Bookings')" />
            <Paragraph :value="`${activityInformation.bookingCount ? activityInformation.bookingCount : 0}/${activityInformation.scheduleDetail.slots ? activityInformation.scheduleDetail.slots : 0}`" />
          </div>
          <div class="editor-type">
            <H6 :value="$t('activity.editCapacity.time')" />
            <Paragraph :value="remainingTime(activityInformation.scheduleDetail.schedule_date, activityInformation.scheduleDetail.duration)" />
          </div>
        </div>

        <div>
          <div class="editor-group">
            <H6 :value="$t('activity.editCapacity.capacity')" />
            <div class="editor-input">
              <Input v-model="activityInformation.scheduleDetail.slots" class="editor-input-input" type="number" />
              <Icon class="actions-icons" :type="ICONS.PENCIL" :size="SIZES.MEDIUM" />
            </div>
          </div>
          <div v-if="activityInformation.scheduleDetail.activity_schedule.offer_online === false" class="editor-subGroup">
            <div class="editor-type">
              <H6 :value="$t('activity.editCapacity.locName')" />
              <Input :readonly="readOnly" :value="activityInformation.scheduleDetail.activity_schedule.facility_zones.title || '' " />
            </div>
            <div class="editor-type">
              <H6 :value="$t('activity.editCapacity.place')" />
              <Input :readonly="readOnly" :value="activityInformation.scheduleDetail.activity_schedule.facility_zones.description || '' " />
            </div>
          </div>

          <div class="editor-subGroup">
            <div class="editor-type">
              <H6 :value="$t('activity.editCapacity.start')" />
              <div class="editor-time-input">
                <Input class="editor-type-input" :readonly="readOnly" :value="formattedDuration(activityInformation.scheduleDetail.schedule_date, activityInformation.scheduleDetail.duration).split('-')[0].split(':')[0]" />
                <Input class="editor-type-input" :readonly="readOnly" :value="formattedDuration(activityInformation.scheduleDetail.schedule_date, activityInformation.scheduleDetail.duration).split('-')[0].split(':')[1]" />
              </div>
            </div>
            <div class="editor-type">
              <H6 :value="$t('activity.editCapacity.end')" />
              <div class="editor-time-input">
                <Input class="editor-type-input" :readonly="readOnly" :value="formattedDuration(activityInformation.scheduleDetail.schedule_date, activityInformation.scheduleDetail.duration).split('-')[1].split(':')[0]" />
                <Input class="editor-type-input" :readonly="readOnly" :value="formattedDuration(activityInformation.scheduleDetail.schedule_date, activityInformation.scheduleDetail.duration).split('-')[1].split(':')[1]" />
              </div>
            </div>
          </div>
        </div>
        <div class="capacity-buttons">
          <Button type="button" :btnType="BUTTON_TYPES.DEFAULT" :value="$t('global.close')" @click="close()" />
          <Button class="capacity-update-button" type="button" :btnType="BUTTON_TYPES.PRIMARY" :value="$t('global.update')" @click="SlotsUpdate" />
        </div>
      </div>
    </template>
  </Popup>
</template>

<script>
import { H4, H6, Paragraph } from '@/components/Typography'
import { Popup, POPUP_SIZES, POPUP_ANIMATIONS } from '@/components/Popup'
import { Icon, ICONS, SIZES } from '@/components/UIElements'
import { Input } from '@/components/Form'
import { Button, BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPES } from '@/components/Buttons'
import { getPaymentType, formattedDate, formattedDuration, getStatus, makeToast } from '@/utils'
import { updateScheduleActivitySlots } from '@/apiManager/attendanceManagement'

export default {
  name: 'EditCapacity',
  components: {
    H4,
    H6,
    Icon,
    Popup,
    Button,
    Input,
    Paragraph,
  },
  props: {
    activityInformation: {
      type: Object,
      required: true,
    },
    participantId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      POPUP_SIZES,
      POPUP_ANIMATIONS,
      BUTTON_STYLE,
      BUTTON_TYPES,
      BUTTON_SIZE,
      ICONS,
      SIZES,
      getPaymentType,
      formattedDate,
      getStatus,
      formattedDuration,
      makeToast,
      timeLeft: '',
      readOnly: true,
    }
  },
  methods: {
    SlotsUpdate() {
      const id = this.participantId
      const slots = {
        slots: +this.activityInformation.scheduleDetail.slots,
      }
      updateScheduleActivitySlots(slots, id).then(response => {
        if (response.statusCode === 200) {
          this.makeToast(this.$bvToast, this.$t('activity.editCapacity.slots'), 'success')
        } else {
          this.makeToast(this.$bvToast, response.message, 'danger')
        }
        this.close()
      })
    },
    remainingTime(date, duration) {
      const currentTime = new Date().getTime()
      this.timeLeft = new Date(date).getTime() + duration * 60 * 1000
      const remainingTime = Math.round((this.timeLeft - currentTime) / 1000)

      const days = Math.floor(remainingTime / 86400)
      const hours = Math.floor((remainingTime % 86400) / 3600)
      const minutes = Math.floor((remainingTime % 3600) / 60)

      return `${`${days} ${this.$t('global.message.day')}` || ''} ${`${hours} ${this.$t('global.message.hour')}` || ''} ${`${minutes} ${this.$t('global.message.minute')}` || ''}`
    },
    close() {
      this.$refs.EditCapacityPopup.close()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';

.editor {
  padding: 40px 150px;
  &-heading {
    margin: 0 0 4rem 0;
  }
  &-group {
    width: 100%;
    margin: 2rem 0;
    &-instructor {
      display: flex;
      gap: 0.5rem;
    }
  }
  &-subGroup {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 3rem 0;
    gap: 2rem;
  }
  &-type {
    text-align: left;
    width: 50%;
    &-input {
      width: 100%;
    }
  }
  &-input {
    width: 100%;
    display: flex;
    align-items: center;
    &-input {
      width: 45%;
    }
    .actions-icons {
      background-color: $primary-default;
      color: $white;
      margin-left: 1rem;
      padding: 5px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  &-time-input {
    display: flex;
    width: 100%;
    gap: 1rem;
  }
  .capacity-buttons {
    display: flex;
    justify-content: end;
    gap: 1.5rem;
    text-align: center;
    margin: 6rem 0 2rem 0;
  }
}
</style>
