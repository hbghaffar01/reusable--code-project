<template>
  <div class="overflow-hidden w-100">
    <div class="d-flex w-full justify-content-between">
      <div
        class="nav-pill-heading"
        style="width: 200px"
      >
        Challenges
      </div>
      <div class="position-relative mb-1 w-100">
        <div
          class="nav nav-tabs flex flex-wrap justify-content-between justify-content-lg-start list-none border-b-0 w-100"
        >
          <div class="nav-item">
            <p
              class="nav-link p-1 cursor-pointer"
              :class="{'active': data.type === 'PREVIOUS'}"
              @click="setTab('PREVIOUS')"
            >
              Previous Challenges
            </p>
          </div>
          <div class="nav-item">
            <p
              class="nav-link p-1 cursor-pointer"
              :class="{'active': data.type === 'CURRENT'}"
              @click="setTab('CURRENT')"
            >
              Current Challenges
            </p>
          </div>
          <div class="nav-item m-0">
            <p
              class="nav-link p-1 cursor-pointer m-0"
              :class="{'active': data.type === 'UPCOMING'}"
              @click="setTab('UPCOMING')"
            >
              Upcoming Challenges
            </p>
          </div>
        </div>
        <div class="slider-1" />
      </div>
    </div>
    <SkeletonLoader v-if="loading" />
    <div
      v-else
      class="w-100 card m-0 table-scroll"
      style="overflow-x: auto; height: max-content"
    >
      <NoRecordFound v-if="!allChallenges.length" />
      <table
        v-else
        class="text-center w-100 table-resp"
      >
        <thead>
          <tr class="text-white font-weight-bold header-bg">
            <th>#</th>
            <th class="text-left challenge-title">
              Challenge Name
            </th>
            <th>
              Challenge Type
            </th>
            <th>
              Start Date
            </th>
            <th>
              End Date
            </th>
            <th>
              Duration
            </th>
            <th>
              No. of Participants
            </th>
            <th>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(challenge, index) in allChallenges"
            :key="index"
          >
            <td>
              {{ challenge.id }}
            </td>
            <td class="text-left challenge-title">
              {{ challenge.title }}
            </td>
            <td>
              <div class="actions gap-4">
                <img
                  v-for="(images, key) in localImages"
                  :key="key"
                  :src="images"
                  alt="actions"
                >
              </div>
            </td>
            <td>
              {{ dateFormat(challenge.start_date) }}
            </td>
            <td>
              {{ dateFormat(challenge.end_date) }}
            </td>
            <td>
              {{ challenge.duration }} Day(s)
            </td>
            <td>
              {{ challenge._count.user_gamification_challenge }}
            </td>
            <td>
              <div class="actions">
                <img
                  v-if="data.type !== 'PREVIOUS'"
                  :src="require('@/assets/images/icons/edit-icon.svg')"
                  alt="edit"
                  class="action-icons"
                  @click="setEditData(challenge)"
                >
                <img
                  v-b-modal.deleteModal
                  :src="require('@/assets/images/icons/delete-icon.svg')"
                  alt="delete"
                  class="action-icons"
                  @click="delId = challenge.id"
                >
                <img
                  :src="`${leaderBoardShow === index ? require('@/assets/images/icons/arrow-next.svg') : require('@/assets/images/ranks/rank1.svg')}`"
                  alt="trophy"
                  class="action-icons"
                  @click="showLeaderBoard(challenge)"
                  @mouseenter="leaderBoardShow = index"
                  @mouseleave="leaderBoardShow = -1"
                >
                <Button
                  :btnType="BUTTON_TYPES.PRIMARY"
                  :size="BUTTON_SIZE.MEDIUM"
                  :btnStyle="BUTTON_STYLE.ROUND"
                  class="copy-button"
                  @click="copyToBoard(challenge)"
                >
                  <template v-slot:children>
                    <Icon :type="ICONS.COPY" />
                  </template>
                </Button>
                <SnackBar v-if="snackbar" :value="$t('global.copied')" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-2">
      <Pagination
        v-if="allChallenges.length"
        :limit="data.limit"
        :offset="data.offset"
        :count="totalRecords"
        @fetch-data="getChallenges"
      />
    </div>
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
</template>

