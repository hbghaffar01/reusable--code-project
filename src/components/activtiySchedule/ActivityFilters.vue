<template>
  <div class="filter-box">
    <div
      class="filter-field-box"
      :class="{'active' : toggleFilter}"
      @click="toggleFilter=!toggleFilter"
    >
      <div class="filter-field-header">
        <button class="btn-activity-filter">
          Sort by Zone
          <span class="icon-box">
            <img
              src="../../assets/images/modal/dropdown-icon.svg"
              class="dropdown-icon"
              alt=""
            >
          </span>
        </button>
      </div>
      <div class="filter-field-body">
        <div class="search-field-box">
          <input
            type="text"
            class="search-field"
            placeholder="Search by Zone"
          >
          <img
            src="../../assets/images/modal/search-icon.svg"
            alt=""
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
                type="checkbox"
              >
              <label
                class="mb-0"
                for="zone-1"
              >Select All</label>
            </div>
          </li>
          <li class="location-item">
            <div class="form-group">
              <input
                id="zone-2"
                type="checkbox"
              >
              <label
                class="mb-0"
                for="zone-2"
              >North Zone</label>
            </div>
          </li>
          <li class="location-item">
            <div class="form-group">
              <input
                id="zone-3"
                type="checkbox"
              >
              <label
                class="mb-0"
                for="zone-3"
              >East Zone</label>
            </div>
          </li>
          <li class="location-item">
            <div class="form-group">
              <input
                id="zone-4"
                type="checkbox"
              >
              <label
                class="mb-0"
                for="zone-4"
              >South Zone</label>
            </div>
          </li>
          <li class="location-item">
            <div class="form-group">
              <input
                id="zone-5"
                type="checkbox"
              >
              <label
                class="mb-0"
                for="zone-5"
              >Zone Name</label>
            </div>
          </li>
          <li class="location-item">
            <div class="form-group">
              <input
                id="zone-6"
                type="checkbox"
              >
              <label
                class="mb-0"
                for="zone-6"
              >Eastern Zone 6</label>
            </div>
          </li>
          <li class="location-item">
            <div class="form-group">
              <input
                id="zone-7"
                type="checkbox"
              >
              <label
                class="mb-0"
                for="zone-7"
              >Eastern Zone 7</label>
            </div>
          </li>
          <li class="location-item">
            <div class="form-group">
              <input
                id="zone-8"
                type="checkbox"
              >
              <label
                class="mb-0"
                for="zone-8"
              >Eastern Zone 8</label>
            </div>
          </li>
        </ul>
        <div class="btn-box">
          <button class="btn-apply-filter">
            Apply Filter
          </button>
          <button class="btn-reset-filter">
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityFilters',
  data() {
    return {
      toggleFilter: false,
    }
  },
}
</script>

<style scoped>
.filter-box {
  padding: 10px 10px 20px 10px;
  width: 15%;
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
  color: #CAA8F5;
}

.filter-field-box.active .dropdown-icon {
  transform: rotate(180deg);
}

.filter-field-box.active .filter-field-body {
  display: block;
}
</style>
