<template>
  <form class="mt-4">
    <label class="text-sm font-style">
      Search for people
    </label>
    <div class="d-flex justify-content-between gap-4">
      <input
        v-model="query"
        v-debounce:1s="searchEmployees"
        class="invite-ipt"
        placeholder="Search for emails"
        style="border-radius: 50px"
        type="text"
        @keydown.enter.prevent="searchEmployees"
      >
    </div>
  </form>
</template>

<script>
import { searchEmployees } from '@/apiManager/addEmployee'

export default {
  name: 'SearchPeople',
  data() {
    return {
      debounce: null,
      query: '',
    }
  },
  methods: {
    makeToast(msg, variant, title) {
      this.$bvToast.toast(msg, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: true,
      })
    },
    validateEmail(mail) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true
      }
      this.makeToast('Few emails are invalid. Please make sure their format is correct.', 'danger', 'Error')
      return false
    },
    searchEmployees() {
      if (this.query !== '') {
        this.$emit('showLoading', true)
        searchEmployees(this.query).then(response => {
          this.$emit('setSearchData', response.data)
          if (response.statusCode === 200) {
            this.query = ''
          }
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@core/mixins/ui/_button.scss";
@import "@core/mixins/ui/_input.scss";
@import "@core/scss/base/core/colors/palette-variables.scss";

.group-button {
  width: 100px;
  @include button($white, $core-direction-base, $core-direction-base, 5px);
  padding: 10px 0;
}

.download-button {
  width: 170px !important;
}

.invite-ipt {
  width: 100%;
  @include input(10px, $black, 14px, 400, 17px, #CAA8F5, 5px);
}

.font-style {
  font-weight: 700;
  color: $black;
}
</style>
