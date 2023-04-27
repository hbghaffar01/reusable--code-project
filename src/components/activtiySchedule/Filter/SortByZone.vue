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
          Sort by Zone
          <span class="icon-box">
            <img
              src="@/assets/images/modal/dropdown-icon.svg"
              class="dropdown-icon ml-1"
              alt=""
            >
          </span>
        </button>
      </div>
      <div class="filter-field-body">
        <div class="search-field-box">
          <input
            v-model="searchTerm"
            type="text"
            class="search-field"
            placeholder="Search by Zone"
          >
          <img
            src="@/assets/images/modal/search-icon.svg"
            alt="search"
            class="search-icon"
          >
        </div>
        <ul
          class="location-list"
          role="list"
        >
          <li class="location-item">
            <div class="form-group">
              <input
                id="zone-1"
                v-model="allSelected"
                class="cursor-pointer"
                type="checkbox"
                @click="selectAllZones"
              >
              <label
                class="dropdown-label"
                for="zone-1"
              >
                <span>Select All</span>
              </label>
            </div>
          </li>
          <li
            v-for="(zone, index) in filterItems"
            :key="index"
            class="location-item"
            @click.prevent="setZones(zone.id)"
          >
            <div
              class="form-group gap-2"
            >
              <input
                id="zone-1"
                v-model="zoneIds"
                type="checkbox"
                class="cursor-pointer"
                :value="zone.id"
                :checked="zoneIds && zoneIds.includes(zone.id)"
              >
              <label
                class="dropdown-label"
              >
                <span>{{ zone.title }}</span>
              </label>
            </div>
          </li>
        </ul>
        <div class="btn-box">
          <button
            class="btn-apply-filter"
            @click="filterZones"
          >
            Apply Filter
          </button>
          <button
            class="btn-apply-filter"
            @click="resetFilter"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchZones } from '@/apiManager/zone'

export default {
  name: 'ActivityFilters',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      toggle: false,
      zones: [],
      zoneIds: this.data.activityZoneIds || [],
      selected: [],
      allSelected: false,
      searchTerm: '',
    }
  },
  computed: {
    filterItems() {
      return this.zones.filter(item => (item.title ? item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : item))
    },
  },
  mounted() {
    this.getZone()
    document.addEventListener('click', this.closeDropdown)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdown)
  },
  methods: {
    toggleDropdown() {
      this.toggle = !this.toggle
    },
    closeDropdown(e) {
      if (!this.$el.contains(e.target)) {
        this.toggle = false
      }
    },
    getZone() {
      fetchZones().then(response => {
        this.zones = response.data
      })
    },
    filterZones() {
      this.$emit('filterZones', this.zoneIds)
      this.toggle = false
    },
    selectAllZones() {
      if (this.allSelected === false) {
        this.zoneIds = []
        this.zones.forEach(key => {
          this.zoneIds.push(key.id)
        })
      } else {
        this.zoneIds = []
        this.zones.forEach(key => {
          this.zoneIds.push(key.id === null)
        })
      }
    },
    resetFilter() {
      this.allSelected = false
      this.zoneIds = []
      this.$emit('resetFilter')
      this.toggle = true
      this.searchTerm = ''
    },
    setZones(id) {
      const index = this.zoneIds.indexOf(id)
      if (index === -1) {
        this.zoneIds.push(id)
      } else {
        this.zoneIds.splice(index, 1)
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/@core/mixins/ui/_button.scss";
@import "@/@core/mixins/ui/_input.scss";
@import "@/@core/scss/base/core/colors/palette-variables.scss";

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
  width: calc(100% + 10px);
  padding: 5px;
  background: #FFFFFF;
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.25);
  border-radius: 11px;
}

.filter-field-box .search-field-box {
  position: relative;
  margin-bottom: 10px;
}

.filter-field-box .search-field {
  width: 100%;
  padding: 10px;
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
  overflow-y: auto;
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
  color: mediumpurple;
}

.filter-field-box.active .dropdown-icon {
  transform: rotate(180deg);
}

.filter-field-box.active .filter-field-body {
  display: block;
}
.location-item:hover {
  cursor: pointer;
}
input[type="checkbox"] {
  display: none;
}

input[type="checkbox"] + label::before {
  content: "⬜";
  font-size: 1rem;
  color: transparent;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 10px;
}

input[type="checkbox"]:checked + label::before {
  content: "✔";
  font-size: 1.3rem;
  min-width: 1.4rem;
  background-color: $core-direction-base;
  color: #fff !important;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
}
.dropdown-label {
  margin-bottom: 0;
  cursor: pointer;
  display: contents;
}
</style>
