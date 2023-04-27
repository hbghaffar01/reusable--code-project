<template>
  <div>
    <b-modal
      id="AddInstructorModal"
      size="lg"
      hide-header
      hide-footer
    >
      <main class="mx-20 my-16">
        <p class="text-lg font-style m-0">
          Add Instructor
        </p>
        <form>
          <div class="my-3">
            <SearchInstructor
              @setSearchData="setSearchData"
              @showLoading="showLoading"
            />
            <TextLoader v-if="searching" height="250px" width="100%" />
            <div v-if="searchData.length">
              <div
                v-if="added"
                class="search-result-wrapper"
              >
                <SearchInstructorResult
                  v-for="(instructor,index) in searchData"
                  :key="index"
                  :instructor="instructor"
                  :added-instructor="addedInstructor"
                  @addInstructor="addInstructor"
                />
              </div>
            </div>
          </div>
          <div class="avatar-section mb-8">
            <div>
              <label class="text-sm font-style flex items-center"> Upload Photo
              </label>
            </div>
            <div class="avatar-container">
              <div class="avatar-box flex items-center my-0">
                <div class="avatar-img-box position-relative">
                  <img
                    v-if="instructorPayload.image && instructorPayload.image !== defaultImage"
                    :src="require('@/assets/images/icons/closeBlack.svg')"
                    alt="delete"
                    class="action-icons1"
                    @click="deleteLogo()"
                  >
                  <img
                    v-if="previewLogo"
                    :src="previewLogo ? previewLogo : require('@/assets/images/modal/profile-build-camera-instructor.svg')"
                    alt="logo"
                    :class="previewLogo ? 'upload-logo-main' : 'avatar-img' "
                  >
                  <img
                    v-else
                    :src="instructorPayload.image ? getUrl(instructorPayload.image) : require('@/assets/images/modal/profile-build-camera-instructor.svg')"
                    alt="upload image"
                    :class="instructorPayload.image ? 'upload-logo-main' : 'avatar-img' "
                  >
                </div>
              </div>
              <div class="cover-btn">
                <button
                  class="cover-upload-btn d-flex items-center justify-around"
                  type="button"
                  @click="$refs.logo.click()"
                >
                  <span class="uploader-heading-text">Choose an image</span>
                </button>
                <input
                  ref="logo"
                  type="file"
                  hidden
                  @change="setLogo"
                >
              </div>
            </div>
          </div>
          <div class="mt-2 mb-2">
            <div class="info-section gap-8">
              <div class="w-1/2">
                <label class="text-sm font-style flex items-center"> Enter First Name
                  <sub class="text-danger text-lg label-required">*</sub>
                </label>
                <input
                  v-model="instructorPayload.firstName"
                  type="text"
                  value="Clifford"
                  class="invite-ipt"
                  :maxlength="maxFirstName"
                >
                <div v-if="instructorPayload.firstName.length > 29">
                  <span
                    class="error-message text-sm font-style"
                  >First Name must be 30 characters Max</span>
                </div>
              </div>
              <div class="w-1/2">
                <label class="text-sm font-style flex items-center"> Enter Last Name
                  <sub class="text-danger text-lg label-required">*</sub>
                </label>
                <input
                  v-model="instructorPayload.lastName"
                  type="text"
                  value="Tindell"
                  class="invite-ipt"
                  :maxlength="maxLastName"
                >
                <div v-if="instructorPayload.lastName.length > 29">
                  <span
                    class="error-message text-sm font-style"
                  >Last Name must be 30 characters Max</span>
                </div>
              </div>
            </div>
          </div>
          <div class="my-2">
            <label class="text-sm font-style flex items-center"> Enter Job Description
            </label>
            <div class="position-relative">
              <input
                v-model="instructorPayload.description"
                type="text"
                value="Yoga Instructor"
                class="invite-ipt"
              >
              <Tooltip
                :msg="'Job description for adding instructor is necessary. It should be relevant to their field of expertise. Ex Yoga Instructor, Yoga Guru'"
                target-id="job-description"
                class="tooltip-adjustment"
              />
            </div>
          </div>
          <div class="my-2">
            <label class="text-sm font-style flex items-center"> Enter Email Address
            </label>
            <input
              v-model="instructorPayload.email"
              type="text"
              value="cliffordtindel@coredirection.com"
              class="invite-ipt"
              :maxlength="maxEmail"
            >
            <div v-if="instructorPayload.email.length > 29">
              <span
                class="error-message text-sm font-style"
              >Email must be 30 characters Max</span>
            </div>
          </div>
          <div class="mt-2 mb-4">
            <div class="info-section gap-8">
              <div class="w-1/2">
                <label class="text-sm font-style flex items-center"> Enter Contact Number
                </label>
                <input
                  v-model="instructorPayload.phone"
                  type="text"
                  placeholder="Ex +971xxxxxxxxxxx"
                  class="invite-ipt"
                  :maxlength="maxPhone"
                >
                <div v-if="instructorPayload && instructorPayload.phone && instructorPayload.phone.length > 14">
                  <span class="error-message text-sm font-style">Phone number must be 15 characters Max</span>
                </div>
              </div>
              <div class="w-1/2">
                <label class="text-sm font-style flex items-center"> Enter Emergency Contact Number
                </label>
                <input
                  v-model="instructorPayload.emergency_phone"
                  type="text"
                  placeholder="Ex +971xxxxxxxxxxx"
                  class="invite-ipt"
                  :maxlength="maxPhone"
                >
                <div v-if="instructorPayload && instructorPayload.emergency_phone && instructorPayload.emergency_phone.length > 14">
                  <span class="error-message text-sm font-style">Emergency phone must be 15 characters max</span>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div class="flex justify-end items-center gap-10 w-full">
          <p
            class="base-color-main m-0 cursor-pointer font-style"
            @click="closeModal"
          >
            Cancel
          </p>
          <Button
            :btnType="BUTTON_TYPES.PRIMARY"
            :disabled="!instructorPayload.firstName || !instructorPayload.lastName"
            :value="instructorPayload.id ? $t('global.update') : $t('global.create')"
            @click="addInstructorToForm"
          />
        </div>
      </main>
    </b-modal>
  </div>
