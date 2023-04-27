<template>
  <div class="w-100">
    <div class="flex align-items-center w-100 gap-8 mb-2">
      <div
        class="nav-pill-heading"
        style="width: 200px"
      >
        All Activity Listing
      </div>
      <div class="d-flex align-items-center flex-wrap w-100 gap-2 xl:gap-4 2xl:gap-8">
        <SortBYDate
          v-if="!reset"
          :data="data"
          :toggle-filter="toggleFilter"
          @getDateRange="getDateRange"
          @resetDates="resetDates"
        />
        <SortByZone
          v-if="!reset"
          :data="data"
          @filterZones="filterZones"
          @resetFilter="resetFilter"
        />
        <SortBYType
          v-if="!reset"
          :data="data"
          @filterType="filterType"
          @clearFilterType="clearFilterType"
        />
        <SortBYTeam
          v-if="!reset"
          :data="data"
          @filterTeam="filterTeam"
          @clearfilterTeam="clearfilterTeam"
        />
        <div
          v-show="resetAll"
          class="flex align-center gap-2 cursor-pointer"
          @click="resetAllFilter"
        >
          <p class="font-style m-0 base-color-main">
            Reset All
          </p>
          <img :src="require('@/assets/images/modal/Line110.svg')">
        </div>
      </div>
    </div>
    <SkeletonLoader v-if="loading" />
    <div
      v-else
      class="w-100 card table-scroll bg-light"
      style="overflow-x: auto"
    >
      <table
        class="text-center w-100 table-resp table-rows-gap"
      >
        <thead>
          <tr class="text-white font-weight-bold header-bg">
            <th class="rounded-tl-lg">
              #
            </th>
            <th class="text-left">
              Activities Name
            </th>
            <th>
              Activity Type
            </th>
            <th>
              Team
            </th>
            <th>
              Date
            </th>
            <th>
              Activity Time
            </th>
            <th>
              Recurrence
            </th>
            <th>
              Bookings
            </th>
            <th />
            <th class="rounded-tr-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          v-for="(activity, index) in scheduleActivities"
          :key="index"
          class="schedule-body"
        >
          <tr
            v-if="activity.showDate"
            class="table-separator-tr"
          >
            <td
              colspan="9"
              class="table-separator bg-light"
            >
              <div class="w-100 date-container-main flex items-center justify-center">
                <span class="advance-menu-filter-btn flex items-center">
                  {{ activity.schedule_date.split('T')[0] }}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              {{ activity.id }}
            </td>
            <td class="text-left schedule-title">
              {{ activity.activity_schedule.activity.name }}
            </td>
            <td>
              {{ activity.activity_schedule.activity.activity_type.name }}
            </td>
            <td>
              {{ activity.instructor ? activity.instructor.firstName : '-' }}
              {{ activity.instructor ? activity.instructor.lastName : '' }}
            </td>
            <td>
              {{ activity.schedule_date.split('T')[0] }}
            </td>
            <td>
              {{ activity.schedule_date | localTime }} - {{ activity.schedule_date | endTime(activity.duration) }}
            </td>
            <td>{{ activity.is_recurrence ? 'Recurring' : 'Non-Recurring' }}</td>
            <td>
              {{ activity.bookingCount }}/{{ activity.slots }}
            </td>
            <td>
              <div v-if="activity.status !== 'Ending in'" class="status-container gap-8">
                <div class="base-color-main font-style">
                  {{ remainingTimeString }}
                </div>
              </div>
              <div v-else class="status-container gap-8">
                <div class="base-color-main font-style">
                  {{ activity.status }}
                </div>
              </div>
            </td>
            <td>
              <div
                v-if="activity.status !== 'Completed' && activity.status !== 'Ending in'"
                class="status-container gap-4"
              >
                <img
                  :src="require('@/assets/images/icons/edit-icon.svg')"
                  alt="edit"
                  class="action-icons cursor-pointer"
                  @click="setEditData(activity)"
                >
                <img
                  v-if="!activity.bookingCount > 0"
                  v-b-modal.deleteModal
                  :src="require('@/assets/images/icons/delete-icon.svg')"
                  alt="delete"
                  class="action-icons cursor-pointer"
                  @click="
                    delId = activity.id
                  "
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <NoRecordFound v-if="!scheduleActivities.length" />
    </div>
    <Pagination
      v-if="Object.keys(scheduleActivities).length"
      :limit="data.limit"
      :offset="data.offset"
      :count="totalRecords"
      @fetch-data="getActivityListing"
    />

    <b-modal
      id="deleteModal"
      size="md"
      centered
      hide-footer
      hide-header
    >
      <DeleteModal @remove="removeScheduleActivity" />
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import DeleteModal from '@/components/deleteModal/DeleteModal.vue'
import Pagination from '@/components/common/Pagination.vue'
import SortBYDate from '@/components/activtiySchedule/Filter/SortByDate.vue'
import SortBYTeam from '@/components/activtiySchedule/Filter/SortByTeam.vue'
import SortBYType from '@/components/activtiySchedule/Filter/SortByType.vue'
import SortByZone from '@/components/activtiySchedule/Filter/SortByZone.vue'
import { getScheduleActivity, deleteScheduleActivityType } from '@/apiManager/scheduleActivity'
import makeToast from '@/constants/toast'
import NoRecordFound from '@/components/common/NoRecordFound.vue'

