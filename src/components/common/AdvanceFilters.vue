<template>
  <div class="filter-box">
    <input
      id="filter_check"
      type="checkbox"
      class="hidden"
    >
    <label for="filter_check">
      <img
        id="filter_button"
        :src="require('@/assets/images/filter/filter-icon.png')"
        class="filter-btn"
      >
      <img
        id="cancel_button"
        :src="require('@/assets/images/filter/close-icon.png')"
        class="filter-btn"
      >
    </label>
    <div
      id="filter-div"
      class="filter-sidebar fixed nav-shadow rounded-l-lg transition-all ease duration-500 "
    >
      <h2 class="text-center mt-1 py-1.5 text-black-50 text-base rounded-tl-lg secondary_1">
        Filters
      </h2>
      <form class="w-full px-4 py-1">

        <label class="text-sm font-style">
          User Name
        </label>
        <div class="d-flex justify-content-between gap-4 pb-1">
          <input
            v-model="data.username"
            class="invite-ipt"
            placeholder="Search for username"
            type="text"
          >
        </div>

        <label class="text-sm font-style">
          Email
        </label>
        <div class="d-flex justify-content-between gap-4">
          <input
            v-model="data.email"
            class="invite-ipt"
            placeholder="Search for email"
            type="text"
          >
        </div>

        <!--Filter & Reset Filter Button-->
        <div class="flex items-center justify-evenly my-6">
          <b-button
            class="group-button"
            @click="filter"
          >
            Filter
          </b-button>
          <button
            class="rounded active opacity-75 text-large py-2 px-2 hover:opacity-100"
            @click="reset"
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue'

export default {
  name: 'Filter',
  components: {
    BButton,
  },
  data() {
    return {
      data: {
        username: '',
        email: '',
      },
    }
  },
  methods: {
    filter() {
      this.$emit('filter', this.data)
      document.getElementById('cancel_button').click()
    },
    reset(event) {
      this.data = {}
      this.$emit('reset')
      document.getElementById('cancel_button').click()
      event.preventDefault()
    },
  },
}
</script>

<style scoped lang="scss">
@import "@core/mixins/ui/_button.scss";
@import "@core/mixins/ui/_input.scss";
@import "@core/scss/base/core/colors/palette-variables.scss";

.filter-sidebar {
  width: 350px;
  top: 6rem;
  right: -350px;
  background-color: $core-direction-light;
  position: fixed;
  transition: all 0.3s ease;
  z-index: 999;
  box-shadow: rgba(50, 50, 93, 0.25) 0 13px 27px -5px, rgba(0, 0, 0, 0.3) 0 8px 16px -8px;
}

.filter-hide {
  transform: translateX(-350px);
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

label #cancel_button {
  opacity: 0;
  visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 0.1rem;
  top: 10rem;
}

label #filter_button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 0.1rem;
  top: 10rem;
}

#filter_check:checked ~ .filter-sidebar {
  right: 0;
}

#filter_check:checked ~ label #filter_button {
  margin-right: 350px;
  opacity: 0;
  visibility: hidden;
}

#filter_check:checked ~ label #cancel_button {
  margin-right: 350px;
  opacity: 1;
  visibility: visible;
}

.filter-btn {
  width: 50px;
  padding: 5px;
  background: #690fad;
  transition: all 0.3s ease;

  &:hover {
    cursor: pointer;
  }
}

.invite-ipt {
  width: 100%;
  @include input(10px, $black, 14px, 400, 17px, #CAA8F5, 5px);
}

.group-button {
  width: 100px;
  font-weight: bold;
  @include button($white, $core-direction-base, $core-direction-base, 5px);
  padding: 10px 0;

  &:hover {
    transform: Scale(1.05);
  }
}

</style>
