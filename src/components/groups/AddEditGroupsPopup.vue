<template>
  <Popup ref="AddEditGroupsPopup" :size="POPUP_SIZES.MEDIUM" :animation="POPUP_ANIMATIONS.FADE">
    <template v-slot:children>
      <div class="mx-20">
        <group-modal-header />
        <main id="main">
          <div id="business-profile">
            <group-modal-cover-photo
              :image-url="payload.preview_cover_photo"
              :is-edit="isEdit"
              :user-information="userInformation"
              :upload-image-url="payload.cover_photo"
              @onChangeCoverPhoto="changeCoverPhoto"
              @fileType="fileTypeCover"
            />
            <group-modal-logo
              :payload="payload"
              :is-edit="isEdit"
              :user-information="userInformation"
              :group_types_options="group_types_options"
              :upload-image-url="payload.logo"
              @onChangeCoverPhoto="changeGroupLogo"
              @fileType="fileTypeLogo"
            />
          </div>
          <div>
            <group-modal-activity-types :activities="payload.activities" />
          </div>
          <div class="d-flex justify-content-end my-16">
            <button
              class="btn-cancel"
              type="button"
              data-bs-dismiss="modal"
              @click="resetPayload"
            >
              Cancel
            </button>
            <b-button
              class="btn-create mr-0"
              data-bs-dismiss="modal"
              :class="{ 'btn-active': payload.name }"
              :disabled="!payload.name"
              @click="createGroup"
            >
              {{ isEdit ? 'Update' : 'Create' }} Group
            </b-button>
          </div>
        </main>
      </div>
    </template>
  </Popup>
</template>

<script>

import { BButton } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import GroupModalHeader from '@/components/groups/group-modal-header.vue'
import GroupModalCoverPhoto from '@/components/groups/group-modal-cover-photo.vue'
import GroupModalLogo from '@/components/groups/group-modal-logo.vue'
import GroupModalActivityTypes from '@/components/groups/group-modal-activity-types.vue'
import { uploadMedia } from '@/apiManager/media'
import { getGroupActivityTypes, addGroup, updateGroup } from '@/apiManager/groups'
import { Popup, POPUP_SIZES, POPUP_ANIMATIONS } from '@/components/Popup'
import makeToast from '@/constants/toast'

export default {
  name: 'AddEditGroupsPopup',
  components: {
    GroupModalActivityTypes,
    GroupModalLogo,
    GroupModalCoverPhoto,
    GroupModalHeader,
    BButton,
    Popup,
  },
  props: {
    editGroupPayload: {
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
      group_types_options: ['corporate'],
      groupId: null,
      payload: {
        privacy: false,
        group_type: 'corporate',
        name: '',
        cover_photo: '',
        preview_cover_photo: '',
        logo: '',
        preview_logo: '',
        activities: [],
      },
      mimeTypeLogo: [],
      mimeTypeCover: [],
      POPUP_SIZES,
      POPUP_ANIMATIONS,
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
    editGroupPayload: {
      handler() {
        this.setEditData()
      },
      deep: true,
    },
    isEdit: {
      handler(value) {
        if (!value) this.resetPayload()
      },
    },
  },
  destroyed() {
    this.resetPayload()
  },
  created() {
    this.getGroupActivities()
  },
  methods: {
    closePopup() {
      this.$refs.AddEditGroupsPopup.close()
    },
    async changeCoverPhoto(file) {
      this.payload.preview_cover_photo = file
      await this.uploadImage(file, 'cover_photo')
    },
    async changeGroupLogo(file) {
      this.payload.preview_logo = file
      await this.uploadImage(file, 'logo')
    },
    async uploadImage(base64Image, fileType) {
      const file = await this.convertUrlIntoFile(base64Image)
      await this.postMediaToS3Bucket(file, fileType)
    },
    fileTypeLogo(file) {
      this.mimeTypeLogo = []
      this.mimeTypeLogo.push(file)
    },
    fileTypeCover(file) {
      this.mimeTypeCover = []
      this.mimeTypeCover.push(file)
    },
    async convertUrlIntoFile(base64) {
      const res = await fetch(base64)
      const buf = await res.arrayBuffer()
      return new File([buf], this.generateRandomString(), { type: this.mimeTypeLogo[0] || this.mimeTypeCover[0] })
    },
    async postMediaToS3Bucket(media, fileType) {
      const formData = new FormData()
      formData.append('file', media)
      try {
        const response = await uploadMedia(formData)
        this.payload[fileType] = response.data.key
      } catch (error) {
        console.log(error)
      }
    },
    generateRandomString() {
      return Math.random()
        .toString(36)
        .substr(2, 10)
    },
    async createGroup() {
      if (!this.validateGroupData()) return false
      let data
      let message
      if (this.isEdit) {
        data = await updateGroup(this.getGroupPayload(), this.groupId)
        message = 'Group Updated successfully'
      } else {
        data = await addGroup(this.getGroupPayload())
        message = 'Group Created successfully'
      }
      if (data.statusCode === 201 || data.statusCode === 200) {
        makeToast(this.$bvToast, message, 'Success', 'success')
        this.$emit('updateList', data.data.group, this.isEdit)
        this.resetPayload()
      }
    },
    resetPayload() {
      this.groupId = null
      this.payload = {
        privacy: false,
        group_type: 'corporate',
        name: '',
        cover_photo: '',
        preview_cover_photo: '',
        logo: '',
        preview_logo: '',
        activities: this.payload.activities.map(activity => ({
          ...activity,
          isSelected: false,
          image: `${process.env.VUE_APP_ASSETS_PREFIX}activity/${activity.imageName}`,
        })),
      }
      this.closePopup()
    },
    async setEditData() {
      if (this.isEdit) {
        const { data } = await getGroupActivityTypes()
        const activities = data.map(activity => ({
          ...activity,
          isSelected: false,
          image: `${process.env.VUE_APP_ASSETS_PREFIX}activity/${activity.imageName}`,
        }))
        this.editGroupPayload.group_activity_types.forEach(selectedActivity => {
          const matchingActivity = activities.find(activity => activity.name === selectedActivity.activity_type.name)
          if (matchingActivity) {
            matchingActivity.isSelected = true
          }
        })
        this.groupId = this.editGroupPayload.id
        this.payload.activities = activities
        this.payload.name = this.editGroupPayload.name
        this.payload.cover_photo = this.editGroupPayload.cover_photo
        this.payload.logo = this.editGroupPayload.logo
        this.payload.privacy = this.editGroupPayload.privacy
      }
    },
    getGroupPayload() {
      const {
        activities,
        group_type,
        logo,
        name,
        privacy,
      } = this.payload
      const activityTypeIds = activities
        .filter(activity => activity.isSelected)
        .map(activity => activity.id)
      const coverPhoto = this.payload.cover_photo || this.userInformation.companyBanner
      return {
        name,
        cover_photo: coverPhoto,
        group_type,
        logo,
        privacy: privacy ? 'private' : 'public',
        activity_type_ids: activityTypeIds,
      }
    },
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
    validateGroupData() {
      if (!this.payload.name) {
        makeToast(this.$bvToast, 'Group Name is required.', 'danger', 'danger')
        return false
      }
      return true
    },
  },
}

</script>

<style lang="scss">
@import "@/@core/mixins/ui/_input.scss";
@import "@/@core/mixins/ui/_button.scss";
@import "@/@core/scss/base/core/colors/palette-variables.scss";

.group-name {
  width: 100%;
  @include input(10px, $black, 14px, 400, 17px, #CAA8F5, 5px);
}

.date-text {
  font-weight: 500;
  font-size: 12px;
  line-height: 13px;
  color: black;
  margin-left: 5px;
}

.group-header {
  display: flex;
  justify-content: center;
  align-items: baseline;
  height: 45px;
}

.group-pencil {
  width: 35px;
  height: 35px;
}

.btn-cancel {
  @include button($black, $white, none, 40px);
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.25);
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}

.btn-create {
  @include button($white, $core-direction-base, $core-direction-base, 40px);
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  margin: 0 15px;
}

.updated-text {
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
}

/*Active and Inactive Text*/
.activeText {
  color: #690fad;
  font-weight: 700;
  font-size: 12px;
  line-height: 13px;
}

.acceptedText {
  color: #caa8f5 !important;
}

.inviteText {
  color: rgba(6, 7, 14, 0.25);
}

.state-1:hover {
  background: linear-gradient(
          89.25deg,
          #7812c6 15.18%,
          rgba(93, 13, 153, 0.65) 100%
  );
}

.leader-board, .hide-content, .hide-content-table {
  display: none;
}

.manage-challenge, .banner_container {
  display: block;
}

#leaderBoard-challenge {
  display: none;
}

