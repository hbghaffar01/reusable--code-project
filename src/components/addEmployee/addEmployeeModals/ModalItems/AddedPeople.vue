<template>
  <div class="adp-main">
    <div
        class="cancel-btn flex"
        @click="removeAddedEmployee(addedEmployee)"
    />
    <div class="d-flex justify-content-center">
      <img
          class="rounded-full added-people-img"
          :src="addedEmployee.profile_picture ? getUrl(addedEmployee.profile_picture) : require('@/assets/images/avatars/default_profile_img.png')"
          alt="employee"
      >
    </div>
    <div class="my-1 text-center text-dark font-medium-1 email-emp">
      <p class="line-height-2 m-0">
        {{ addedEmployee.email }}
      </p>
      <p class="m-0">
        {{ addedEmployee.username }}
      </p>
    </div>
  </div>
</template>
<script>

export default {
  name: 'AddedPeople',
  props: {
    addedEmployee: {
      type: Object,
      required: true,
    },
  },
  methods: {
    removeAddedEmployee(employee) {
      this.$emit('removeEmployee', employee)
    },
    getUrl(imagePath) {
      return imagePath ? this.constants.getImageUrl(imagePath) : ''
    },
  },
}
</script>

<style scoped lang="scss">

.adp-main {
  width: 25%;

  .email-emp {
    overflow-wrap: break-word;
  }

  .added-people-img {
    width: 100px;
    height: 100px;
  }

  .cancel-btn {
    position: relative;
    margin: 0 0 2rem 0;

    &::before {
      position: absolute;
      content: "";
      width: 20px;
      height: 20px;
      top: 10px;
      right: 40px;
      cursor: pointer;
      background: url('~@/assets/images/modal/Vector.svg') no-repeat center;
    }
  }
}
</style>
