<template>
  <div class="main__div">
    <button
      v-if="currentPage > '1'"
      class="btn-pagination-prev"
      @click="moveToPreviousPage"
    >
      <PreviousArrow />
    </button>
    <div
      v-if="numberOfPages > 1"
      class="pagination-box"
    >
      <ul class="pagination-list d-flex align-items-center">
        <li
          v-for="(paginatedNumber, index) in numberOfPages"
          :key="`${index}-pagination-index${paginatedNumber}`"
          class="pagination-item"
          @click="setCurrentPage(Number(paginatedNumber))"
        >
          <button
            :class="`btn-pagination ${
              Number(currentPage) === Number(paginatedNumber) ? 'active' : ''
            }`"
          >
            {{ paginatedNumber }}
          </button>
        </li>
      </ul>
    </div>
    <button
      v-if="currentPage < numberOfPages"
      class="btn-pagination-next rounded-full"
      @click="moveToNextPage"
    >
      <NextArrow />
    </button>
  </div>
</template>

<script>
import PreviousArrow from '@/components/common/pagination/PreviousArrow.vue'
import NextArrow from '@/components/common/pagination/NextArrow.vue'

export default {
  name: 'Pagination',
  components: { NextArrow, PreviousArrow },
  props: {
    count: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 5,
    },
    offset: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentPage: 1,
      numberOfPages: 0,
      pageOffset: 0,
    }
  },
  watch: {
    count: {
      handler() {
        this.setData()
      },
      deep: true,
    },
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData() {
      this.numberOfPages = Math.ceil(this.count / this.limit)
      this.pageOffset = this.offset
    },
    setCurrentPage(currentPageValue) {
      this.pageOffset = this.limit * (currentPageValue - 1)
      this.currentPage = currentPageValue
      this.fetchData()
    },
    moveToPreviousPage() {
      this.pageOffset = (this.pageOffset - this.limit) < 0 ? 0 : (this.pageOffset - this.limit)
      this.currentPage--
      this.fetchData()
    },
    moveToNextPage() {
      this.pageOffset += this.limit
      this.currentPage++
      this.fetchData()
    },
    fetchData() {
      this.$parent.data.offset = this.pageOffset
      this.$emit('fetch-data')
      this.$emit('onChangeOffset', this.pageOffset)
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/@core/scss/base/core/colors/palette-variables.scss";

.main__div {
  width: fit-content;
  display: flex !important;
  justify-content: center;
  align-items: center !important;
  margin: auto;
}

.pagination-box {
  overflow-x: auto;
  margin-left: auto;
  margin-right: auto;
  max-width: 335px;
}
.pagination-item {
  padding: 6px;
}
.pagination-list{
  margin: auto;
  width: fit-content;
  list-style-type: none;
}
.btn-pagination {
  color: $core-direction-base;
  background-color: #ffffff;
  width: 35px;
  height: 35px;
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: 0;
  text-align: center;
  border-radius: 50%;
  border: 2px solid $core-direction-base;
}
.btn-pagination.active {
  color: $white;
  background-color: $core-direction-base;
  border: none;
  outline: none;
}
.btn-pagination-prev,
.btn-pagination-next {
  background-color: $core-direction-base;
  border: none;
  outline: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.btn-pagination-prev svg,
.btn-pagination-next svg {
  margin: auto;
}
.no-groups {
  text-align: center;
  padding: 50px;
  font-family: "Montserrat", sans-serif;
  font-size: 24px;
  font-weight: 500;
}
</style>
