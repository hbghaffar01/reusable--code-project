<template>
  <div class="custom-container">
    <div class="flex items-center justify-between">
      <div class="title-box">
        <div class="btn-add-activity-list">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="btn-add-activity-list"
          >
            <div
              :class="getButtonClass(activity)"
              @click="toggleActivity(activity)"
            >
              <div class="btn-filter-activity-type-icon-box">
                <img :src="activity.image">
              </div>
              <p class="btn-filter-activity-type-content-box">
                {{ activity.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ScheduleActivityTpes',
  props: ['activities'],
  watch: {
    activities: {
      handler() {
        console.log('Activities prop changed')
      },
      deep: true,
    },
  },
  methods: {
    getButtonClass(activity) {
      return `btn-filter-activity-type-item ${activity.isSelected ? 'category-active' : ''}`
    },
    toggleActivity(activity) {
      this.$emit('onToggleActivity', activity)
    },
  },

}
</script>

<style scoped lang="scss">
.btn-add-activity-list {
  display: flex;
  flex-wrap: wrap;
  column-gap: 13px;
  row-gap: 18px;
  margin-top: 5px;
}

.btn-filter-activity-type-item {
  width: 108.5px;
  height: 115.69px;
  padding: 17px 15px;
  background: #ffffff;
  box-shadow: 0px 22px 40px rgba(0, 0, 0, 0.1);
  border-radius: 11px;
  margin-right: 14px;
  margin-bottom: 20px;
  img {
    filter: invert(0);
  }
  &:hover {
    background: #690FAD;
    cursor: pointer;
    color: #FFFFFF;
    img {
      filter: invert(1);
    }
  }
}

.category-active > img {
  filter: invert(1);
}

.btn-filter-activity-type-item {
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
}

.btn-filter-activity-type-item .btn-filter-activity-type-content-box {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 14.06px;
  text-align: left;
  margin: 0;
}

.btn-add-activity-item button {
  display: inline-flex;
}

.category-active {
  color: #ffffff !important;
  background-color: #690fad !important;

  img {
    filter: invert(1);
  }
}

.btn-add-activity-list .btn-add-activity-list{
  display: block;
  margin-top: 0;
}
.btn-add-activity-list .btn-filter-activity-type-item {
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.btn-add-activity-list .btn-filter-activity-type-icon-box {
  width: 38.11px;
  height: 47.25px;
}
.btn-add-activity-list .btn-filter-activity-type-icon-box img{
  max-height: 47px;
}
</style>
