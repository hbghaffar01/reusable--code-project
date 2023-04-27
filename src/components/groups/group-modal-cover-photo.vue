<template>
  <div class="business-profile-header">
    <input
      ref="fileInput"
      type="file"
      accept=".jpg,.jpeg,.png,.svg"
      class="d-none"
      @change="previewImage"
    >
    <div class="custom-container">
      <div class="relative business-profile-banner-box border-solid border-2 rounded border-purple-600 d-flex justify-content-center align-items-center">
        <img
          style="height: inherit"
          :src="`${uploadImageUrl ? constants.getImageUrl(uploadImageUrl) : constants.getImageUrl(userInformation.companyBanner)}`"
        >
        <img
          class="absolute bottom-2 right-0 group-pencil mr-1"
          :src="require('@/assets/images/modal/group/Pencil.svg')"
          @click="openFileDialog"
        >
      </div>
    </div>
  </div>
</template>

<script>
import makeToast from '@/constants/toast'

export default {
  name: 'GroupModalCoverPhoto',
  props: {
    imageUrl: {
      type: String,
      default: '',
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    uploadImageUrl: {
      type: String,
      required: true,
    },
    userInformation: {
      type: Object,
      required: true,
    },
  },
  methods: {
    openFileDialog() {
      const { fileInput } = this.$refs
      fileInput.click()
    },
    previewImage() {
      const { fileInput } = this.$refs
      if (fileInput.files && fileInput.files[0]) {
        if (fileInput.files[0].type !== 'image/svg+xml' && fileInput.files[0].type !== 'image/png' && fileInput.files[0].type !== 'image/jpeg' && fileInput.files[0].type !== 'image/jpg') {
          makeToast(this.$bvToast, 'Invalid File Type', 'Error', 'danger')
          fileInput.files[0].type = `'image'/${fileInput.files[0].type}`
        } else {
          this.$emit('fileType', fileInput.files[0].type)
        }
        const reader = new FileReader()
        reader.readAsDataURL(fileInput.files[0])
        reader.onload = event => {
          this.$emit('onChangeCoverPhoto', event.target.result)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';

.business-profile-banner-box{
  background-color: $white;
}
.business-profile-banner-box img{
  width:100%;
}
.business-profile-banner-box img.absolute{
  width:35px;
}
</style>
