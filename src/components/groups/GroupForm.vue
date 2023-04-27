<template>
  <b-card>
    <b-form @submit.prevent>
      <b-row>
        <b-col md="6">
          <label for="logo"> Logo </label>
          <b-form-file
            id="logo"
            ref="logo"
            accept="image/*"
          />
        </b-col>
        <b-col md="6">
          <label for="cover"> Cover </label>
          <b-form-file
            id="cover"
            ref="cover"
            accept="image/*"
          />
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Name"
            label-for="mc-first-name"
          >
            <b-form-input
              id="mc-first-name"
              v-model="payload.name"
              placeholder="Name"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <label for="wildcard"> Group Type </label>
          <b-form-group>
            <v-select
              v-model="payload.group_type"
              label="label"
              :options="groupTypes"
              :value="groupTypes.value"
              placeholder="Select Group Type"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <label for="wildcard"> Group Activity Types </label>
          <b-form-group>
            <v-select
              v-model="payload.activity_type_ids"
              label="name"
              :options="activities"
              multiple
              placeholder="Select Group Activity Types"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <label for="wildcard"> Privacy </label>
          <b-form-group>
            <v-select
              v-model="payload.privacy"
              label="label"
              :options="privacyList"
              placeholder="Select Privacy"
            />
          </b-form-group>
        </b-col>

        <!-- submit and reset -->
        <b-col>
          <b-button
            v-if="!loading"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="primary"
            class="mr-1 move-btn"
            @click="createGroup"
          >
            Submit
          </b-button>
          <b-button
            v-else
            variant="primary"
            disabled
            class="mr-1 move-btn"
          >
            <b-spinner small />
            <span class="sr-only">Loading...</span>
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import {
  BRow, BCol, BFormGroup, BFormInput, BForm, BButton, BCard, BFormFile, BSpinner, BToast,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import { addGroup } from '@/apiManager/groups'

export default {
  name: 'GroupForm',
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BButton,
    BCard,
    BFormFile,
    BSpinner,
    BToast,
    vSelect,
  },
  directives: {
    Ripple,
  },
  props: {
    activities: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      groupTypes: [
        { label: 'Business', value: 'business' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Activity', value: 'activity' },
      ],
      privacyList: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ],
      loading: false,
      payload: {
        name: '',
        group_type: '',
        privacy: '',
        activity_type_ids: [],
      },
    }
  },
  methods: {
    createGroup() {
      this.loading = true
      const activities = []
      this.payload.activity_type_ids.forEach(activity => {
        activities.push(activity.id)
      })

      const payload = {
        name: this.payload.name,
        cover_photo: 'abdjd.jpeg',
        group_type: this.payload.group_type.value,
        logo: 'abcd.jpeg',
        privacy: this.payload.privacy.value,
        activity_type_ids: activities,
      }

      addGroup(payload).then(response => {
        this.makeToast('success', 'Group added successfully')
        setTimeout(() => { this.$parent.showListing = true }, 2000)
      })
    },
    makeToast(variant = null, msg) {
      this.$bvToast.toast(msg, {
        title: `Variant ${variant || 'default'}`,
        variant,
        solid: true,
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
.move-btn {
  float: right;
}
</style>
