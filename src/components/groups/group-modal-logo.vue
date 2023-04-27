<template>
  <div class="custom-container">
    <div class="business-profile-info-box flex flex-wrap">
      <div class="business-profile-short-info-box d-flex align-items-center mx-auto">
        <div class="business-profile-logo-box rounded-full relative align-self-baseline">
          <input
            ref="fileInput"
            type="file"
            accept=".jpg,.jpeg,.png,.svg"
            class="d-none"
            @change="previewImage"
          >
          <img
            class="rounded-full group-bg bg-purple-500"
            :src="payload.logo ? constants.getImageUrl(payload.logo) : constants.getImageUrl(userInformation.avatar)"
          >
          <img
            class="absolute bottom-2 right-0 group-pencil"
            :src="require('@/assets/images/modal/group/Pencil.svg')"
            @click="openFileDialog"
          >
        </div>
        <div class="business-profile-name-box mr-10">
          <input
            v-model="payload.name"
            type="text"
            placeholder="Enter Group Name"
            name="name"
            class="group-name business-profile-brand-title p-1.5 mt-6"
          >
          <div class="flex align-items-baseline">
            <p class="text-xs pt-2 date-text">
              Created on {{ getCurrentDateToLocaleString() }}
            </p>
            <p class="ml-4">
              <b-form-checkbox
                v-model="payload.privacy"
                name="check-button"
                switch
              >
                {{ status }}
              </b-form-checkbox>
            </p>
          </div>
          <div id="filter">
            <div class=" filter-box">
              <div class="input-field-category-box mr-2 border-solid border-2 rounded-lg border-purple-300">
                <select
                  v-model="payload.group_type"
                  disabled
                >
                  <option v-for="option in group_types_options" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
                <down-arrow-icon />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="opacity-20 d-flex align-items-start mt-10 mr-10">
        <img
          :src="require('@/assets/images/modal/group/Contact.svg')"
          alt="banner"
        >
      </div>
    </div>
    <!--Nav tabs-->
    <div class="tab-container opacity-20 d-flex justify-content-center">
      <img
        :src="require('@/assets/images/modal/group/TabBar.svg')"
        alt="banner"
      >
    </div>
  </div>
</template>

<script>
import { BFormCheckbox } from 'bootstrap-vue'
import { getCurrentDateToLocaleString } from '@/utils'
import DownArrowIcon from '@/svgs/down-arrow-icon.vue'
import constants from '@/constants/constants'
import makeToast from '@/constants/toast'

export default {
  name: 'GroupModalLogo',
  components: {
    DownArrowIcon,
    BFormCheckbox,
  },
  props: ['imageUrl', 'payload', 'group_types_options', 'userInformation'],
  computed: {
    constants() {
      return constants
    },
    status() {
      return this.payload.privacy ? 'Private' : 'Public'
    },
  },
  mounted() {
    if (this.payload.logo === '') this.payload.logo = this.userInformation.avatar
  },
  methods: {
    getCurrentDateToLocaleString,
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

<style scoped>

</style>