export default {
  name: 'ActivitiesListing',
  components: {
    NoRecordFound,
    SkeletonLoader,
    DeleteModal,
    Pagination,
    SortBYDate,
    SortBYTeam,
    SortBYType,
    SortByZone,
  },

  filters: {
    localTime(value) {
      if (!value) return ''
      const date = new Date(value)
      const hours = date.getUTCHours()
      const minutes = date.getUTCMinutes()
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    },
    endTime(value, duration) {
      if (!value) return ''
      const date = new Date(value)
      date.setUTCMinutes(date.getUTCMinutes() + duration)
      const hours = date.getUTCHours()
      const minutes = date.getUTCMinutes()
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    },

  },
  data() {
    return {
      loading: false,
      currentDate: null,
      delId: '',
      status: '',
      resetAll: false,
      data: {
        limit: 10,
        offset: 0,
        activityTypeIds: [],
        activityZoneIds: [],
        instructorIds: [],
        startDate: '',
        endDate: '',
      },
      totalRecords: 0,
      scheduleActivities: [],
      toggleFilter: false,
      reset: false,
      remainingTimeString: '',
    }
  },
  mounted() {
    this.getActivityListing()
    this.remainingTimeString = this.getStatus()
  },
  methods: {
    filterZones(zoneIds) {
      this.data.activityZoneIds = zoneIds
      this.resetAll = true
      this.getActivityListing()
    },
    filterTeam(key) {
      this.data.instructorIds = key
      this.resetAll = true
      this.getActivityListing()
    },
    filterType(key) {
      this.data.activityTypeIds = key
      this.resetAll = true
      this.getActivityListing()
    },
    resetFilter() {
      this.data.activityZoneIds = null
      this.resetAll = false
      this.getActivityListing()
    },
    clearfilterTeam() {
      this.data.instructorIds = null
      this.resetAll = false
      this.getActivityListing()
    },
    clearFilterType() {
      this.data.activityTypeIds = null
      this.resetAll = false
      this.getActivityListing()
    },
    resetAllFilter() {
      this.data.startDate = null
      this.data.endDate = null
      this.data.activityTypeIds = null
      this.data.instructorIds = null
      this.data.activityZoneIds = null
      this.resetAll = false
      this.reset = true
      Vue.nextTick(() => {
        this.reset = false
      })
      this.clearfilterTeam()
      this.clearFilterType()
      this.resetFilter()
      this.resetDates()
      this.getActivityListing()
    },
    getDateRange(dates) {
      this.data.startDate = dates.start
      this.data.endDate = dates.end
      this.resetAll = true
      this.getActivityListing()
    },
    resetDates() {
      this.data.startDate = null
      this.data.endDate = null
      this.getActivityListing()
      this.resetAll = false
    },
    // getStatus(date, duration) {
    //   const current = new Date('2023-04-27T11:47:00.000Z').toISOString()
    //   const startTime = new Date(date).toISOString()
    //   const currDate = current.split('T')[0]
    //   const startDate = startTime.split('T')[0]
    //   if (currDate < startDate) {
    //     return 'Up-coming'
    //   }
    //   if (currDate === startDate) {
    //     if (currDate <= startDate) {
    //       const remainingMin = new Date(startTime) - new Date(current)
    //       if (remainingMin <= 30) {
    //         return 'Check-in-started'
    //       }
    //       return 'On-going'
    //     }
    //     return 'In-progress'
    //   }
    //   if (current + duration >= startTime) {
    //     const remainingTime = (new Date(startTime).getMinutes() + duration) - new Date(current).getMinutes()
    //     let remainingSec = Math.floor(remainingTime / 60)
    //     if (remainingTime <= 10) {
    //       remainingSec = remainingSec < 10 ? `0${remainingSec}` : remainingSec
    //       return remainingTime > 0 ? `Ending in ${remainingTime}:${remainingSec}` : 'Completed'
    //     }
    //     return 'Not-started-yet'
    //   }
    //   if (currDate > startDate) {
    //     return 'Completed'
    //   }
    // },

    getStatus() {
      const date = '2023-04-27T12:01:13.004Z'
      const duration = 17
      const current = new Date().toISOString()
      const startTime = new Date(date).toISOString()
      const currDate = current.split('T')[0]
      const startDate = startTime.split('T')[0]
      const remainingMin = (new Date(startTime).getMinutes() + duration) - new Date(current).getMinutes()
      let remainingTime = remainingMin * 60
      if (currDate < startDate) {
        return 'Up-coming'
      }
      if (currDate === startDate) {
        if (current <= startTime) {
          if (remainingMin <= 30) {
            console.log(remainingTime, 'remainingTime')
            console.log(remainingMin, 'remainingMin')
            return 'Check-in-started'
          }
        }
        if (current >= startTime) {
          if (remainingMin <= 10) {
            const countdown = setInterval(() => {
              const minutes = Math.floor(remainingTime / 60)
              const seconds = remainingTime % 60
              this.remainingTimeString = `Ending in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
              if (seconds === 0) {
                this.remainingTimeString = ''
                Vue.nextTick(() => {
                  this.remainingTimeString = 'completed'
                })
              }
              remainingTime--
              if (remainingTime <= 0) {
                clearInterval(countdown)
              }
            }, 1000)
          }
        }
      }
      if (currDate > startDate) {
        return 'Completed'
      }
    },
    // listing
    async getActivityListing() {
      this.loading = true
      this.previousDate = ''
      getScheduleActivity(this.data)
        .then(response => {
          if (response.statusCode === 200) {
            this.scheduleActivities = response.data
            this.totalRecords = response.meta.item_count
            this.scheduleActivities.forEach(activity => {
              activity.showDate = this.setDateInRow(activity.schedule_date.split('T')[0])
              activity.status = this.getStatus()
            })
          } else {
            console.log(response)
          }
          this.loading = false
        })
    },
    setDateInRow(newDate) {
      if (this.previousDate && this.previousDate === newDate) return false
      this.previousDate = newDate
      return true
    },
    async removeScheduleActivity() {
      const activityId = this.delId
      await deleteScheduleActivityType(activityId).then(response => {
        if (response.statusCode === 200) {
          this.$bvModal.hide('deleteModal')
          makeToast(this.$bvToast, 'Activity deleted successfully', 'success', 'success')
        } else {
          makeToast(this.$bvToast, response.message, 'error', 'danger')
        }
        this.$bvModal.hide('deleteModal')
        this.getActivityListing()
      })
    },

    setEditData(data) {
      this.$emit('setData', data, true)
    },
  },

}
</script>

<style lang="scss">
@import "@/assets/scss/global.scss";
@import '@core/scss/base/core/colors/palette-variables.scss';

.table-separator-tr {
  height: 30px;
  box-shadow: none !important;
}

.table-separator {
  background-color: #f8f8f8 !important;
}

.advance-menu-filter-btn {
  color: $core-direction-base;
  font-size: 16px;
  font-weight: 400;
  line-height: 18.75px;
  padding: 0 1rem;
  position: relative;
  overflow: hidden;
  background-color: #f8f8f8;
}

.date-container-main::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  background: #690FAD;
  margin-right: 10px;
  left: 0;
}

.completed {
  opacity: 0.5;
}

.schedule-card {
  background: #ffffff;
  box-shadow: 0 22px 40px rgba(0, 0, 0, 0.1);
  border-radius: 11px;
  overflow: hidden;
}

.schedule-body tr {
  background: #FFFFFF;
  box-shadow: 1px 3px 7px rgba(0, 0, 0, 0.15);
}

.schedule-body tr:nth-child(odd) {
  background: #FFFFFF !important;
}

.table-rows-gap {
  border-collapse: separate;
  border-spacing: 0 6px;
}

.packagesLogo {
  max-width: 30px;
}

.action-icons {
  width: 25px;
  height: 25px;
}

.action-icons:hover {
  cursor: pointer;
}

.status-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.schedule-title {
  font-style: normal;
  font-weight: 700;
  line-height: 15px;
}
</style>
