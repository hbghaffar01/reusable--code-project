<template>
  <div class="card-result p-1 my-2">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-5">
          <img
            alt="Employee"
            :src="employee.profile_picture ? getUrl(employee.profile_picture) : require('@/assets/images/avatars/default_profile_img.png')"
            class="rounded-full search-emp-img"
          >
          <div>
            <h5 class="text-sm font-medium">
              {{ employee.username }}
            </h5>
            <p class="text-xs font-normal m-0">
              {{ employee.email }}
            </p>
          </div>
        </div>
      </div>
      <div>
        <button
          class="invite-btn"
          :class="(addedEmployees.indexOf(employee) !== -1 || employee.isEmployee) ? 'inactive-btn' : ''"
          :disabled="addedEmployees.indexOf(employee) !== -1 || employee.isEmployee"
          @click="addEmployeeToList(employee)"
        >
          {{ employee.isEmployee ? 'Already added' : 'Add Employee' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  props: {
    employee: {
      type: Object,
      required: true,
    },
    addedEmployees: {
      type: Array,
      required: true,
    },
  },
  methods: {
    addEmployeeToList(employee) {
      this.$emit('addEmployee', employee)
    },
    getUrl(imagePath) {
      return imagePath ? this.constants.getImageUrl(imagePath) : ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@core/mixins/ui/_button.scss";
@import "@core/mixins/ui/_input.scss";
@import "@core/scss/base/core/colors/palette-variables.scss";

.card-result {
  width: 85%;
  background-color: #F2F5EA;
}

.search-emp-img {
  width: 36px;
  height: 36px;
}

.invite-btn {
  @include button(#F2F5EA, $core-direction-base, $core-direction-base, 100px);
  padding: 8px 18px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}

.inactive-btn {
  @include button($white, #CAA8F5, #CAA8F5, 40px);
  padding: 8px 18px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  cursor: not-allowed;
}

</style>