<script>
import { deleteChallenge, getAllChallenges } from '@/apiManager/gamification'
import { Pagination, SkeletonLoader, NoRecordFound } from '@/components/common'
import DeleteModal from '@/components/deleteModal/DeleteModal.vue'
import { Icon, ICONS, SnackBar } from '@/components/UIElements'
import { copyToClipboard, dateFormat } from '@/utils'
import { Button, BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPES } from '@/components/Buttons'

export default {
  name: 'GroupListing',
  components: {
    Icon,
    DeleteModal,
    Pagination,
    NoRecordFound,
    SkeletonLoader,
    SnackBar,
    Button,
  },
  data() {
    return {
      ICONS,
      BUTTON_SIZE,
      BUTTON_STYLE,
      BUTTON_TYPES,
      dateFormat,
      loading: false,
      leaderBoardShow: -1,
      allChallenges: [],
      previous: true,
      delId: '',
      snackbar: false,
      invite_uri: '',
      user_slug: '',
      app_base_uri: process.env.VUE_APP_CHALLENGE,
      app_route: '/challenge/detail/',
      data: {
        limit: 10,
        offset: 0,
        type: 'CURRENT',
        currentDate: new Date().toISOString(),
      },
      totalRecords: 0,
      localImages: [
        require('@/assets/images/icons/total-time.svg'),
        require('@/assets/images/icons/location-identifier.svg'),
        require('@/assets/images/icons/steps.svg'),
        require('@/assets/images/icons/health.svg'),
        require('@/assets/images/icons/core-points.svg'),
      ],
    }
  },
  mounted() {
    this.getChallenges()
  },
  methods: {
    getChallenges() {
      this.loading = true

      const payload = {
        limit: this.data.limit,
        offset: this.data.offset,
        type: this.data.type,
        currentDate: this.data.currentDate,
      }
      getAllChallenges(payload)
        .then(response => {
          if (response.statusCode === 200) {
            this.allChallenges = response.data
            this.totalRecords = response.meta.item_count
            this.loading = false
          } else {
            this.makeToast(response.message)
          }
        })
    },
    copyToBoard(challenge) {
      this.user_slug = challenge.slug_url
      this.invite_uri = this.app_base_uri + this.app_route + this.user_slug
      copyToClipboard(this.invite_uri)
      this.snackbar = true
      setTimeout(() => {
        this.snackbar = false
      }, 3000)
    },
    deleteChallenge() {
      deleteChallenge(this.delId)
        .then(response => {
          if (response.statusCode === 204) {
            this.$bvModal.hide('deleteModal')
            this.makeToast(this.$t('gamification.delete'), 'success', 'success')
          } else {
            this.makeToast(response.message)
          }
          this.$bvModal.hide('deleteModal')
          this.getChallenges()
        })
    },
    makeToast(msg, title, variant) {
      this.$bvToast.toast(msg, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: true,
      })
    },
    setEditData(data) {
      this.$emit('setEditData', data)
    },
    showLeaderBoard(data) {
      this.$emit('showLeaderBoard', data)
    },
    setTab(key) {
      this.data.type = key
      this.getChallenges()
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/base/colors';
@import "@/assets/scss/global.scss";
@import '@core/scss/base/core/colors/palette-variables.scss';

.challenge-title {
  width: 300px;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  & img:hover {
    cursor: pointer;
  }
}

.package-body tr {
  background: #FFFFFF;
  box-shadow: 1px 3px 7px rgba(0, 0, 0, 0.15);
}

.copy-button {
  font-size: 1.6rem !important;
}
</style>
