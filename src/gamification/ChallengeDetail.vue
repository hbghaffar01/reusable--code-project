<template>
  <div>
    <SkeletonLoader v-if="loading" />
    <div
      v-else
      v-show="Object.keys(challengeData || {}).length && showChallenge"
      id="challenges"
    >
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-4">
          <h1 class="fitness-heading mb-0">
            {{ challengeData.title ? challengeData.title : '' }}
          </h1>
          <div
            v-for="(content, index) in challengeImages"
            :key="index"
            class="d-flex align-items-center gap-3 cursor-pointer"
          >
            <img
              :src="content.src"
              :alt="content.toolTip"
            >
          </div>
          <div>
            <button
              id="group-button-1"
              class="copy-btn"
              type="button"
              @click="copyToBoard()"
            >
              <img
                alt="Copy Link"
                src="@/assets/images/modal/CopyLink.svg"
                width="50px"
              >
            </button>
            <SnackBar v-if="snackbar" :value="$t('global.copied')" />
          </div>
        </div>
        <!--      button -->
        <div class="d-flex gap-4">
          <button
            class="btn-core font-weight-bold m-0"
            @click="setEditChallenge"
          >
            View/Edit Info
          </button>
          <button
            v-b-modal.deleteModal
            class="btn-core font-weight-bold m-0"
          >
            Delete Challenge
          </button>
        </div>
      </div>
      <div class="custom-container">
        <div class="flex items-center flex-wrap gap-4 my-2">
          <img
            :src="require('@/assets/images/icons/go-back.svg')"
            alt="edit"
            class="action-icons cursor-pointer"
            @click="goBack()"
          >
          <div class="tag rounded-full flex items-center">
            <img
              alt="test"
              :src="require('@/assets/images/icons/trophy.svg')"
            >
            <span>{{ challengeData.title }}</span>
          </div>
          <div class="tag rounded-full flex items-center">
            <img
              alt="calender"
              src="@/assets/images/icons/Calendar.svg"
            >
            <span>  {{ getStartTime(challengeData.start_date) }} </span>
            <span class="date-divider"> - </span>
            <span class="date-to"> {{ getEndTime(challengeData.end_date) }} </span>
            <span class="challenge-started" />
            <span class="passed-days"> {{ passedDays() }} / {{ totalDuration() }}</span>
          </div>
          <div class="tag rounded-full flex items-center">
            <img
              alt="participant"
              src="@/assets/images/icons/participant.svg"
            >
            Participants:
            <span class="participants"> {{ challengeData.numberOfParticipent }}</span>
          </div>
        </div>
      </div>
      <skeleton-loader v-if="loading" />
      <div class="custom-container">
        <div class="challenge-leaderboards-box">
          <leaderboard
            :participents="participents"
          />
        </div>
      </div>
      <div>
        <b-modal
          id="deleteModal"
          size="md"
          centered
          hide-footer
          hide-header
        >
          <DeleteModal @remove="deleteChallenge" />
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import {
  deleteChallenge,
  getChallengeById,
  getChallengeParticipents,
} from '@/apiManager/gamification'
import Leaderboard from '@/components/gamification/LeaderBoard.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import DeleteModal from '@/components/deleteModal/DeleteModal.vue'
import { SnackBar } from '@/components/UIElements'
import makeToast from '@/constants/toast'
import { copyToClipboard } from '@/utils'

