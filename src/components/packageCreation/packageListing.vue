<template>
  <div class="overflow-hidden w-100">
    <div class="d-flex w-full justify-content-between">
      <div class="nav-pill-heading" style="width: 200px">
        Memberships
      </div>
      <div class="position-relative mb-1 w-100">
        <div class="nav nav-tabs flex flex-wrap list-none border-b-0 w-100">
          <div class="nav-item">
            <p class="nav-link p-1 cursor-pointer active">
              Active Packages
            </p>
          </div>
          <!--          <div class="nav-item">-->
          <!--            <p class="nav-link p-1 cursor-pointer">-->
          <!--              Active Memberships-->
          <!--            </p>-->
          <!--          </div>-->
          <!--          <div class="nav-item m-0">-->
          <!--            <p class="nav-link p-1 cursor-pointer">-->
          <!--              Promotions-->
          <!--            </p>-->
          <!--          </div>-->
        </div>
        <div class="slider-1"/>
      </div>
    </div>
    <SkeletonLoader v-if="loading"/>
    <div v-else class="w-100 table-scroll" style="overflow-x: auto">
      <NoRecordFound v-if="!packages.length"/>
      <table
          v-else
          class="text-center w-100 table-resp table-rows-gap"
      >
        <thead>
        <tr class="text-white font-weight-bold header-bg">
          <th class="rounded-tl-lg">#</th>
          <th></th>
          <th class="text-left package-title">Packages Name</th>
          <th>Packages Type</th>
          <th>Public Rate</th>
          <th>Corporate Rate</th>
          <th>Validity Day(s)</th>
          <th class="rounded-tr-lg">Actions</th>
        </tr>
        </thead>
        <tbody class="package-body">
        <tr v-for="(pakage, index) in packages" :key="index">
          <td class="round-bl-lg">
            {{ pakage.id }}
          </td>
          <td class="package-logo">
            <div class="d-flex justify-content-center align-items-center w-100 ">
              <img
                  :src="
                  require('@/assets/images/icons/packages-logo.svg')
                "
                  alt="packagesLogo"
                  width="40"
                  height="40"
              />
            </div>
          </td>
          <td class="text-left">
            {{ pakage.name }}
          </td>
          <td>{{ pakage.package_type.name }}</td>
          <td>
            {{ pakage.public_rate }} AED
          </td>
          <td>
            {{ pakage.corporate_rate }} AED
          </td>
          <td>
            {{ pakage.validity_days }} Day(s)
          </td>
          <td class="round-br-lg">
            <div class="d-flex justify-content-center align-items-center gap-4">
              <img
                  v-b-modal.createPackageModal
                  :src="require('@/assets/images/icons/edit-icon.svg')"
                  alt="edit"
                  class="action-icons"
                  @click="updatePackage(pakage)"
              />
              <img
                  v-b-modal.deleteModal
                  :src="require('@/assets/images/icons/delete-icon.svg')"
                  alt="delete"
                  class="action-icons"
                  @click="delId = pakage.id"
              />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-2">
      <Pagination
          v-if="packages.length"
          :limit="data.limit"
          :offset="data.offset"
          :count="totalRecords"
          @fetch-data="getPackageList"
      />
    </div>
    <b-modal
        id="deleteModal"
        size="md"
        centered
        hide-footer
        hide-header
    >
      <DeleteModal @remove="deletePackage"/>
    </b-modal>

  </div>
</template>

<script>
import Pagination from '@/components/common/Pagination.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import DeleteModal from '@/components/deleteModal/DeleteModal.vue'
import {getPackagesList, deletePackage} from '@/apiManager/packages'
import NoRecordFound from '@/components/common/NoRecordFound.vue'
import makeToast from '@/constants/toast'

export default {
  name: 'PackageListing',
  components: {
    NoRecordFound,
    Pagination,
    SkeletonLoader,
    DeleteModal
  },
  data() {
    return {
      loading: false,
      packages: [],
      data: {
        limit: 10,
        offset: 0,
        packageName: '',
        packageType: '',
      },
      totalRecords: 0,
      delId: '',
      updateId: '',
    }
  },
  mounted() {
    this.getPackageList()
  },
  methods: {
    getPackageList() {
      this.loading = true
      getPackagesList(this.data)
          .then(response => {
            if (response.statusCode === 200) {
              this.packages = response.data
              this.totalRecords = response.meta.item_count
            } else {
              makeToast(response.message, 'Error', 'danger')
            }
            this.loading = false
          })
    },
    deletePackage() {
      deletePackage(this.delId)
          .then(response => {
            if (response.statusCode === 204) {
              this.$bvModal.hide('deleteModal')
              this.getPackageList()
              makeToast(this.$bvToast, 'Package deleted successfully', 'success', 'success')
            } else {
              makeToast(this.$bvToast, response.message, 'success', 'success')
            }
            this.$bvModal.hide('deleteModal')
            this.getPackageList()
          })
    },
    updatePackage(pakage) {
      this.$emit('setEditData', pakage)
    }
  },
}
</script>

<style lang="scss">
@import "@/assets/scss/global.scss";
@import '@core/scss/base/core/colors/palette-variables.scss';

.package-card {
  background: #ffffff;
  box-shadow: 0 22px 40px rgba(0, 0, 0, 0.1);
  border-radius: 11px;
  overflow: hidden;
}

.package-logo {
  width: 8rem;
}

.package-body tr {
  background: #FFFFFF;
  box-shadow: 1px 3px 7px rgba(0, 0, 0, 0.15);
}

.package-body tr:nth-child(odd) {
  background: #FFFFFF !important;
}

.table-rows-gap {
  border-collapse: separate;
  border-spacing: 0 6px;
}
</style>