/*LeaderBoard BreadCrumbs CSS*/
#leaderBoard-challenge ul.breadcrumb li {
  display: inline;
  font-size: 18px;
}

#leaderBoard-challenge ul.breadcrumb li + li:before {
  padding: 8px;
  color: black;
  content: "/\00a0";
}

/*Check Mark Label*/
.container {
  display: block;
  position: relative;
  margin-bottom: 19px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 17px;
  width: 17px;
  border: 1px solid white;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: block;
}

.container input:checked ~ .checkmark:after {
  display: block;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 11px;
  border: 1px solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.container .checkmark:after {
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid transparent;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.container input:checked ~ .checkmark {
  background-color: transparent;

}

/*Check Mark Label*/

.container_1 {
  display: block;
  position: relative;
  margin-bottom: 19px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container_1 input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark_1 {
  position: absolute;
  top: 0;
  left: 0;
  height: 17px;
  width: 17px;
  border: 1px solid #690fad;
}

.checkmark_1:after {
  content: "";
  position: absolute;
  display: block;
}

.container_1 input:checked ~ .checkmark_1:after {
  display: block;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 11px;
  border: solid #690fad;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.container_1 .checkmark_1:after {
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid transparent;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.container_1 input:checked ~ .checkmark_1 {
  background-color: transparent;

}

/*copy Text Tooltip*/

.copyTooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.copyTooltip .CopyTexttooltipText {
  visibility: hidden;
  width: 150px;
  background-color: #373D3F;
  color: #fff;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  top: -15px;
  left: 110%;
  text-align: left;
  padding: 10px;
}

.copyTooltip .CopyTexttooltipText::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent #373D3F transparent transparent;
}

.copyTooltip:hover .CopyTexttooltipText {
  visibility: visible;
}

.text-color {
  color: #690fad;
}

/*modal css*/

.section-body {
  margin: 20px 0 10px 0;
}

.section-body .swiper-container {
  overflow-x: hidden;
  margin-right: -1rem;
}

@media screen and (min-width: 1300px) {
  .section-body .swiper-container {
    margin-right: -100px;
    width: calc(100% + 100px);
  }
}

@media (min-width: 1240px) and (max-width: 1400px) {
  .section-body .swiper-container {
    overflow-x: visible;
  }
}

.section-body .swiper-container .swiper-wrapper .swiper-slide {
  max-width: -webkit-max-content;
  max-width: -moz-max-content;
  max-width: max-content;
  max-height: -webkit-max-content;
  max-height: -moz-max-content;
  max-height: max-content;
}

.section-body .swiper-pagination-bullet {
  width: 10px;
  height: 8px;
  border-radius: 23px;
  -webkit-border-radius: 23px;
  -moz-border-radius: 23px;
  -ms-border-radius: 23px;
  -o-border-radius: 23px;
  background: #757575;
  margin-left: 2.5px;
  margin-right: 2.5px;
}

.section-body .swiper-pagination-bullet-active {
  width: 28px;
  background: #690FAD;
}

.section-body .card {
  width: 340px;
  height: 338px;
}

@media screen and (max-width: 991px) {
  .section-body .card {
    width: 290px;
  }
}

.section-body .card .card-body {
  height: 338px;
}

.section-body .card .card-body .carf-info-box {
  height: 156px;
}

.section-body .sm-card {
  width: 324px;
}

@media screen and (max-width: 991px) {
  .section-body .sm-card {
    width: 290px;
  }
}

.section-body .friend-img-box {
  width: 88px;
  height: 88px;
  border-radius: 171px;
  -webkit-border-radius: 171px;
  -moz-border-radius: 171px;
  -ms-border-radius: 171px;
  -o-border-radius: 171px;
  overflow: hidden;
}

.section-body .friend-img-box img {
  width: 88px;
  height: 88px;
}

.section-body .our-partners-logo-box {
  width: 112px;
  height: 108.85px;
  border-radius: 9px;
  -webkit-border-radius: 9px;
  -moz-border-radius: 9px;
  -ms-border-radius: 9px;
  -o-border-radius: 9px;
  overflow: hidden;
}

.section-body .our-partners-logo-box img {
  width: 112px;
  height: 108.85px;
}

.section-body .booking-card {
  width: 361px;
  margin-right: 30px;
  margin-bottom: 56px;
}

@media screen and (max-width: 991px) {
  .section-body .booking-card {
    width: 305px;
    margin-right: 15px;
  }
}

.section-body .booking-card .booking-card-header {
  padding-bottom: 18px;
  margin-bottom: 15.51px;
}

@media screen and (max-width: 991px) {
  .section-body .booking-card .booking-card-header {
    padding-bottom: 21px;
    margin-bottom: 9.5px;
  }
}

.section-body .booking-history-card {
  width: 332px;
  margin-right: 18px;
  margin-bottom: 80px;
}

@media screen and (max-width: 991px) {
  .section-body .booking-history-card {
    width: 304px;
    margin-right: 15px;
  }
}

.btn-filter {
  width: 106.48px;
  height: 97px;
  padding: 14px;
  background: #FFFFFF;
  -webkit-box-shadow: 0px 22px 40px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 22px 40px rgba(0, 0, 0, 0.1);
  border-radius: 11px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.btn-filter .btn-filter-icon-box svg,
.btn-filter .btn-filter-icon-box img {
  max-width: 38px;
  margin-left: auto;
}

.btn-filter .btn-filter-icon-box svg,
.btn-filter .btn-filter-icon-box path {
  fill: #000000;
}

.btn-filter .btn-filter-content-box {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 14.06px;
  text-align: left;
}

.btn-filter:hover {
  background: #690FAD;
}

.btn-filter:hover .btn-filter-icon-box svg,
.btn-filter:hover .btn-filter-icon-box path {
  fill: #FFFFFF;
}

.btn-filter:hover .btn-filter-content-box {
  color: #FFFFFF;
}

.btn-filter-activity-type {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  width: 104px;
  height: 115.69px;
  padding: 17px 15px;
  background: #FFFFFF;
  -webkit-box-shadow: 0 0.762172px 3.04869px rgb(0 0 0 / 25%);
  box-shadow: 0 0.762172px 3.04869px rgb(0 0 0 / 25%);
  border-radius: 11px;
}

.btn-filter-activity-type .btn-filter-activity-type-icon-box svg,
.btn-filter-activity-type .btn-filter-activity-type-icon-box img {
  margin-bottom: 14px;
  max-height: 44px;
}

.btn-filter-activity-type .btn-filter-activity-type-icon-box svg,
.btn-filter-activity-type .btn-filter-activity-type-icon-box path {
  fill: #000000;
}

.btn-filter-activity-type .btn-filter-activity-type-content-box {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 14.06px;
  text-align: left;
}

.btn-filter.active,
.btn-filter-activity-type.active {
  background: #690FAD;
}

.btn-filter.active .btn-filter-icon-box svg,
.btn-filter.active .btn-filter-icon-box path,
.btn-filter.active .btn-filter-activity-type-icon-box svg,
.btn-filter.active .btn-filter-activity-type-icon-box path,
.btn-filter-activity-type.active .btn-filter-icon-box svg,
.btn-filter-activity-type.active .btn-filter-icon-box path,
.btn-filter-activity-type.active .btn-filter-activity-type-icon-box svg,
.btn-filter-activity-type.active .btn-filter-activity-type-icon-box path {
  fill: #FFFFFF;
}

.btn-filter.active .btn-filter-content-box,
.btn-filter.active .btn-filter-activity-type-content-box,
.btn-filter-activity-type.active .btn-filter-content-box,
.btn-filter-activity-type.active .btn-filter-activity-type-content-box {
  color: #FFFFFF;
}

.filter-by-item-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 127px;
  height: 113.69px;
  margin-right: 20px;
  padding: 20px;
  border-radius: 11px;
  -webkit-border-radius: 11px;
  -moz-border-radius: 11px;
  -ms-border-radius: 11px;
  -o-border-radius: 11px;
  background-color: #000000;
}

.filter-by-item-box svg {
  min-width: 48px;
}

.filter-by-item-box svg,
.filter-by-item-box path {
  fill: #ffffff;
}

.filter-by-item-box p {
  margin-top: 9px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 14.06px;
  color: #ffffff;
}

.filter-by-item-box:hover {
  background-color: #690FAD;
  cursor: pointer;
}

.filter-by-item-box:hover svg,
.filter-by-item-box:hover path {
  fill: black;
}

.filter-by-item-box:hover p {
  color: #000000;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 14.06px;
}

.swiper-container {
  overflow-x: hidden;
}

#header {
  min-height: 70px;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #690FAD;
  -webkit-box-shadow: 0px 22px 40px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 22px 40px rgba(0, 0, 0, 0.1);
}

#header .navbar-brand {
  float: left;
}

#header .navbar-brand .navbar-brand-logo {
  max-width: 200px;
}

