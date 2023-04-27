<template>
  <form class="mt-4">
    <label class="text-sm font-style">
      Search for people
      <sub class="steric-sign text-danger label-required">&nbsp;*</sub>
    </label>
    <div class="d-flex justify-content-between gap-4">
      <input
        v-model="query"
        v-debounce:1s="searchEmployees"
        class="invite-ipt"
        placeholder="Search for emails"
        type="text"
        @keydown.enter.prevent="searchEmployees"
      >
      <input
        id="fileUpload"
        accept=".csv"
        type="file"
        hidden
        @change="onFileChange"
      >
      <div class="rounded-md">
        <button
          class="group-button"
          type="button"
          @click="chooseFiles"
        >
          Upload file
        </button>
      </div>
      <div class="rounded-md">
        <button
          class="group-button download-button"
          type="button"
          @click="downloadTemplate"
        >
          Download Template
        </button>
      </div>
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
    chooseFiles() {
      document.getElementById('fileUpload').click()
    },
    downloadTemplate() {
      window.open(
        'https://cdn.coredirection.com/files/invite_users_template.csv',
        '_blank',
      )
    },
    onFileChange(event) {
      const { files } = event.target
      if (!files.length) return
      this.createInput(files[0])
    },
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

    checkArrayKeys(obj, arr) {
      return Object.values(obj).sort().toString() === arr.sort().toString()
    },
    validateCDVHeaders(headers) {
      const validHeaders = ['id', 'FirstName', 'LastName', 'Email']
      if (headers.length === 4 && this.checkArrayKeys(headers, validHeaders)) {
        return true
      }
      this.makeToast('Invalid CSV File Headers. Please make sure CSV File Headers are according to Template.', 'danger', 'Error')
      return false
    },
    createInput(file, event) {
      const promise = new Promise((resolve, reject) => {
        const reader = new FileReader()
        const vm = this
        reader.onload = event => {
          resolve((vm.fileinput = reader.result))
        }
        reader.readAsText(file)
      })

      promise.then(
        () => {
          const lines = this.fileinput.split('\n')
          const header = lines[0].split(',')
          header.map((i, index) => {
            header[index] = i.replace('\r', '') // removing spaces from headers
          })
          if (this.validateCDVHeaders(header)) {
            const output = lines.slice(1).map(line => {
              const fields = line.split(',')
              fields[3] = fields[3].replace('\r', '') // removing spaces from email
              if (this.validateEmail(fields[3])) {
                return Object.fromEntries(header.map((h, i) => [h.toLowerCase(), fields[i]]))
              }
            })
            // output.pop()
            if (output.length <= 1000) {
              if (!output.length < 1) {
                this.$emit('setCSVData', output)
                this.makeToast('CSV file has been loaded.', 'success', 'Success')
              } else {
                this.makeToast('CSV File is empty. Please add some users in CSV File.', 'danger', 'Error')
              }
            } else {
              this.makeToast('Cannot exceed number of users more then 1000 in CSV file.', 'danger', 'Error')
            }
          }
        },
        error => {
          this.makeToast('Something went wrong. Please make sure your CSV file format is valid.', 'danger', 'Error')
          console.log(error)
        },
      )
    },
    searchEmployees() {
      if (this.query !== '') {
        this.$emit('showLoading', true)
        searchEmployees(this.query).then(response => {
          this.$emit('setSearchData', response.data)
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
