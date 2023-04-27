<template>
  <div class="overflow-hidden w-100">
    <div class="d-flex w-full justify-content-between">
      <div class="nav-pill-heading">
        Employee Listing
      </div>
    </div>
    <SkeletonLoader v-if="loading" />
    <div
      v-else
      class="w-100 card m-0 table-scroll"
      style="overflow-x: auto; height: max-content"
    >
      <table
        class="text-center w-100 emp-table-resp"
      >
        <thead class="position-relative">
          <tr class="text-white font-weight-bold header-bg">
            <th>
              #
            </th>
            <th class="group--profile">
              Profile
            </th>
            <th class="text-left emp--container">
              Full Name
            </th>
            <th class="text-left emp-username-container">
              Username
            </th>
            <th class="text-left emp-contact-container">
              Contact Number
            </th>
            <th class="text-left emp-email-container">
              Email Address
            </th>
            <th
              class="position-relative rounded-tr-lg"
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
                  v-debounce:1s="filterEmployees"
                  type="text"
                  class="text-black search_table outline-0 border-0 rounded-3xl"
                  placeholder="Search by name, email.. "
                  @keydown.enter.prevent="filterEmployees"
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
        <tbody v-if="employees.length">
          <tr
            v-for="(employee, index) in employees"
            :key="index"
          >
            <td>
              {{ employee.id }}
            </td>
            <td class="emp--profile">
              <div class="d-flex justify-content-center align-items-center">
                <img
                  alt="Employee"
                  :src="employee.corporate_company_employee.profile_picture ? getUrl(employee.corporate_company_employee.profile_picture) : require('@/assets/images/avatars/default_profile_img.png')"
                  class="rounded-full search-emp-img"
                >
              </div>
            </td>
            <td class="text-left emp--container font-weight-bolder">
              {{ employee.corporate_company_employee.firstname }} {{ employee.corporate_company_employee.lastname }}
            </td>
            <td class="text-left emp-username-container">
              {{ employee.corporate_company_employee.username }}
            </td>
            <td class="text-left emp-contact-container">
              {{ employee.corporate_company_employee.phone }}
            </td>
            <td class="text-left emp--main">
              {{ employee.corporate_company_employee.email }}
            </td>
            <td>
              <div class="d-flex justify-content-center align-items-center">
                <img
                  v-b-modal.deleteModal
                  :src="require('@/assets/images/icons/delete-icon.svg')"
                  alt="delete"
                  class="mx-1 action-icons"
                  @click="delId = employee.id"
                >
              </div>
            <!--              <div>-->
            <!--                <b-form-checkbox-->
            <!--                  :checked="employee.status === 'ACTIVE'"-->
            <!--                  class="custom-control-primary"-->
            <!--                  name="check-button"-->
            <!--                  switch-->
            <!--                  @change="deleteEmployee(employee)"-->
            <!--                />-->
            <!--              </div>-->
            </td>
          </tr>
        </tbody>
      </table>
      <NoRecordFound v-if="!employees.length" />
    </div>
    <div class="pt-2">
      <Pagination
        v-if="employees.length"
        :limit="data.limit"
        :offset="data.offset"
        :count="totalRecords"
        @fetch-data="getEmployeesList"
      />
    </div>
    <b-modal
      id="deleteModal"
      size="md"
      centered
      hide-footer
      hide-header
    >
      <DeleteModal @remove="deleteEmployee" />
    </b-modal>

  </div>
</template>
<script>
import { deleteEmployee, getEmployees } from '@/apiManager/addEmployee'
import Pagination from '@/components/common/Pagination.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import NoRecordFound from '@/components/common/NoRecordFound.vue'
import DeleteModal from '@/components/deleteModal/DeleteModal.vue'

export default {
  name: 'EmployeeListing',
  components: {
    DeleteModal,
    NoRecordFound,
    Pagination,
    SkeletonLoader,
  },
  data() {
    return {
      loading: false,
      employees: [],
      searchRecords: '',
      showSearch: false,
      data: {
        limit: 10,
        offset: 0,
        key: '',
      },
      totalRecords: 0,
      delId: '',
    }
  },
  mounted() {
    this.getEmployeesList()
  },
  methods: {
    getEmployeesList() {
      this.loading = true
      getEmployees(this.data)
        .then(response => {
          this.employees = response.data
          this.totalRecords = response.meta.item_count
          this.$emit('setTotalEmployeesCount', this.totalRecords)
          this.loading = false
        })
    },
    getUrl(imagePath) {
      return imagePath ? this.constants.getImageUrl(imagePath) : ''
    },
    filterEmployees() {
      this.data.key = this.searchRecords
      this.getEmployeesList()
    },
    close() {
      this.searchRecords = ''
      this.showSearch = false
      this.filterEmployees()
    },
    deleteEmployee() {
      deleteEmployee(this.delId, 'DISABLED')
        .then(response => {
          if (response.statusCode === 200) {
            this.makeToast('Employee deleted Successfully', 'success', 'success')
          } else {
            this.makeToast(response.message, 'Error', 'danger')
          }
          this.$bvModal.hide('deleteModal')
          this.getEmployeesList()
        })
    },
    makeToast(msg, variant, title) {
      this.$bvToast.toast(msg, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: true,
      })
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

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 50px;
}

.search-emp-img {
  width: 36px;
  height: 36px;
  margin: auto;
}

.emp--profile {
  width: 12rem;
  padding: 0;
}
</style>