@media screen and (max-width: 991px) {
  #header .navbar-brand .navbar-brand-logo {
    max-width: 150px;
  }
}

@media (max-width: 991px) {
  #header .navbar {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;
  }
}

@media (min-width: 992px) {
  #header .nav-list {
    -webkit-column-gap: 33px;
    column-gap: 33px;
    margin-left: 33px;
    margin-right: 75px;
  }
}

#header .btn-dropdown {
  position: relative;
}

@media (max-width: 991px) {
  #header .btn-dropdown {
    margin-left: 15px;
  }
}

@media (max-width: 991px) {
  #header .btn-dropdown .content-box {
    display: none;
  }
}

#header .btn-dropdown .content-box svg {
  margin-left: 5px;
}

@media (min-width: 992px) {
  #header .btn-dropdown .icon-box {
    display: none;
  }
}

#header .dropdown-menu {
  display: none;
  position: absolute;
  background-color: #690FAD;
  -webkit-box-shadow: 0px 22px 40px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 22px 40px rgba(0, 0, 0, 0.1);
  border-radius: 0px 0px 11px 11px;
  z-index: 999;
}

@media (min-width: 992px) {
  #header .dropdown-menu {
    left: 0;
    padding: 10px 21px 16px;
    width: 300px;
    top: 70px;
  }
}

@media (max-width: 991px) {
  #header .dropdown-menu {
    right: 0;
    padding: 0px 16px 16px;
    width: 207px;
    top: 45px;
  }
}

#header .dropdown-menu-link {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 10px;
}

#header .dropdown-menu-link {
  width: 100%;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: #FFFFFF;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F2F5EA;
}

#header .btn-dropdown.active .dropdown-menu {
  display: block;
}

#header .nav-link {
  position: relative;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #FFFFFF;
  padding: 24px 2px 25px;
}

#header .nav-link:hover::after {
  position: absolute;
  content: "";
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 4px;
  background: #690FAD;
  border-radius: 3px 3px 0px 0px;
}

@media (min-width: 992px) {
  #header .nav-link:hover::after {
    background: #F2F5EA;
  }
}

@media (min-width: 992px) {
  #header .nav-link .svg {
    display: none;
  }
}

#header .nav-link.active::after {
  position: absolute;
  content: "";
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 4px;
  background: #690FAD;
  border-radius: 3px 3px 0px 0px;
}

@media (min-width: 992px) {
  #header .nav-link.active::after {
    background: #F2F5EA;
  }
}

#header .btn-signup {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 21px;
  color: #690FAD;
  background-color: #FFFFFF;
  margin-left: 21px;
  padding: 7px 19px 8px;
}

@media screen and (max-width: 991px) {
  #header .btn-signup {
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    margin-left: 15px;
    padding: 7px 15px 6px;
  }
}

@media (max-width: 991px) {
  #header .navbar-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    background-color: #FFFFFA;
    -webkit-box-shadow: 0px -22px 40px rgba(0, 0, 0, 0.1);
    box-shadow: 0px -22px 40px rgba(0, 0, 0, 0.1);
  }

  #header .navbar-nav .nav-list {
    overflow-x: auto;
    scrollbar-width: 0;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  #header .navbar-nav .nav-link {
    color: #000000;
  }

  #header .navbar-nav .nav-link svg {
    margin-right: 13px;
  }
}

