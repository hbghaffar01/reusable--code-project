<template>
  <form class="form">
    <Paragraph :value="shareLink ? $t('employee.link') : $t('employee.heading')" />
    <div class="form-input">
      <Input :key="shareLink" v-model="inviteUri" :readonly="shareLink" />
      <div v-if="shareLink" class="form-buttons">
        <Button type="button" :btnStyle="BUTTON_STYLE.ROUND" :btnType="BUTTON_TYPES.PRIMARY" :size="BUTTON_SIZE.MEDIUM" @click="editInviteURI()">
          <template v-slot:children>
            <Icon :type="ICONS.PENCIL" />
          </template>
        </Button>
        <Button type="button" :btnStyle="BUTTON_STYLE.ROUND" :btnType="BUTTON_TYPES.PRIMARY" :size="BUTTON_SIZE.MEDIUM" @click="copyLink()">
          <template v-slot:children>
            <Icon :type="ICONS.COPY" />
          </template>
        </Button>
      </div>
      <Button v-else type="button" :btnType="BUTTON_TYPES.PRIMARY" :value="$t('global.update')" @click="updateLink()" />
      <SnackBar v-if="snackbar" :value="$t('global.copied')" />
    </div>
  </form>
</template>
<script>
import { getCorporateUrl, updateCorporateUrl, getSlugUrl } from '@/apiManager/addEmployee'
import { copyToClipboard, makeToast } from '@/utils'
import { Button, BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPES } from '@/components/Buttons'
import { Input } from '@/components/Form'
import { Paragraph } from '@/components/Typography'
import { Icon, ICONS, SnackBar } from '@/components/UIElements'

export default {
  name: 'SharingLink',
  components: {
    Icon,
    Paragraph,
    Button,
    Input,
    SnackBar,
  },
  data() {
    return {
      invite_uri: '',
      slug_id: '',
      shareLink: true,
      snackbar: false,
      BUTTON_TYPES,
      BUTTON_SIZE,
      BUTTON_STYLE,
      ICONS,
      makeToast,
    }
  },
  computed: {
    inviteUri: {
      get() {
        return this.shareLink ? `${process.env.VUE_APP_WEB_APP_URI}/corporate/${this.slug_id}` : ''
      },
      set(newValue) {
        this.invite_uri = newValue
      },
    },
  },

  beforeMount() {
    this.getUrl()
  },
  methods: {
    getUrl() {
      getSlugUrl().then(response => {
        this.slug_id = response.data.slug
      })
    },
    async updateLink() {
      const url = { url: this.invite_uri }
      const urlExists = await getCorporateUrl(url)
      if (!urlExists) {
        const response = await updateCorporateUrl(url)
        if (response.statusCode === 200) {
          this.slug_id = this.invite_uri
          this.makeToast(this.$bvToast, this.$t('employee.toast'), 'success')
          this.shareLink = true
        } else {
          this.makeToast(this.$bvToast, response.message, 'danger')
        }
      } else {
        this.makeToast(this.$bvToast, 'User name already exists', 'danger')
      }
    },
    editInviteURI() {
      this.shareLink = false
    },
    copyLink() {
      copyToClipboard(this.invite_uri)
      this.snackbar = true
      setTimeout(() => {
        this.snackbar = false
      }, 3000)
    },
  },
}
</script>
<style lang="scss" scoped>
.form {
  &-input, &-buttons {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  input {
    flex: auto;
  }
}
</style>
