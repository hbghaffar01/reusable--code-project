<template>
  <div class="card-result p-1 my-2">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-5">
          <img
            alt="instructor"
            :src="instructor.profile_picture ? getUrl(instructor.profile_picture) : require('@/assets/images/avatars/default_profile_img.png')"
            class="rounded-full search-emp-img"
          >
          <div>
            <h5 class="text-sm font-medium">
              {{ instructor.username }}
            </h5>
            <p class="text-xs font-normal m-0">
              {{ instructor.email }}
            </p>
          </div>
        </div>
      </div>
      <div>
        <button
          class="invite-btn"
          :class="(addedInstructor.indexOf(instructor) !== -1 || instructor.isEmployee) ? 'inactive-btn' : ''"
          :disabled="addedInstructor.indexOf(instructor) !== -1 || instructor.isEmployee"
          @click="addInstructorToList(instructor)"
        >
          {{ instructor.isEmployee ? 'Already added' : 'Add as Instructor' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  props: {
    instructor: {
      type: Object,
      required: true,
    },
    addedInstructor: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      object: this.instructor,
    }
  },
  methods: {
    addInstructorToList(instructor) {
      this.object = {}
      this.$emit('addInstructor', instructor)
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
