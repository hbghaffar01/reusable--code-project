<template>
  <div class="filter-box">
    <div
      class="filter-field-box"
      :class="{'active' : toggle}"
    >
      <div
        class="filter-field-header"
        @click="toggleDropdown"
      >
        <button class="btn-activity-filter">
          Sort by Date
          <span class="icon-box">
            <img
              src="../../../assets/images/modal/dropdown-icon.svg"
              class="dropdown-icon ml-1"
              alt=""
            >
          </span>
        </button>
      </div>
      <div class="filter-field-body">
        <!--        <div class="search-field-box">-->
        <!--          <input-->
        <!--            type="text"-->
        <!--            class="search-field"-->
        <!--            placeholder="Search by Zone"-->
        <!--          >-->
        <!--          <img-->
        <!--            src="../../../assets/images/modal/search-icon.svg"-->
        <!--            alt=""-->
        <!--            class="search-icon"-->
        <!--          >-->
        <!--        </div>-->
        <div
          class="sort-by-date"
        >
          <Calender
            :range="range"
            @selectedDate="getDateRange"
          />
        </div>
        <div class="btn-box">
          <button
            class="btn-apply-filter"
            @click="setDates"
          >
            Apply Filter
          </button>
          <button
            class="btn-apply-filter"
            :disabled="!range"
            @click="resetDates"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calender from '@/components/calender/RangeCalender.vue'

export default {
  name: 'ActivityFilters',
  components: {
    Calender,
  },
  props: {
    toggleFilter: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      range: '',
      toggle: this.toggleFilter,
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdown)
  },
  methods: {
    toggleDropdown() {
      this.toggle = !this.toggle
    },
    getDateRange(dateRange) {
      this.range = dateRange
      const dates = dateRange.split('to')
      this.data.startDate = (`${dates[0]}T00:00:01.000Z`).replace(/\s/g, '')
      this.data.endDate = dates.length > 1 ? (`${dates[1]}T00:00:01.000Z`).replace(/\s/g, '') : (`${dates[0]}T00:00:01.000Z`).replace(/\s/g, '')
    },
    setDates() {
      this.$emit('getDateRange', {
        start: this.data.startDate,
        end: this.data.endDate,
      })
      this.toggle = false
    },
    resetDates() {
      this.range = ''
      this.data.startDate = ''
      this.data.endDate = ''
      this.$emit('resetDates')
      this.toggle = true
    },
    closeDropdown(e) {
      if (!this.$el.contains(e.target)) {
        this.toggle = false
      }
    },
  },
}
</script>

<style scoped>
.filter-box {
  width: max-content;
}

.filter-field-box {
  position: relative;
  width: 100%;
  max-width: 200px;
}

.filter-field-box .btn-activity-filter {
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  letter-spacing: 0;
  text-align: left;
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 37px;
  padding: 14px 28px 14px 28px;
  color: #690FAD;
  background-color: #fff;
  border: 1px solid #690FAD;
}

.filter-field-box .filter-field-body {
  display: none;
  position: absolute;
  z-index: 100;
  top: 50px;
  left: -5px;
  right: -5px;
  width: max-content;
  background: #FFFFFF;
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.25);
}

.filter-field-box .filter-field-body .sort-by-date input {
  width: 100%;
}

.filter-field-box .search-field-box {
  position: relative;
  margin-bottom: 10px;
}

.filter-field-box .search-field {
  width: 100%;
  border: none;
  border-bottom: 1px solid #000000;
  font-size: 14px;
  font-style: italic;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0;
  text-align: left;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 30px;
}

.filter-field-box .search-icon {
  position: absolute;
  right: 10px;
  top: 10px;
}

.filter-field-box .location-list {
  width: 100%;
  height: 100%;
  max-height: 185px;
}

.filter-field-box .location-list::-webkit-scrollbar {
  width: 2px;
}

.filter-field-box .location-list::-webkit-scrollbar-track {
  background: transparent;
}

.filter-field-box .location-list::-webkit-scrollbar-thumb {
  background: #690FAD;
}

.filter-field-box .form-group {
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
  padding: 10px;
  column-gap: 10px;
}

.filter-field-box .form-group label {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0;
  text-align: left;
  color: #000000;
}

.filter-field-box .location-list:first-child {
  padding-top: 0;
}

.filter-field-box .location-list:last-child {
  padding-bottom: 0;
}

.filter-field-box input[type=checkbox] {
  accent-color: #690FAD;
}

.filter-field-box .btn-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 15px 20px;
  border-top: 1px solid #CAA8F5;
}

.filter-field-box .btn-apply-filter,
.filter-field-box .btn-reset-filter {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  letter-spacing: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.filter-field-box .btn-apply-filter {
  color: #690FAD;
}

.filter-field-box .btn-reset-filter {
  color: #CAA8F5;
}

.filter-field-box.active .dropdown-icon {
  transform: rotate(180deg);
}

.filter-field-box.active .filter-field-body {
  display: block;
}
</style>
