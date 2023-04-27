<template>
  <div>
    <b-modal
      id="challengeCreateModal"
      size="lg"
      hide-header
      hide-footer
    >
      <main class="mx-20 my-16">
        <div class="flex items-center justify-between">
          <p class="text-lg font-style m-0">
            {{ challengeId ? 'Update' : 'Create' }} Challenge
          </p>
          <p class="base-color-main text-sm font-weight-bolder m-0">
            Steps 1 / 2
          </p>
        </div>
        <!--Challenge Name-->
        <form>
          <div class="my-3">
            <label class="text-sm font-style">
              Enter Challenge Name
              <sub class="text-danger text-lg label-required">*</sub>
            </label>
            <input
              v-model="payload.title"
              class="invite-ipt"
              value="Challenge Name"
              type="text"
            >
          </div>
          <!--Label For Challenge Name-->
          <div class="my-3 w-1/2">
            <label class="text-sm font-style">
              Select Range for Challenge
              <sub class="text-danger text-lg label-required">*</sub>
            </label>
            <div>
              <RangeCalender
                :range="range"
                :min-date="new Date()"
                @selectedDate="getDateRange"
              />
            </div>
          </div>
          <div class="w-full">
            <div class="flex gap-3 items-center">
              <label class="text-sm font-style">
                Select Challenge Type
              </label>
            </div>
            <div class="flex gap-12">
              <label class="checkbox-container text-sm font-normal checkbox-padding">
                <input
                  v-model="core"
                  type="checkbox"
                  name="check_2"
                  disabled
                >
                <span class="text-base font-weight-bolder ml-3">Core Points</span>
                <span class="checkmark" />
              </label>
            </div>
          </div>
          <div class="my-3">
            <div class="flex items-center">
              <label class="text-sm font-style">
                Description
                <sub class="text-danger text-lg label-required">*</sub>
              </label>
            </div>
            <RichTextEditor v-model="payload.description" @onInput="onInput" />
          </div>

          <div class="w-full">
            <div class="flex gap-3 items-center">
              <label class="text-sm font-style">
                Participants by
              </label>
            </div>
            <div class="flex gap-3 align-items-center">
              <label class="checkbox-container text-sm font-normal checkbox-padding">
                <input
                  v-model="payload.is_default"
                  type="checkbox"
                  name="check_3"
                >
                <span class="text-base font-weight-bolder ml-3">Make this Challenge Default</span>
                <span class="checkmark" />
              </label>
              <Tooltip
                :msg="'By selecting “Default” you’ll be able to automatically invite your organization’s employees to take part in this challenge'"
                target-id="isDefault"
                class="mb-1"
              />
            </div>
          </div>
          <div class="d-flex justify-between items-center">
            <div class="flex items-center justify-content-between w-full gap-10 pt-1">
              <p
                class="base-color-main m-0 cursor-pointer font-style"
                @click="$bvModal.hide('challengeCreateModal')"
              >
                Cancel
              </p>
              <b-button
                v-b-modal.uploadImageModal
                class="next-btn-pkg d-flex items-center justify-around"
                :class="{ 'btn-active': payload.title && range && Enable}"
                :disabled="!payload.title || !range || !Enable"
                @click="showCreateChallenge"
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
        </form>
      </main>
    </b-modal>
    <b-modal
      id="uploadImageModal"
      size="lg"
      hide-header
      hide-footer
    >
      <UploadImage
        :payload="payload"
        :user-information="userInformation"
        :challenge-id="challengeId"
        @create="createChallenge"
        @setLogo="setLogo"
        @setCover="setCover"
        @deleteCover="deleteCover"
        @deleteLogo="deleteLogo"
        @updateDeleteLogo="updateDeleteLogo"
        @updateCoverLogo="updateCoverLogo"
        @update="updateChallenge"
      />
    </b-modal>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import { RichTextEditor } from '@/components/common/TextEditor'
import RangeCalender from '@/components/calender/RangeCalender.vue'
import UploadImage from '@/components/gamification/UploadImage.vue'
import makeToast from '@/constants/toast'
import { createChallenge, updateChallenge } from '@/apiManager/gamification'
import Tooltip from '../Tooltip/Tooltip.vue'