</template>

<script>
import Tooltip from '@/components/Tooltip/Tooltip.vue'
import { uploadMedia } from '@/apiManager/media'
import { SearchInstructorResult, SearchInstructor } from '@/components/activtiySchedule/AddInstructor'
import { Button, BUTTON_TYPES } from '@/components/Buttons'
import { TextLoader } from '@/components/TextLoader'

export default {
  name: 'AddInstructor',
  components: {
    TextLoader,
    Tooltip,
    SearchInstructor,
    SearchInstructorResult,
    Button,
  },
  props: {
    payload: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      previewLogo: '',
      searchData: [],
      addedInstructor: [],
      searching: false,
      defaultImage: 'media-micro-service/images/11b97ceb-f62c-4604-a76a-171200f6ebdf-image-default_profile_img.png',
      added: true,
      instructorPayload: this.payload,
      maxFirstName: 30,
      maxLastName: 30,
      maxEmail: 30,
      maxPhone: 15,
      maxEmPhone: 15,
      BUTTON_TYPES,
    }
  },
  methods: {
    setSearchData(data) {
      this.searching = false
      this.searchData = data
    },
    addInstructor(data) {
      const index = this.addedInstructor.indexOf(data)
      if (index === -1) {
        this.addedInstructor.push(data)
        if (data.profile_picture === null) {
          this.instructorPayload.image = this.defaultImage
        } else {
          this.instructorPayload.image = data.profile_picture
        }
        this.instructorPayload.firstName = data.firstname
        this.instructorPayload.lastName = data.lastname
        this.instructorPayload.email = data.email
        this.instructorPayload.phone = data.phone
      }
      if (this.instructorPayload !== {}) {
        setTimeout(() => {
          this.added = false
          setTimeout(() => {
            this.added = true
            this.addedInstructor = []
            this.searchData = []
            this.searching = false
          }, 500)
        }, 500)
      }
    },
    addInstructorToForm() {
      if (this.instructorPayload.id) {
        this.previewLogo = ''
        this.$emit('updateInstructorToForm', this.instructorPayload)
      } else {
        this.previewLogo = ''
        this.$emit('addInstructorToForm', this.instructorPayload)
      }
    },
    closeModal() {
      this.searching = false
      this.searchData = []
      this.$emit('closeModal')
    },
    setLogo() {
      const file = this.$refs.logo.files[0]
      this.previewLogo = URL.createObjectURL(file)
      this.uploadImage(file, 'setImage')
    },
    uploadImage(file, key) {
      this.previewLogo = ''
      const formData = new FormData()
      formData.append('file', file)
      uploadMedia(formData)
        .then(response => {
          if (key === 'setImage') this.instructorPayload.image = response.data.key
        })
        .catch(error => console.log(error))
    },
    deleteLogo() {
      let logoFile = this.$refs.logo.files[0]
      logoFile = null
      this.logo = null
      this.previewLogo = logoFile
      delete this.instructorPayload.image
      this.updateDeleteLogo()
    },
    updateDeleteLogo() {
      this.instructorPayload.image = null
    },
    getUrl(imagePath) {
      return imagePath ? this.constants.getImageUrl(imagePath) : ''
    },
    showLoading(key) {
      this.searching = key
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/global.scss";
@import "@core/mixins/ui/_input.scss";
@import '@/assets/scss/base/colors';
@import '@/assets/scss/base/variables';
@import "@core/mixins/ui/_button.scss";

.invite-ipt {
  width: 100%;
  @include input(10px, $black, 14px, 400, 17px, #caa8f5, 5px);
  position: relative;
}

.search-result-wrapper {
  height: 300px;
  overflow: scroll;
}

.ipt-padding {
  border-radius: 40px;
}

.avatar-container {
  display: flex;
  align-items: center;
  column-gap: 3rem;
}

.checkbox-padding {
  margin: 1rem 0;
}

.cover-img-main {
  border: 2px dashed $primary-light;
  border-radius: 5px;
  max-height: 330px;
  z-index: 0;
}

.cover-upload-btn {
  @include button($white, #fff, $primary-light, 20px);
  width: fit-content;
  height: 50px;
  padding: 10px 30px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  overflow: hidden;
  z-index: 2;
}

.cover-btn {
  margin-top: 0;
}

.cover-upload-container-btn {
  position: absolute;
  margin-top: 200px;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  text-align: left;
}

.avatar-box {
  flex-wrap: wrap;
  column-gap: 43px;
  row-gap: 43px;
  margin-top: 10px;
  margin-bottom: 60px;
}

.avatar-img-box {
  min-width: 168px;
  min-height: 168px;
  max-width: 168px;
  max-height: 168px;
  border: 2px dashed rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.avatar-img {
  width: 90px;
  height: 90px;
}

.upload-logo-main {
  min-width: 168px;
  min-height: 168px;
  max-width: 168px;
  max-height: 168px;
  border: 2px dashed $primary-light;
  border-radius: 50%;
}

.avatar-cover-box {
  min-width: 100%;
  min-height: 330px;
  max-width: 100%;
  max-height: 330px;
  border-radius: 5px;
  z-index: 1;
  object-fit: cover;
}

.upload-cover-main {
  min-width: 100%;
  min-height: 326px;
  max-width: 100%;
  max-height: 326px;
  object-fit: cover;
}

.action-icons1 {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  background-color: $white;
  border-radius: 50%;
}

.action-icons2 {
  width: 30px;
  height: 30px;
  position: absolute;
  top: -15px;
  right: -15px;
  cursor: pointer;
  background-color: $white;
  z-index: 2;
  border-radius: 50%;
}

.uploader-heading-text {
  font-size: 13px;
  font-weight: 400;
  line-height: 12px;
  color: #000000;
}

.label-required {
  margin: 0 0.5rem;
}

.info-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 100%;
}

.tooltip-adjustment {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 1rem;
  margin-top: 13px;
}
.error-message {
  color: red !important;
}
</style>