#header .btn-signin {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: right;
  color: #FFFFFF;
}

@media (max-width: 991px) {
  #header .btn-signin {
    font-size: 14px;
    font-weight: 600;
    line-height: 17px;
  }
}

#app-header {
  background-color: #FFFFFF;
  box-shadow: 0px 22px 40px 0px #0000001A;
}

#app-header .custom-container {
  position: relative;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

@media (max-width: 767px) {
  #app-header .custom-container {
    height: 50px;
  }
}

@media (min-width: 768px) {
  #app-header .custom-container {
    height: 60px;
  }
}

@media (max-width: 767px) {
  #app-header .brand {
    margin-right: auto;
  }
}

#app-header .brand img {
  width: 100%;
}

@media (max-width: 767px) {
  #app-header .brand img {
    max-width: 158px;
    margin-right: auto;
  }
}

@media (max-width: 500px) {
  #app-header .brand img {
    max-width: 137px;
    margin-right: auto;
  }
}

@media (min-width: 768px) {
  #app-header .brand img {
    max-width: 158px;
  }
}

@media (min-width: 992px) {
  #app-header .brand img {
    max-width: 200px;
  }
}

@media (max-width: 767px) {
  #app-header .navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    overflow-x: auto;
    box-shadow: 0px -22px 40px 0px #0000001a;
    padding: 5px;
    background: #FFFFFF;
    z-index: 999;
  }

  #app-header .navbar .nav {
    justify-content: space-evenly;
  }
}

@media (min-width: 768px) {
  #app-header .navbar {
    padding-left: 10px;
    padding-right: 10px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: 1024px) {
  #app-header .navbar {
    padding-left: 15px;
    padding-right: 15px;
    margin-left: auto;
    margin-right: auto;
  }
}

#app-header .nav {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

#app-header .nav .nav-link {
  width: 69px;
  height: 59px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid transparent;
  transition: .3s ease-in-out;
}

@media (min-width: 768px) {
  #app-header .nav .nav-link {
    margin-left: 5px;
    margin-right: 5px;
  }
}

@media (min-width: 1024px) {
  #app-header .nav .nav-link {
    margin-left: 13px;
    margin-right: 13px;
  }
}

#app-header .nav .nav-link:hover {
  border-color: #690FAD;
}

#app-header .nav .nav-link.active {
  border-color: #690FAD;
}

#app-header .search-box {
  min-width: 36px;
  width: 100%;
  height: 36px;
  max-width: 226px;
  position: relative;
}

#app-header .search-box .search-bar {
  width: 100%;
  height: 36px;
  border-radius: 30px;
  border: 1px solid #06070E40;
  padding: 12px 36px 10px 15px;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: left;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}

#app-header .search-box .search-bar:active, #app-header .search-box .search-bar:focus-visible, #app-header .search-box .search-bar:focus {
  border-color: #690FAD;
  transition: .3s ease-in-out;
}

@media (min-width: 992px) {
  #app-header .search-box .search-bar:active, #app-header .search-box .search-bar:focus-visible, #app-header .search-box .search-bar:focus {
    width: 317px;
    margin-left: -91px;
  }
}

#app-header .search-box .search-bar::-webkit-input-placeholder {
  color: #06070E40;
}

#app-header .search-box .search-bar:-ms-input-placeholder {
  color: #06070E40;
}

#app-header .search-box .search-bar::-ms-input-placeholder {
  color: #06070E40;
}

#app-header .search-box .search-bar::placeholder {
  color: #06070E40;
}

#app-header .search-box .search-icon {
  position: absolute;
  top: 18px;
  right: 41px;
}

@media (max-width: 991px) {
  #app-header .search-box {
    display: none;
  }

  #app-header .search-box .search-bar {
    height: 43px;
  }
}

@media (max-width: 991px) {
  #app-header .search-box.active {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 75px;
    z-index: 99;
    max-width: calc(380px - 30px);
    padding-left: 15px;
    padding-right: 15px;
  }

  #app-header .search-box.active .search-inner-box {
    width: calc(100vw - 30px) !important;
    max-width: 343px;
    margin: auto;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }

  #app-header .search-box.active .search-bar {
    padding: 14px 61px 14px 16px;
  }

  #app-header .search-box.active .search-bar::-webkit-input-placeholder {
    color: #06070E40;
  }

  #app-header .search-box.active .search-bar:-ms-input-placeholder {
    color: #06070E40;
  }

  #app-header .search-box.active .search-bar::-ms-input-placeholder {
    color: #06070E40;
  }

  #app-header .search-box.active .search-bar::placeholder {
    color: #06070E40;
  }

  #app-header .search-box.active .search-icon {
    top: 14.5px;
    right: 14.5px;
  }
}

@media (min-width: 992px) {
  #app-header .sm-btn-search {
    display: none;
  }
}

@media (max-width: 991px) {
  #app-header .sm-btn-search .btn-search-close,
  #app-header .sm-btn-search .btn-search {
    display: none;
    min-width: 36px;
    min-height: 36px;
    max-width: 36px;
    max-height: 36px;
  }

  #app-header .sm-btn-search .show {
    display: block;
  }
}

#app-header .header-nav-item {
  min-width: 36px;
  max-width: 36px;
  min-height: 36px;
  max-height: 36px;
}

#app-header .header-nav-list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}

#app-header .header-nav-list .header-nav-link {
  min-width: 36px;
  max-width: 36px;
  min-height: 36px;
  max-height: 36px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 30px;
  padding: 0;
}

#app-header .header-nav-list .notification {
  margin-left: 20px;
}

@media (min-width: 992px) {
  #app-header .header-nav-list .notification {
    margin-left: 42px;
  }
}

@media (min-width: 1024px) {
  #app-header .header-nav-list .notification {
    margin-left: 44px;
  }
}

#app-header .header-nav-list .btn-notification {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 4px 0px #00000040;
}

#app-header .header-nav-list .btn-notification img {
  width: 16px;
  height: 20px;
}

#app-header .header-nav-list .notification-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -1px;
  right: -1px;
  width: 13px;
  height: 13px;
  background-color: #690FAD;
  color: #FFFFFF;
  border-radius: 30px;
  font-family: 'Roboto', sans-serif;
  font-size: 8px;
  font-style: normal;
  font-weight: 500;
  line-height: 9px;
  letter-spacing: 0em;
  text-align: center;
}

@media (max-width: 991px) {
  #app-header .header-nav-list .qr-code {
    margin-left: 10px;
    margin-right: 10px;
  }
}

@media (min-width: 992px) {
  #app-header .header-nav-list .qr-code {
    margin-left: 19px;
    margin-right: 19px;
  }
}

#app-header .header-nav-list .btn-qr-code {
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 4px 0px #00000040;
}

#app-header .header-nav-list .btn-qr-code img {
  width: 20px;
  height: 20px;
}

#app-header .header-nav-list .btn-user-profile img {
  min-width: 36px;
  min-height: 36px;
  max-width: 36px;
  max-height: 36px;
}

