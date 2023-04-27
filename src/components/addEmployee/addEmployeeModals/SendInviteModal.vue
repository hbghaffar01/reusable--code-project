<template>
  <main class="mx-20 my-16">
    <div class="flex items-center justify-between">
      <p class="text-lg font-style m-0">
        Send Invites
      </p>
      <p class="base-color-main text-sm font-weight-bolder m-0">
        Steps 1 / 2
      </p>
    </div>
    <SearchPeople
      v-if="showSearch"
      @setCSVData="setCSVData"
      @setSearchData="setSearchData"
      @showLoading="showLoading"
    />
    <!--Hero-image-->
    <SkeletonLoader
      v-if="searching"
      class="mt-2"
    />
    <div
      v-if="!searchData.length && !CSVData.length && !searching"
      class="flex items-center justify-center mx-auto my-20"
    >
      <img
        alt="sharing banner"
        src="../../../assets/images/modal/sharing.svg"
        width="300px"
      >
    </div>
    <div v-if="searchData.length">
      <div class="search-result-wrapper">
        <SearchResult
          v-for="(employee,index) in searchData"
          :key="index"
          :employee="employee"
          :added-employees="addedEmployees"
          @addEmployee="addEmployee"
        />
      </div>
      <div
        v-if="addedEmployees.length"
        class="my-5"
      >
        <p class="mb-2 font-style">
          Added People
        </p>
        <div class="d-flex flex-wrap overflow-y-scroll adp-section">
          <AddedPeople
            v-for="(addedEmployee, index) in addedEmployees"
            :key="index"
            :added-employee="addedEmployee"
            @removeEmployee="removeEmployee"
          />
        </div>
      </div>
    </div>
    <!--        content upload 3-->
    <div v-if="CSVData.length">
      <div class="card-modal w-100 my-2 p-1 flex items-center justify-between">
        <div class="flex gap-5 items-center">
          <h5 class="text-sm font-style m-0">
            Source File:
          </h5>
          <p class="text-sm m-0">
            Core Direction Employee_email_addresses
          </p>
        </div>
        <button
          class="base-color-main text-sm font-medium"
          @click="discardSheet"
        >
          Discard Sheet
        </button>
      </div>
      <CSVSheet :table-data="CSVData" />
    </div>
    <!--Shared Linked Input-->
    <SharingLink />
  </main>
</template>
<script>
import Vue from 'vue'
import { AddedPeople, CSVSheet, SearchPeople, SearchResult, SharingLink } from '@/components/addEmployee'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

export default {
  name: 'SendInviteModal',
  components: {
    SkeletonLoader,
    SharingLink,
    SearchResult,
    SearchPeople,
    CSVSheet,
    AddedPeople,
  },
  data() {
    return {
      CSVData: [],
      searchData: [],
      addedEmployees: [],
      showSearch: true,
      searching: false,
    }
  },
  methods: {
    setCSVData(data) {
      this.CSVData = data
      this.$emit('setEmployeeData', this.CSVData.concat(this.addedEmployees))
    },
    setSearchData(data) {
      this.searching = false
      this.searchData = data
    },
    discardSheet() {
      this.CSVData = []
      this.$emit('setEmployeeData', this.CSVData.concat(this.addedEmployees))
      this.showSearch = false
      Vue.nextTick(() => {
        this.showSearch = true
      })
    },
    addEmployee(data) {
      const index = this.addedEmployees.indexOf(data)
      if (index === -1) {
        this.addedEmployees.push(data)
        this.$emit('setEmployeeData', this.CSVData.concat(this.addedEmployees))
      }
    },
    removeEmployee(data) {
      const index = this.addedEmployees.indexOf(data)
      this.addedEmployees.splice(index, 1)
      this.$emit('setEmployeeData', this.CSVData.concat(this.addedEmployees))
    },
    showLoading(key) {
      this.searching = key
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@core/scss/base/core/colors/palette-variables.scss";

.adp-section {
  height: 400px;
}

.card-modal {
  width: 85%;
  background-color: #F2F5EA;
}

.font-style {
  font-weight: 700;
  color: $black;
}

.search-result-wrapper {
  height: 300px;
  overflow: scroll;
}

</style>