export default {
  name: 'CreateChallenge',
  components: {
    BButton, UploadImage, RangeCalender, Tooltip, RichTextEditor,
  },
  props: {
    editData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      payload: {
        title: '',
        logo: '',
        cover_photo: '',
        description: '',
        start_date: '',
        end_date: '',
        is_default: false,
      },
      core: true,
      challengeId: '',
      range: '',
      Enable: false,
    }
  },
  computed: {
    ...mapGetters({
      loggedinUser: 'user/loggedInUserInformation',
    }),
    userInformation() {
      return this.loggedinUser
    },
  },
  watch: {
    editData: {
      handler() {
        this.setEditData()
      },
      deep: true,
    },
  },
  methods: {
    onInput(data) {
      this.payload.description = data
      this.Enable = this.payload.description.length > 0;
    },
    showCreateChallenge() {
      this.$bvModal.hide('challengeCreateModal')
      this.$bvModal.show('uploadImageModal')
    },
    getDateRange(dateRange) {
      this.range = dateRange
      const dates = dateRange.split('to')
      this.payload.start_date = (`${dates[0]}T00:00:01.000Z`).replace(/\s/g, '')
      this.payload.end_date = dates.length > 1 ? (`${dates[1]}T00:00:01.000Z`).replace(/\s/g, '') : (`${dates[0]}T00:00:01.000Z`).replace(/\s/g, '')
    },
    setLogo(key) {
      this.payload.logo = key
    },
    setCover(key) {
      this.payload.cover_photo = key
    },
    deleteCover(key) {
      delete this.payload.cover_photo
      return key
    },
    deleteLogo(key) {
      delete this.payload.logo
      return key
    },
    updateDeleteLogo(data) {
      this.payload.logo = data
    },
    updateCoverLogo(data) {
      this.payload.cover_photo = data
    },
    createChallenge() {
      const payload = {
        title: this.payload.title,
        logo: this.payload.logo ? this.payload.logo : this.userInformation.avatar,
        cover_photo: this.payload.cover_photo ? this.payload.cover_photo : this.userInformation.companyBanner,
        description: this.payload.description,
        start_date: this.payload.start_date,
        end_date: this.payload.end_date,
        is_default: false,
      }
      payload.type = 'Core Points'
      payload.is_default = this.payload.is_default || false
      createChallenge(payload).then(response => {
        if (response.statusCode === 201) {
          makeToast(this.$bvToast, 'Challenge created successfully', 'success', 'success')
          this.$emit('updateList')
        } else {
          makeToast(this.$bvToast, response.message, 'Error', 'danger')
        }
      })
    },
    setEditData() {
      if (Object.keys(this.editData).length === 0) {
        this.challengeId = ''
        this.payload = {}
        this.range = ''
      } else {
        this.payload = this.editData
        this.challengeId = this.editData.id
        this.range = `${this.editData.start_date.split('T')[0]} to ${this.editData.end_date.split('T')[0]}`
      }
    },
    updateChallenge() {
      delete this.payload.id
      delete this.payload.slug_url
      delete this.payload._count
      delete this.payload.duration
      if (this.payload.logo === null) this.payload.logo = this.userInformation.avatar
      if (this.payload.cover_photo === null) this.payload.cover_photo = this.userInformation.companyBanner
      updateChallenge(this.payload, this.challengeId).then(response => {
        if (response.statusCode === 200) {
          makeToast(this.$bvToast, 'Challenge Updated successfully', 'success', 'success')
          this.$emit('updateList')
        } else {
          makeToast(this.$bvToast, response.message, 'Error', 'danger')
        }
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
  @include input(10px, $black, 14px, 400, 17px, #caa8f5, 5px);
}

.checkbox-padding {
  margin: 1rem 0;
}

.next-btn-pkg {
  @include button($white, $core-direction-base, $core-direction-base, 40px);
  padding: 10px 15px;
  width: 100px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}

.btn-active {
  background-color: $core-direction-base !important;
  border: 1px solid $core-direction-base !important;
}
</style>
