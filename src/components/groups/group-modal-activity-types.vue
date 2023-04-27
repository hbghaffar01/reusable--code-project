<template>
  <div class="title-box">
    <h4 class="activity-listing-title capitalize">
      Add Group Activity Type
    </h4>
    <div class="btn-add-activity-list w-100 d-flex flex-wrap">
      <div
        v-for="activity in activities"
        :key="activity.id"
      >
        <div
          class="cursor-pointer"
          :class="getButtonClass(activity)"
          @click="toggleActivitySelection(activity)"
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
</template>

<script>

export default {
  name: 'GroupModalActivityTypes',
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
    toggleActivitySelection(activity) {
      activity.isSelected = !activity.isSelected
    },
  },

}
</script>

<style scoped lang="scss">
.btn-add-activity-list {
  display: flex;
  flex-wrap: wrap;
  column-gap: 18px;
  row-gap: 18px;
  margin-top: 30px;
}

.btn-filter-activity-type-item {
  width: 104px;
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
    color: #FFFFFF;

    img {
      filter: invert(1);
    }

    .btn-filter-activity-type-content-box {
      color: #fff !important;
    }
  }
}

.category-active > img {
  filter: invert(1);
}

.btn-filter-activity-type-item {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
}

.btn-filter-activity-type-item .btn-filter-activity-type-content-box {
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14.06px;
  color: #000000;
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

  .btn-filter-activity-type-content-box {
    color: #fff !important;
  }
}

.btn-add-activity-list .btn-add-activity-list {
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

.btn-add-activity-list .btn-filter-activity-type-icon-box img {
  max-height: 47px;
}
</style>
