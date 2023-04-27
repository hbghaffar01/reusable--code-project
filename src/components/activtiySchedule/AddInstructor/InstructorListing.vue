<template>
  <div class="overflow-hidden w-100">
    <SkeletonLoader v-if="loading" />
    <div
      v-else
      class="w-100 card table-scroll bg-light"
      style="overflow-x: auto"
    >
      <table
        class="text-center w-100 table-resp table-rows-gap emp-table-resp"
      >
        <thead>
          <tr class="text-white font-weight-bold header-bg">
            <th class="rounded-tl-lg">
              #
            </th>
            <th />
            <th class="text-left">
              Full Name
            </th>
            <th>
              job Description
            </th>
            <th class="text-left inst--email">
              Email Address
            </th>
            <th>
              Contact No.
            </th>
            <th>
              {{ showSearch ? '' : 'Emergency Contact' }}
            </th>
            <th
              class="position-relative rounded-tr-lg"
              style="width: 200px;"
            >
              <div
                v-if="!showSearch"
                class="flex justify-center items-center cursor-pointer"
              >
                <img
                  :src="require('@/assets/images/icons/search-icon-white.svg')"
                  alt="logo"
                  @click="showSearch = true"
                >
              </div>
              <div
                v-if="showSearch"
                class="search_container"
              >
                <input
                  v-model="searchRecords"
                  v-debounce:1s="filterInstructors"
                  type="text"
                  class="text-black search_table outline-0 border-0 rounded-3xl"
                  placeholder="Search by name, email.. "
                  @keydown.enter.prevent="filterInstructors"
                >
                <div class="search_icon">
                  <img
                    v-if="searchRecords.length > 0"
                    :src="require('@/assets/images/icons/close-search.svg')"
                    alt="logo"
                    @click="close"
                  >
                  <img
                    v-else
                    :src="require('@/assets/images/icons/search-icon.svg')"
                    alt="logo"
                    @click="showSearch = false"
                  >
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody
          v-if="instructors.length"
          class="schedule-body"
        >
          <tr
            v-for="(instructor, index) in instructors"
            :key="index"
          >
            <td>{{ instructor.id }}</td>
            <td class="inst--profile">
              <div class="d-flex justify-content-center align-items-center">
                <img
                  alt="Employee"
                  :src="instructor.image ? getUrl(instructor.image) : require('@/assets/images/avatars/default_profile_img.png')"
                  class="rounded-full search-inst-img"
                >
              </div>
            </td>
            <td class="text-left font-weight-bolder inst--fields">
              {{ instructor.firstName }} {{ instructor.lastName }}
            </td>
            <td class="font-weight-bolder base-color-main">
              {{ instructor.description ? instructor.description : '-' }}
            </td>
            <td class="text-left inst--email">
              {{ instructor.email ? instructor.email : '-' }}
            </td>
            <td class="inst--fields">
              {{ instructor.phone ? instructor.phone : '-' }}
            </td>
            <td class="inst--fields">
              {{ instructor.emergency_phone ? instructor.emergency_phone : '-' }}
            </td>
            <td>
              <div class="d-flex justify-content-center align-items-center">
                <div
                  class="d-flex justify-content-center align-items-center gap-4"
                  style="width: 100px;"
                >
                  <img
                    v-b-modal.AddInstructorModal
                    :src="require('@/assets/images/icons/edit-icon.svg')"
                    alt="edit"
                    class="action-icons cursor-pointer"
                    @click="setEditData(instructor)"
                  >
                  <img
                    v-b-modal.deleteModal
                    :src="require('@/assets/images/icons/delete-icon.svg')"
                    alt="delete"
                    class="actions-icon cursor-pointer"
                    @click="delId = instructor.id"
                  >
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <NoRecordFound v-if="!instructors.length" />
    </div>
    <div class="pt-2">
      <Pagination
        v-if="instructors.length"
        :limit="data.limit"
        :offset="data.offset"
        :count="totalRecords"
        @fetch-data="getInstructorsList"
      />
    </div>
    <b-modal
      id="deleteModal"
      size="md"
      centered
      hide-footer
      hide-header
    >
      <DeleteModal @remove="deleteInstructor" />
    </b-modal>
  </div>
</template>

<script>
import makeToast from '@/constants/toast'
import { getInstructors, deleteInstructor } from '@/apiManager/instructors'
import Pagination from '@/components/common/Pagination.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import NoRecordFound from '@/components/common/NoRecordFound.vue'
import DeleteModal from '@/components/deleteModal/DeleteModal.vue'

export default {
  name: 'InstructorListing',
  components: {
    Pagination,
    NoRecordFound,
    DeleteModal,
    SkeletonLoader,
  },

  data() {
    return {
      loading: false,
      instructors: [],
      searchRecords: '',
      showSearch: false,
      data: {
        limit: 5,
        offset: 0,
        filter: '',
      },
      totalRecords: 0,
      delId: '',
    }
  },
  mounted() {
    this.getInstructorsList()
  },
  methods: {
    getInstructorsList() {
      this.loading = true
      getInstructors(this.data)
        .then(response => {
          this.instructors = response.data
          this.totalRecords = response.meta.item_count
          this.loading = false
        })
    },
    getUrl(imagePath) {
      return imagePath ? this.constants.getImageUrl(imagePath) : ''
    },
    filterInstructors() {
      this.data.filter = this.searchRecords
      this.getInstructorsList()
    },
    close() {
      this.data.filter = ''
      this.searchRecords = ''
      this.showSearch = false
      this.getInstructorsList()
    },
    deleteInstructor() {
      deleteInstructor(this.delId, 'DISABLED')
        .then(response => {
          if (response.statusCode === 204) {
            this.$bvModal.hide('deleteModal')
            this.getInstructorsList()
            makeToast(this.$bvToast, 'Instructor deleted successfully', 'success', 'success')
          } else {
            makeToast(this.$bvToast, response.message, 'success', 'success')
          }
          this.$bvModal.hide('deleteModal')
          this.getInstructorsList()
        })
    },
    setEditData(data) {
      this.$emit('setEditData', data)
    },
  },

}
</script>

<style lang="scss">
@import "@/assets/scss/global.scss";
@import '@core/scss/base/core/colors/palette-variables.scss';

.text {
  font-weight: bold;

  &-active {
    color: green;
  }

  &-in-active {
    color: red;
  }
}

.custom-control-primary .custom-control-input:checked ~ .custom-control-label::before, .custom-control-primary .custom-control-input:active ~ .custom-control-label::before {
  background-color: $core-direction-base;
}

.search_table {
  padding: 1rem 5rem 1rem 1rem;
  position: relative;
  z-index: 1;
  margin-right: 2rem;
}

.search_container {
  position: absolute;
  top: 5.5px;
  right: 0;
  display: flex;
  align-items: center;
}

.search_icon {
  position: absolute;
  z-index: 2;
  right: 3.5rem;
  top: 1.2rem;
}

.search_icon:hover {
  cursor: pointer;
}

.search_table[type="text"]::placeholder {
  font-size: 12px;
  font-weight: 400;
}

.remove_focus:focus, .search_table:focus {
  outline: none !important;
  border: none !important;
}

.actions-icon {
  width: 30px;
  height: 30px;
}

.search-inst-img {
  width: 36px;
  height: 36px;
  margin: auto;
}

.inst--profile {
  width: 8rem;
  padding: 0;
}
</style>
