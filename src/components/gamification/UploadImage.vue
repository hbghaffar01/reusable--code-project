<template>
  <main class="mx-20 my-16">
    <div class="flex items-center justify-between">
      <p class="text-lg font-style m-0">
        Upload Images
      </p>
      <p class="base-color-main text-sm font-weight-bolder m-0">
        Steps 2 / 2
      </p>
    </div>
    <!--Challenge Name-->
    <form>
      <div class="my-3">
        <label class="text-sm font-style flex items-center">
          Set up custom logo for the challenge
          <Tooltip
            :msg="'This is your Company Logo, please upload at 1:1 ratio.'"
            target-id="challengeLogo"
            class="ml-1"
          />
        </label>
        <div class="avatar-section">
          <div class="avatar-box flex items-center">
            <div class="avatar-img-box position-relative">
              <img
                v-if="previewLogo || logo"
                :src="require('@/assets/images/icons/closeBlack.svg')"
                alt="delete"
                class="action-icons1"
                @click="deleteLogo()"
              >
              <img
                v-if="previewLogo"
                :src="previewLogo ? previewLogo : require('@/assets/images/modal/profile-build-camera.svg')"
                alt=""
                :class="previewLogo ? 'upload-logo-main' : 'avatar-img' "
              >
              <img
                v-else
                :src="logo ? getUrl(logo) : getUrl(userInformation.avatar)"
                alt="upload image"
                :class="logo ? 'upload-logo-main' : 'avatar-img' "
              >
            </div>
            <div>
              <p class="font-style text-2xl">
                {{ payload.title }}
              </p>
              <p class="text-md base-color-main italic">
                Recommended Size 200x200px
              </p>
              <p class="font-style text-2xl">File Name: <span
                class="text-xl font-weight-light"
              >(...png, jpg,jpeg)</span></p>
              <button
                class="upload-btn d-flex items-center justify-around font-style text-light"
                type="button"
                @click="$refs.logo.click()"
              >
                <img
                  alt="Plus Icon"
                  src="../../assets/images/modal/PlusIcon.svg"
                  width="12px"
                  class="mr-1"
                  disabled
                >
                Upload Image
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
      </div>
      <div class="mt-3 mb-40">
        <label class="text-sm font-style flex items-center">
          Set up your cover photo
          <Tooltip
            :msg="'This is the user-facing banner, recommended dimension is 1188 x 331px.'"
            target-id="challengeCover"
            class="ml-1"
          />
        </label>
        <div class="mt-8 mb-4 flex items-center justify-content-center w-100 position-relative">
          <img
            v-if="previewCover || cover"
            :src="require('@/assets/images/icons/closeBlack.svg')"
            alt="delete"
            class="action-icons2"
            @click="deleteCover()"
          >
          <div
            class="avatar-cover-box cover-img-main w-100 flex items-center justify-center flex-col position-relative "
          >
            <img
              v-if="cover || previewCover"
              :src="previewCover ? previewCover : getUrl(cover)"
              alt="upload"
              :class="cover || previewCover ? 'upload-cover-main' : ''"
            >
            <div
              v-else
              class="flex items-center justify-center flex-col"
            >
              <img
                :src="cover ? getUrl(cover) : getUrl(userInformation.companyBanner)"
                alt="upload"
                class="cover-image-setter"
              >
            </div>
            <div class="button-container" :class="cover || previewCover ? 'position-absolute cover-btn': ''">
              <h2 class="font-style text-lg base-color-main mt-0">
                Upload PNG, JPG or Jpeg
              </h2>
              <p class="text-lg base-color-main italic">
                Recommended Resolution 1440x330px
              </p>
              <button
                class="cover-upload-btn d-flex items-center justify-around font-style text-light"
                type="button"
                @click="$refs.cover.click()"
              >
                <img
                  alt="Plus Icon"
                  src="../../assets/images/modal/PlusIcon.svg"
                  width="12px"
                  class="mr-1 btn-upload-img"
                  disabled
                >
                Upload Image
              </button>
              <input
                ref="cover"
                type="file"
                hidden
                @change="setCover"
              >
            </div>
          </div>
        </div>
        <div class="mt-8 mb-4 flex items-center justify-content-center w-100 position-relative" />
      </div>
      <div class="flex items-center justify-between my-12">
        <img
          alt="Arrow"
          src="../../assets/images/modal/backArrow.svg"
          width="32px"
          class="cursor-pointer"
          @click="backToChallenge"
        >
        <div class="flex items-center gap-10">
          <p
            class="base-color-main m-0 cursor-pointer font-style"
            @click="$bvModal.hide('uploadImageModal')"
          >
            Cancel
          </p>
          <b-button
            class="challenge-btn"
            @click="createChallenge"
          >
            {{ challengeId === '' ? 'Create' : 'Update' }} Challenge
          </b-button>
        </div>
      </div>
    </form>
  </main>