export default {
  name: 'ChallengeDetail',
  components: {
    Leaderboard,
    SkeletonLoader,
    DeleteModal,
    SnackBar,
  },
  props: {
    challenge: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showInfo: false,
      challengeData: {},
      total: 0,
      data: {
        challengeId: '',
        limit: 20,
        offset: 0,
      },
      invite_uri: '',
      app_base_uri: process.env.VUE_APP_CHALLENGE,
      app_route: '/challenge/detail/',
      user_slug: 'xxxxxxxxxxx',
      snackbar: false,
      challengeActivity: '',
      challengeImages: [
        {
          src: require('@/assets/images/icons/timer-active.svg'),
          toolTip: 'Activity Log',
        },
        {
          src: require('@/assets/images/icons/location-active.svg'),
          toolTip: 'Check-Ins',
        },
        {
          src: require('@/assets/images/icons/steps-active.svg'),
          toolTip: 'Steps',
        },
        {
          src: require('@/assets/images/icons/health-active.svg'),
          toolTip: 'Heart Rate',
        },
        {
          src: require('@/assets/images/icons/core-points.svg'),
          toolTip: 'Core Points',
        },
      ],
      participents: [],
      showChallengerList: false,
      showCalendar: false,
      gamificationData: [],
      showLeaveBtn: false,
      showLeaveModal: false,
      showLeaveSuccess: false,
      selectedUserData: {},
      startFrom: '',
      endAt: '',
      totalDay: '',
      currentDay: '',
      remainingDays: '',
      loading: false,
      showChallenge: true,
      totalRecords: 0,
    }
  },
  mounted() {
    this.data.challengeId = this.challenge.slug_url
    this.getChallengeData()
    this.getParticipants(this.data)
  },
  methods: {
    goBack() {
      this.$emit('hideChallenge')
    },
    setEditChallenge() {
      this.$emit('setEditChallenge', this.challenge)
    },
    copyToBoard() {
      this.user_slug = this.challenge.slug_url
      this.invite_uri = this.app_base_uri + this.app_route + this.user_slug
      copyToClipboard(this.invite_uri)
      this.snackbar = true
      setTimeout(() => {
        this.snackbar = false
      }, 3000)
    },
    deleteChallenge() {
      const delId = this.challenge.id
      deleteChallenge(delId)
        .then(response => {
          if (response.statusCode === 204) {
            makeToast(this.$bvToast, 'Challenge deleted successfully', 'success', 'success')
            this.$bvModal.hide('deleteModal')
            this.$emit('hideChallenge')
          } else {
            this.getChallengeData()
            makeToast(this.$bvToast, response.message)
          }
          this.$bvModal.hide('deleteModal')
          this.showChallenge = false
        })
    },
    async getChallengeData() {
      this.loading = true
      const data = { dataId: this.data.challengeId }
      await getChallengeById(data)
        .then(response => {
          this.challengeData = response.data
          this.loading = false
          // makeToast('Challenge Listed successfully', 'success', 'success')
          // this.getDatesDifference(this.challengeData.start_date, this.challengeData.end_date)
        })
        .catch(error => {
          // toastr.error(error[0].response.data.errors[0].error)
        })
    },
    getStartTime(startDate) {
      const startingDate = startDate.split('T')[0].split('-') // split date start date(2023-01-22T20:00:00.000Z) and give us 2023-01-22 and further split from '-' and seprates day month and year
      this.startFrom = `${startingDate[0]}-${startingDate[1]}-${startingDate[2]}` // this date is javascript standard date
      return `${startingDate[2]}/${startingDate[1]}/${startingDate[0]}` // this date is design required date
    },
    getEndTime(endDate) {
      const endingDate = endDate.split('T')[0].split('-') // split date end date(2023-01-22T20:00:00.000Z) and give us 2023-01-22 and further split from '-' and seprates day month and year
      this.endAt = `${endingDate[0]}-${endingDate[1]}-${endingDate[2]}` // this date is javascript standard date
      return `${endingDate[2]}/${endingDate[1]}/${endingDate[0]}` // this date is design required date
    },
    totalDuration() {
      const date1 = new Date(this.startFrom).getTime() // gives us timestamp in milliseconds (1674777600000)
      const date2 = new Date(this.endAt).getTime() // gives us timestamp in milliseconds (1674777600000)
      const diffTime = date2 - date1 // gives us timestamp by subtracting date1 and date 2 in milliseconds (1674777600000)
      this.totalDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // convert timestamp into days and math.ciel round it into nearest most possible number
      return this.totalDay + 1 // js is 0 indexed so to get accurate date we have to + 1
    },
    passedDays() {
      const today = new Date()
      const year = today.getFullYear() // return current year
      const month = today.getMonth() + 1 // return us 11 bcz js is 0 indexed so to get 12 month we have to + 1
      const day = today.getDate() // return current day
      const currDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}` // (month < 10 ? '0' + month : month) if month less < 10 it will add 0 in front of month
      this.currentDay = currDate
      const startTime = new Date(this.startFrom).getDate() // return start time date for e.g 24
      const endingAt = new Date(this.endAt).getDate() // return end time date for e.g 24
      const currDay = new Date(this.currentDay).getDate() // return current time date for e.g today is 24
      // if 24 < 26 than return -3
      if (currDay < startTime) {
        const diffTime = currDay - startTime // current day minus with challenge start time
        this.remainingDays = Math.ceil(diffTime) // if floating number than round it to nearest possible number
        return this.remainingDays === 0 ? 1 : this.remainingDays // if task start on 23 and end on 23 it will return 1 not 0
      }
      // if curr day is 25 and task end on 20 it will return the total duration from totalDuration() function
      if (currDay > endingAt) {
        return this.totalDay === 0 ? 1 : this.totalDay + 1 // if task start on 23 and end on 23 it will return 1 not 0
      }
      // if currentday and start time are same than it will return 1 to represnet the 1st day of task
      return (currDay - startTime) === 0 ? 1 : (currDay - startTime) + 1
    },
    getParticipants(data) {
      getChallengeParticipents(data)
        .then(response => {
          this.participents = response.data.participents
          this.totalRecords = response.data.totalCount
        })
        .catch(error => {
          // toastr.error(error[0].response.data.errors[0].error)
        })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/base/core/colors/palette-variables.scss';

#challenges .tag {
  border: 1px solid $core-direction-base;
  font-size: 16px;
  padding: 0.5rem 2rem 0.5rem 1rem;
  font-weight: 600;
  color: $core-direction-base;
}

#challenges .tag .challenge-started {
  position: relative;
}

#challenges .tag .challenge-started::before {
  content: "";
  position: absolute;
  top: -30px;
  bottom: -30px;
  left: 0;
  width: 1px;
  background: $core-direction-base;
}

.date-divider {
  margin: 0 0.5rem;
}

.date-to {
  margin: 0 1rem 0 0;
}

.passed-days {
  margin: 0 0 0 1rem;
}

.participants {
  margin: 0 0 0 1rem;
}

.fitness-heading {
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: center;
}
</style>