#app-header .user-profile {
  position: relative;
}

#app-header .profile-menu-box {
  display: none;
  position: absolute;
  right: -10px;
  top: 53px;
  background-color: #FFFFFF;
  box-shadow: 0px 22px 40px 0px #0000001A;
  border-radius: 11px;
  padding: 30px;
  z-index: 9;
  width: 320px;
}

#app-header .profile-menu-box .profile-menu-list {
  padding: 0;
}

#app-header .profile-menu-box .profile-menu-header {
  display: flex;
  align-items: flex-start;
  padding-bottom: 15px;
  border-bottom: 2px solid #06070E;
  margin-bottom: 19px;
}

#app-header .profile-menu-box .profile-img-box {
  margin-right: 10px;
}

#app-header .profile-menu-box .profile-img {
  min-width: 47px;
  min-height: 48px;
  max-width: 47px;
  max-height: 48px;
  border-radius: 50%;
}

#app-header .profile-menu-box .user-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 2px;
}

#app-header .profile-menu-box .user-email {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: left;
}

#app-header .profile-menu-box .profile-menu-link {
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  padding: 12px;
  margin-bottom: 7px;
}

#app-header .profile-menu-box .profile-menu-link img,
#app-header .profile-menu-box .profile-menu-link svg {
  width: fit-content;
}

#app-header .profile-menu-box .profile-menu-link:hover {
  color: #690FAD;
}

#app-header .profile-menu-box .profile-menu-link:hover img,
#app-header .profile-menu-box .profile-menu-link:hover svg {
  fill: #690FAD;
  filter: invert(12%) sepia(83%) saturate(5049%) hue-rotate(274deg) brightness(81%) contrast(104%);
}

#app-header .profile-menu-box .profie-menu-name {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  margin-left: 15px;
}

#app-header .profile-menu-box.show {
  display: block;
}

#app-header .notification-box {
  position: absolute;
  width: 100%;
  max-width: 410px;
  right: 0px;
  top: 65px;
  padding: 0 10px 15px;
  z-index: 3;
  display: none;
}

@media (max-width: 767px) {
  #app-header .notification-box {
    top: 55px;
  }
}

#app-header .notification-box.show {
  display: block;
}

#app-header .notification-inner-box {
  width: 100%;
  background: #FFFFFF;
  border-bottom: 1px solid #000000;
  box-shadow: 0px 22px 40px rgba(0, 0, 0, 0.25);
  border-radius: 11px;
}

#app-header .notification-header {
  padding: 9px 10px;
  border-bottom: 1px solid #CAA8F5;
}

#app-header .notification-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
}

#app-header .notification-update {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: right;
  color: #690FAD;
}

#app-header .notification-body {
  padding: 10px;
  max-height: 468px;
  overflow-y: auto;
}

#app-header .notification-body::-webkit-scrollbar {
  width: 7px;
}

#app-header .notification-body::-webkit-scrollbar-track {
  background: #F1F1F1;
  border-radius: 11px;
}

#app-header .notification-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.45);
  border-radius: 11px;
}

#app-header .notification-card {
  background: #FFFFFF;
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 14px 22px;
  margin-bottom: 10px;
}

@media (max-width: 767px) {
  #app-header .notification-card {
    padding-left: 15px;
    padding-right: 15px;
    flex-direction: column;
    column-gap: 10px;
    row-gap: 10px;
  }
}

#app-header .img-box {
  width: 100%;
  max-width: 50px;
  position: relative;
  margin-right: 15px;
}

#app-header .activity-img-box {
  background: #F2F5EA;
  border: 1.5px solid #690FAD;
  border-radius: 50%;
  padding: 7px;
}

#app-header .notification-img {
  width: 100%;
  border-radius: 50%;
}

#app-header .notification-icon {
  min-width: 20px;
  min-height: 20px;
  max-width: 20px;
  max-height: 20px;
  position: absolute;
  right: -5px;
  bottom: -3px;
}

#app-header .notification-card-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: left;
  margin-bottom: 5px;
}

#app-header .notification-card-desc {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 16px;
}

#app-header .notification-card-desc strong {
  font-weight: 700;
}

#app-header .notification-btn-box {
  flex-wrap: wrap;
  column-gap: 10px;
  row-gap: 10px;
}

#app-header .btn-group {
  cursor: pointer;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: center;
}

#app-header .btn-visit-group {
  padding: 8px 16px;
  color: #F2F5EA;
  background-color: #690FAD;
}

#app-header .btn-leave-group {
  padding: 8px 16px;
  color: #690FAD;
  background-color: #F2F5EA;
}

#app-header .btn-view-detail {
  padding: 8px 35px;
  color: #F2F5EA;
  background-color: #690FAD;
}

#app-header .btn-accept-group {
  padding: 8px 20px;
  color: #F2F5EA;
  background-color: #690FAD;
}

#app-header .btn-decline-group {
  padding: 8px 20px;
  color: #690FAD;
  background-color: #F2F5EA;
}

#app-header .notification-footer {
  padding: 15px 10px 16px;
  text-align: center;
}

#app-header .btn-all-notificatioon {
  padding: 8px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: center;
  color: #690FAD;
}

#filter {
  position: relative;
  margin-bottom: 60px;
}

@media screen and (max-width: 991px) {
  #filter .filter-box {
    padding: 29px 16px calc(30px - 1rem) 19px;
    flex-wrap: wrap;
  }
}

#filter .filter-box .input-field-search-box,
#filter .filter-box .input-field-category-box {
  width: 100%;
}

@media screen and (max-width: 991px) {
  #filter .filter-box .input-field-search-box,
  #filter .filter-box .input-field-category-box {
    margin-bottom: 1rem;
  }
}

#filter .filter-box .input-field-search-box input,
#filter .filter-box .input-field-search-box select,
#filter .filter-box .input-field-category-box input,
#filter .filter-box .input-field-category-box select {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 18.5px;
  font-weight: 400;
  width: 100%;
  padding: 11px 28px 12px 18px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  background-color: white;
  color: black;
  outline: none;
}

#filter .filter-box .input-field-search-box {
  max-width: 641px;
  position: relative;
}

@media screen and (max-width: 991px) {
  #filter .filter-box .input-field-search-box {
    max-width: 100%;
    margin-right: 0;
  }
}

#filter .filter-box .input-field-search-box svg {
  position: absolute;
  right: 13px;
  top: 13px;
  cursor: pointer;
}

#filter .filter-box .input-field-search-box .manual-location-field-box {
  display: none;
  position: absolute;
  width: 100%;
  top: 0;
  box-shadow: 0px 4px 4px rgba(18, 18, 18, 0.25);
  border-radius: 20px 20px 0 0;
  z-index: 2;
  background-color: #FFFFFF;
}

#filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-header input {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  font-style: italic;
  border-radius: 20px 20px 0 0;
}

#filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-header button {
  position: absolute;
}

#filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body {
  padding: 22px 8px;
  margin-left: 10px;
  margin-right: 10px;
  border-top: 1px solid #222222;
}

#filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body .location-list .location-item {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 18.75px;
  margin-bottom: 19px;
  cursor: pointer;
}

#filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body .location-list .location-item:last-child {
  margin-bottom: 0;
}

#filter .filter-box .input-field-category-box {
  max-width: 226px;
  position: relative;
}

@media screen and (max-width: 991px) {
  #filter .filter-box .input-field-category-box {
    max-width: 100%;
    margin-right: 0;
  }
}

#filter .filter-box .input-field-category-box select {
  appearance: none;
}

#filter .filter-box .input-field-category-box svg {
  position: absolute;
  right: 13px;
  top: 17px;
  cursor: pointer;
}

#filter .filter-box .input-field-category-box .svg-category-icon.active {
  transform: rotate(180deg);
}

#filter .filter-box .input-field-category-box .category-field-box {
  display: none;
  position: absolute;
  width: 100%;
  top: 0;
  box-shadow: 0px 4px 4px rgba(18, 18, 18, 0.25);
  border-radius: 20px 20px 0 0;
  z-index: 2;
  background-color: #FFFFFF;
}

@media screen and (max-width: 991px) {
  #filter .filter-box .input-field-category-box .category-field-box {
    width: 100%;
    top: 2.9rem;
    border-radius: 0px;
  }
}

@media screen and (max-width: 991px) {
  #filter .filter-box .input-field-category-box .category-field-box .category-field-header {
    display: none;
  }
}

#filter .filter-box .input-field-category-box .category-field-box .category-field-header select {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  font-style: italic;
  border-radius: 20px 20px 0 0;
}

#filter .filter-box .input-field-category-box .category-field-box .category-field-header button {
  position: absolute;
}

#filter .filter-box .input-field-category-box .category-field-box .category-field-body {
  padding: 22px 8px;
  margin-left: 10px;
  margin-right: 10px;
  border-top: 1px solid #222222;
}

@media screen and (max-width: 991px) {
  #filter .filter-box .input-field-category-box .category-field-box .category-field-body {
    border-top: none;
  }
}

#filter .filter-box .input-field-category-box .category-field-box .category-field-body .category-list .category-item {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 18.75px;
  margin-bottom: 19px;
  cursor: pointer;
}

#filter .filter-box .input-field-category-box .category-field-box .category-field-body .category-list .category-item:last-child {
  margin-bottom: 0px;
}

#filter .filter-box .search-btn-box {
  max-width: 123px;
  width: 100%;
}

@media screen and (max-width: 991px) {
  #filter .filter-box .search-btn-box {
    max-width: 100%;
    margin-left: auto;
  }
}

#filter .filter-box .search-btn-box button {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 18.5px;
  font-weight: 500;
  width: 100%;
  padding: 11px 13px;
  color: #FFFFFF;
  background-color: #690FAD;
}

#business-profile .business-profile-header .business-profile-banner-box,
#business-profile .business-profile-header .business-profile-map-box {
  width: 100%;
  border-radius: 0 0 7px 7px;
  height: 331px;
  overflow: hidden;
}

#business-profile .business-profile-header .business-profile-banner-box .group-bg,
#business-profile .business-profile-header .business-profile-map-box img {
  width: 100%;
  border-radius: 0 0 7px 7px;
  height: 331px;
  object-fit: cover;
  object-position: center;
}

@media screen and (max-width: 767px) {
  #business-profile .business-profile-header .business-profile-banner-box,
  #business-profile .business-profile-header .business-profile-map-box {
    height: 109px;
  }

  #business-profile .business-profile-header .business-profile-banner-box .group-bg,
  #business-profile .business-profile-header .business-profile-map-box img {
    height: 109px;
  }
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-header .business-profile-map-box {
    display: none;
  }
}

#business-profile .business-profile-info-box {
  margin-top: -8px;
  padding-bottom: 23px;
}

#business-profile .business-profile-info-box .business-profile-short-info-box {
  padding-bottom: 15px;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-info-box .business-profile-short-info-box {
    padding-bottom: 30px;
  }
}

#business-profile .business-profile-info-box .business-profile-logo-box {
  margin-right: 9px;
  padding: 3px;
  outline: 3px solid #fff;
}

#business-profile .business-profile-info-box .business-profile-logo-box .group-bg {
  min-width: 110px;
  max-width: 110px;
  min-height: 110px;
  max-height: 110px;
  outline: 4px solid #690FAD;
  border: 3px solid #FFFFFF;
  background: #CAA8F5;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-info-box .business-profile-logo-box .group-bg {
    min-width: 75px;
    max-width: 75px;
    min-height: 75px;
    max-height: 75px;
  }
}

#business-profile .business-profile-info-box .business-profile-name-box .business-profile-brand-title {
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 25px;
  margin-bottom: 4px;
  width: 100%;
  max-width: 349px;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-info-box .business-profile-name-box .business-profile-brand-title {
    font-size: 18px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 0;
  }
}

#business-profile .business-profile-info-box .business-profile-name-box .business-profile-brand-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 17.07px;
  width: 100%;
  max-width: 349px;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-info-box .business-profile-name-box .business-profile-brand-subtitle {
    font-size: 12px;
  }
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-info-box .business-profile-contact-info-box {
    flex-wrap: wrap;
    column-gap: 12px;
    row-gap: 12px;
  }

  #business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-number,
  #business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-map,
  #business-profile .business-profile-info-box .business-profile-contact-info-box .btn-business-map {
    margin: 0px !important;
  }

  #business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-number,
  #business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-map {
    font-size: 10px !important;
    line-height: 12px !important;
  }

  #business-profile .business-profile-info-box .business-profile-contact-info-box .btn-business-map svg {
    max-width: 40px;
    max-height: 40px;
  }
}

#business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-number,
#business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-map {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 14.63px;
}

#business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-number {
  padding: 13px 16px;
  background-color: #FFFFFF;
  margin-right: 15px;
  -webkit-box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

#business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-number svg,
#business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-number img {
  margin-right: 7.1px;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-number {
    padding: 10px 16px 10px 14px;
  }
}

#business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-map {
  padding: 16px 27px;
  color: #F1F1F1;
  background-color: #690FAD;
  margin-right: 14px;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-info-box .business-profile-contact-info-box .btn-brand-map {
    padding: 13px 22px 15px;
  }
}

#business-profile .tab-container {
  border-top: 1px solid #F1F1F1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.27);
  margin-bottom: 60px;
  margin-top: -80px;
}

#business-profile .business-profile-menu-tab-swiper-container {
  max-width: 800px;
}

@media screen and (min-width: 992px) {
  #business-profile .business-profile-menu-tab-swiper-container {
    justify-content: space-between;
  }
}

#business-profile .business-profile-menu-tab-item {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 17.07px;
  margin-right: 15px;
  background-color: #FFFFFF;
  color: #000000;
  padding: 13.28px 29.13px 14.01px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  height: 48px;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-menu-tab-item {
    padding: 13.28px 18.13px 14.01px;
  }
}