</template>

<script>
import { BButton } from 'bootstrap-vue'
import { uploadMedia } from '@/apiManager/media'
import Tooltip from '@/components/Tooltip/Tooltip.vue'

export default {
  name: 'UploadImage',
  components: {
    BButton,
    Tooltip,
  },
  props: {
    payload: {
      type: Object,
      required: true,
    },
    challengeId: {
      type: String || Number,
      required: true,
    },
    userInformation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      logo: this.payload.logo,
      cover: this.payload.cover_photo,
      previewLogo: '',
      previewCover: '',
    }
  },
  methods: {
    backToChallenge() {
      this.$bvModal.hide('uploadImageModal')
      this.$bvModal.show('challengeCreateModal')
    },
    setLogo() {
      const file = this.$refs.logo.files[0]
      this.previewLogo = URL.createObjectURL(file)
      this.uploadImage(file, 'setLogo')
    },
    setCover() {
      const file = this.$refs.cover.files[0]
      this.previewCover = URL.createObjectURL(file)
      this.uploadImage(file, 'setCover')
    },
    deleteLogo() {
      let logoFile = this.$refs.logo.files[0]
      logoFile = null
      this.logo = null
      this.previewLogo = logoFile
      this.$emit('deleteLogo', logoFile)
      this.$emit('updateDeleteLogo', this.logo)
    },
    deleteCover() {
      let file = this.$refs.cover.files[0]
      file = null
      this.cover = null
      this.previewCover = file
      this.$emit('deleteCover', file)
      this.$emit('updateCoverLogo', this.cover)
    },
    uploadImage(file, key) {
      const formData = new FormData()
      formData.append('file', file)
      uploadMedia(formData)
        .then(response => {
          if (key === 'setLogo') {
            this.logo = response.data.key
          } else {
            this.cover = response.data.key
          }
          this.$emit(key, response.data.key)
        })
        .catch(error => console.log(error))
    },
    createChallenge() {
      this.$bvModal.hide('uploadImageModal')
      if (this.challengeId === '') {
        this.$emit('create')
      } else {
        this.$emit('update')
      }
    },
    getUrl(imagePath) {
      return imagePath ? this.constants.getImageUrl(imagePath) : ''
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

.cover-img-main {
  border: 2px dashed $core-direction-base;
  border-radius: 5px;
  max-height: 330px;
  z-index: 0;
}

.upload-btn {
  @include button($white, $core-direction-base, $core-direction-base, 20px);
  width: fit-content;
  height: 50px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  z-index: 2;
}

.cover-upload-btn {
  @include button($white, $core-direction-base, $core-direction-base, 20px);
  width: fit-content;
  height: 50px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  overflow: hidden;
  z-index: 2;
  margin-bottom: 6rem;
}

.cover-btn {
  margin-top: 200px;
}

.cover-upload-container-btn {
  position: absolute;
  margin-top: 200px;
}

.challenge-btn {
  cursor: pointer;
  @include button($white, $core-direction-base, $core-direction-base, 40px);
  width: fit-content;
  padding: 10px 15px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
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
  margin-top: 30px;
  margin-bottom: 60px;
}

.avatar-img-box {
  min-width: 168px;
  min-height: 168px;
  max-width: 168px;
  max-height: 168px;
  border: 2px dashed $core-direction-base;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
  z-index: 2;
}

.avatar-img {
  z-index: 1;
}

.upload-logo-main {
  min-width: 168px;
  min-height: 168px;
  max-width: 168px;
  max-height: 168px;
  border: 2px dashed $core-direction-base;
  border-radius: 50%;
}

.avatar-cover-box {
  min-width: 100%;
  //min-height: 330px;
  max-width: 100%;
  max-height: 330px;
  border-radius: 5px;
  z-index: 1;
  object-fit: cover;
  overflow: hidden;
}

.upload-cover-main {
  min-width: 100%;
  min-height: 330px;
  max-width: 100%;
  max-height: 330px;
  object-fit: cover;
}

.btn-active {
  background-color: $core-direction-base !important;
  border: 1px solid $core-direction-base !important;
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
  z-index: 999;
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

//.cover-image-setter{
//  max-height: 326px !important;
//}
.button-container{
  position: absolute;
  bottom: -5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>