#business-profile .business-profile-menu-tab-item svg,
#business-profile .business-profile-menu-tab-item img {
  margin-right: 4.8px;
}

#business-profile .business-profile-menu-tab-item svg,
#business-profile .business-profile-menu-tab-item path {
  fill: #000000;
}

#business-profile .business-profile-menu-tab-item:hover {
  border-color: #690FAD;
  color: #690FAD;
}

#business-profile .business-profile-menu-tab-item:hover svg,
#business-profile .business-profile-menu-tab-item:hover path {
  fill: #690FAD;
}

#business-profile .active {
  border-color: #690FAD;
  color: #690FAD;
}

#business-profile .active svg,
#business-profile .active path {
  fill: #690FAD;
}

#business-profile .business-profile-gallery-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(183px, 183px));
  column-gap: 15px;
  row-gap: 15px;
  justify-content: center;
  padding-bottom: 102px;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-gallery-list {
    grid-template-columns: repeat(auto-fill, minmax(172px, 172px));
    column-gap: 14px;
    row-gap: 14px;
  }
}

#business-profile .business-profile-gallery-list .business-profile-gallery-item img {
  border-radius: 11px;
}

#business-profile .business-profile-info-box .business-profile-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 21.94px;
}

#business-profile .business-profile-info-box .business-profile-about-us-box {
  margin-bottom: 35px;
}

#business-profile .business-profile-info-box .business-profile-about-us-box .business-profile-title {
  margin-bottom: 24px;
}

#business-profile .business-profile-info-box .business-profile-about-us-box .business-profile-about-us-desc {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 5px;
}

#business-profile .business-profile-info-box .what-offer-list {
  margin-bottom: 26px;
  margin-top: 21px;
}

#business-profile .business-profile-info-box .what-offer-item {
  width: 144px;
  height: 45px;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 14.06px;
  background-color: #690FAD;
  color: #F1F1F1;
  padding: 14px 20px;
  cursor: pointer;
  margin-right: 11px;
  margin-bottom: 11px;
}

#business-profile .business-profile-info-box .what-offer-item svg,
#business-profile .business-profile-info-box .what-offer-item img {
  min-width: 17px;
  max-width: 18px;
  margin-right: 18px;
}

#business-profile .business-profile-info-box .business-profile-address-box {
  margin-bottom: 84px;
}

@media screen and (min-width: 992px) {
  #business-profile .business-profile-info-box .business-profile-address-box {
    margin-bottom: 63px;
  }
}

#business-profile .business-profile-info-box .btn-business-address {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  background-color: #FFFFFF;
  padding: 15px 20px;
  cursor: pointer;
  box-shadow: 0px 2px 4px 0px #0000001A;
  margin-top: 21px;
  text-align: left;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-info-box .btn-business-address {
    font-size: 14px;
  }
}

#business-profile .business-profile-info-box .btn-business-address svg,
#business-profile .business-profile-info-box .btn-business-address img {
  margin-right: 10px;
  min-width: 26.43px;
}

#business-profile .business-profile-info-box .lg-business-profile-contact-info-box {
  margin-bottom: 64px;
}

@media screen and (min-width: 992px) {
  #business-profile .business-profile-info-box .lg-business-profile-contact-info-box {
    display: none;
  }
}

#business-profile .business-profile-info-box .lg-business-profile-contact-info-box .btn-brand-number,
#business-profile .business-profile-info-box .lg-business-profile-contact-info-box .btn-brand-map {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 14.63px;
}

#business-profile .business-profile-info-box .lg-business-profile-contact-info-box .btn-brand-number {
  padding: 13px 16px;
  background-color: #FFFFFF;
  margin-right: 15px;
}

#business-profile .business-profile-info-box .lg-business-profile-contact-info-box .btn-brand-number svg,
#business-profile .business-profile-info-box .lg-business-profile-contact-info-box .btn-brand-number img {
  margin-right: 7.1px;
}

#business-profile .business-profile-info-box .lg-business-profile-contact-info-box .btn-brand-map {
  padding: 16px 27px;
  color: #F1F1F1;
  background-color: #690FAD;
}

#business-profile .business-profile-activities-page {
  padding-bottom: 126px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter {
  margin: 30px -1px 42px -1px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box {
  width: 100%;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box,
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box,
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box {
    margin-bottom: 1rem;
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box input,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box select,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box input,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box select,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box input,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box select {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 18.5px;
  font-weight: 400;
  width: 100%;
  padding: 11px 13px 12px 18px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  padding-right: 28px;
  background-color: #F1F1F1;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box {
  max-width: 295px;
  position: relative;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box {
    max-width: calc(50% - .5rem);
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box svg {
  position: absolute;
  right: 13px;
  top: 13px;
  cursor: pointer;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box {
  display: none;
  position: absolute;
  width: 100%;
  top: 0;
  box-shadow: 0px 4px 4px rgba(18, 18, 18, 0.25);
  border-radius: 20px 20px 0 0;
  z-index: 2;
  background-color: #FFFFFF;
}

@media screen and (min-width: 992px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box {
    left: 0;
    top: 2.9rem;
    border-radius: 0;
  }
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box {
    width: calc(100% + 66px);
    top: 2.9rem;
    right: 0;
    border-radius: 0;
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body {
  padding: 17px 8px;
  margin: 0 10px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body .location-list {
  height: 100%;
  max-height: 193px;
  overflow-y: scroll;
  padding: 5px 0;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body .location-list::-webkit-scrollbar {
  width: 7px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body .location-list::-webkit-scrollbar-track {
  background: #F1F1F1;
  border-radius: 11px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body .location-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.45);
  border-radius: 11px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body .location-list .location-item {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 18.75px;
  margin-bottom: 19px;
  cursor: pointer;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-search-box .manual-location-field-box .manual-location-field-body .location-list .location-item:last-child {
  margin-bottom: 0px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box {
  max-width: 295px;
  position: relative;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box {
    max-width: calc(50% - .5rem);
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box select {
  appearance: none;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box svg {
  position: absolute;
  right: 13px;
  top: 17px;
  cursor: pointer;
  background-color: transparent;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box svg,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box path {
  fill: #222222;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .svg-category-icon.active {
  transform: rotate(180deg);
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box {
  display: none;
  position: absolute;
  width: 100%;
  top: 0;
  box-shadow: 0px 4px 4px rgba(18, 18, 18, 0.25);
  border-radius: 20px 20px 0 0;
  z-index: 2;
  background-color: #FFFFFF;
}

@media screen and (min-width: 992px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box {
    left: 0;
    top: 2.9rem;
    border-radius: 0;
  }
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box {
    left: 0;
    border-radius: 0;
    width: calc(100% + 66px);
    top: 2.9rem;
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box .category-field-body {
  padding: 17px 8px;
  margin: 0 10px;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box .category-field-body {
    border-top: none;
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box .category-field-body .category-list {
  padding-top: 5px;
  padding-bottom: 5px;
  height: 100%;
  max-height: 193px;
  overflow-y: scroll;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box .category-field-body .category-list::-webkit-scrollbar {
  width: 7px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box .category-field-body .category-list::-webkit-scrollbar-track {
  background: #F1F1F1;
  border-radius: 11px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box .category-field-body .category-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.45);
  border-radius: 11px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box .category-field-body .category-list .category-item {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 18.75px;
  margin-bottom: 19px;
  cursor: pointer;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-category-box .category-field-box .category-field-body .category-list .category-item:last-child {
  margin-bottom: 0px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box {
  max-width: 256px;
  position: relative;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box {
    max-width: calc(65% - .5rem);
    margin-right: 0;
    margin-left: 0;
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box svg {
  position: absolute;
  right: 13px;
  top: 13px;
  cursor: pointer;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box svg,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box path {
  fill: #000000;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box {
  display: none;
  position: absolute;
  width: 100%;
  box-shadow: 0 4px 4px rgba(18, 18, 18, 0.25);
  z-index: 2;
  background-color: #FFFFFF;
  width: calc(100% + 75px);
}

@media screen and (min-width: 992px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box {
    right: 0;
    top: 2.9rem;
    border-radius: 0;
  }
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box {
    top: 2.9rem;
    left: 0;
    border-radius: 0;
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-header {
  padding: 32px 27px 32px 32px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-header .selected-calendar-from,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-header .selected-calendar-to {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  line-height: 13.41px;
  font-weight: 400;
  color: #000000;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-filter {
  height: 215px;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-field-body {
    border-top: none;
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-field-body .calendar {
  color: #000000;
  background-color: #FFFFFF;
  padding-bottom: 25px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-field-body .calendar .current-calendar-info-box {
  padding-left: 32px;
  padding-right: 27px;
  margin-bottom: 17px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-field-body .calendar .selected-calendar-month,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-field-body .calendar .selected-calendar-year {
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  line-height: 29.26px;
  font-weight: 400;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-field-body .calendar table {
  width: calc(100% - 40px);
  margin-left: auto;
  margin-right: 19px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-field-body .calendar table tr th,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-field-body .calendar table tr td {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  line-height: 13.41px;
  font-weight: 400;
  padding-bottom: 15px;
  cursor: pointer;
  text-align: center;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-field-body .calendar table tr:last-child td {
  padding-bottom: 0;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-footer {
  margin-top: 23px;
  padding: 21px 31px 22px;
  box-shadow: 0px -4px 4px 0px #0000001A;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-footer .btn-calendar-cancel,
#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-footer .btn-calendar-apply {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  line-height: 14.63px;
  font-weight: 500;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-footer .btn-calendar-cancel {
  color: #000000;
  margin-right: 31px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .input-field-date-box .calendar-field-box .calendar-footer .btn-calendar-apply {
  color: #690FAD;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .search-btn-box {
  max-width: 122.59px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

@media screen and (max-width: 991px) {
  #business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .search-btn-box {
    max-width: calc(35% - .5rem);
    margin-left: auto;
  }
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .search-btn-box button {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 18.5px;
  font-weight: 500;
  width: 100%;
  padding: 11px 13px;
  color: #FFFFFF;
  background-color: #690FAD;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .search-btn-box .btn-map {
  min-width: 41px;
  min-height: 42px;
  max-width: 41px;
  max-height: 42px;
  background-color: #F1F1F1;
  margin-left: 17.41px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .form-group label {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 18.75px;
  font-weight: 400;
  color: #000000;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .form-group label::before {
  filter: invert(0%) sepia(100%) saturate(0%) hue-rotate(21deg) brightness(97%) contrast(103%);
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .form-group input {
  display: none;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .form-group input:checked + label:after {
  top: 0px;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .form-group:hover label {
  color: #690FAD;
}

#business-profile .business-profile-activities-page .business-profile-activities-filter .filter-box .form-group:hover label::before {
  filter: unset;
}

#business-profile .business-profile-activities-page .booking-card-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
  row-gap: 30px;
  column-gap: 30px;
}

#business-profile .business-profile-packages-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 362px));
  column-gap: 15px;
  row-gap: 15px;
  padding-bottom: 102px;
  justify-content: center;
}

#business-profile .applied-filter-box {
  margin-bottom: 41px;
}

@media screen and (max-width: 767px) {
  #business-profile .applied-filter-box {
    margin-bottom: 30px;
  }
}

#business-profile .applied-filter-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 29px;
}

@media screen and (max-width: 767px) {
  #business-profile .applied-filter-header {
    margin-bottom: 31px;
  }
}

#business-profile .applied-filter-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: left;
  color: #000000;
}

@media screen and (max-width: 767px) {
  #business-profile .applied-filter-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
  }
}

#business-profile .applied-filter-btn-reset {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: right;
  color: #690FAD;
  cursor: pointer;
}

@media screen and (max-width: 767px) {
  #business-profile .applied-filter-btn-reset {
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
  }
}

#business-profile .applied-filter-list {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  column-gap: 9px;
  row-gap: 29px;
}

@media screen and (max-width: 767px) {
  #business-profile .applied-filter-list {
    column-gap: 10px;
    row-gap: 15px;
  }
}

#business-profile .applied-filter-item {
  min-width: 103px;
  display: inline-block;
  width: fit-content;
  padding: 14px 27px 13px 26px;
  background-color: #690FAD;
  color: #FFFFFF;
  border-radius: 30px;
  position: relative;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: center;
  transition: .3s ease-in-out;
}

@media screen and (max-width: 767px) {
  #business-profile .applied-filter-item {
    font-size: 12px;
    font-size: 12px;
    line-height: 15px;
    padding: 14px 20px;
  }
}

#business-profile .applied-filter-item .btn-remove {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: -10px;
}

@media screen and (min-width: 768px) {
  #business-profile .applied-filter-item .btn-remove {
    display: none;
  }
}

#business-profile .applied-filter-item:hover {
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
}

@media screen and (min-width: 768px) {
  #business-profile .applied-filter-item:hover .btn-remove {
    display: block;
  }
}

/*Toast Copy data Css*/
#snackbar, #snackbar-1, #snackbar-2 {
  visibility: hidden;
  color: #fff;
  background-color: #690FAD;
  min-width: 250px;
  margin-left: -125px;
  border-radius: 2px;
  padding: 10px;
  text-align: center;
  left: 50%;
  bottom: 30px;
  z-index: 1;
  position: fixed;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

#edit-invite-modal #snackbar, #snackbar-1, #snackbar-2 {
  visibility: hidden;
  color: #fff;
  background-color: #690FAD;
  min-width: 250px;
  margin-left: -125px;
  border-radius: 2px;
  padding: 10px;
  text-align: center;
  left: 50%;
  bottom: 30px;
  z-index: 1;
  position: fixed;
}

#edit-invite-modal, #snackbar.show, #snackbar-1.show, #snackbar-2.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

.customwidth {
  width: 580px
}
</style>
