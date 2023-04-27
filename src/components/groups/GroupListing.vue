<template>
  <div>
    <SkeletonLoader v-if="loading" />
    <div
      v-else
      class="w-100 card m-0 table-scroll"
      style="overflow-x: auto; height: max-content"
    >
      <NoRecordFound v-if="!allGroups.length" />
      <table
        v-else
        class="text-center w-100 group-table-resp"
      >
        <thead>
          <tr class="text-white font-weight-bold header-bg">
            <th>#</th>
            <th class="group--profile">
              Profile
            </th>
            <th class="text-left group--title">
              Group Name
            </th>
            <th> Group Type</th>
            <th>Activity Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(group, index) in allGroups"
            :key="index"
          >
            <td>
              {{ group.id }}
            </td>
            <td class="group--profile">
              <div class="d-flex justify-content-center align-items-center">
                <img
                  :src="constants.getImageUrl(group.logo)"
                  class="group-img"
                  alt="group-logo"
                >
              </div>
            </td>
            <td class="text-left group--title">
              {{ group.name }}
            </td>
            <td>
              {{ group.privacy }}
            </td>
            <td>
              {{ getGroupActivitiesType(group.group_activity_types) }}
            </td>
            <td>
              <div class="d-flex justify-content-center align-items-center">
                <img
                  :src="require('@/assets/images/icons/edit-icon.svg')"
                  alt="edit"
                  class="mx-1 action-icons cursor-pointer"
                  @click="editGroup(group)"
                >
                <img
                  v-b-modal.deleteModal
                  :src="require('@/assets/images/icons/delete-icon.svg')"
                  alt="delete"
                  class="action-icons cursor-pointer"
                  @click="delId = group.id"
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-2">
      <Pagination
        v-if="allGroups.length"
        :limit="data.limit"
        :offset="data.offset"
        :count="totalRecords"
        @onChangeOffset="fetchMoreData"
      />
    </div>
    <b-modal
      id="deleteModal"
      size="md"
      centered
      hide-footer
      hide-header
    >
      <DeleteModal @remove="removeGroup" />
    </b-modal>
  </div>
</template>

<script>
import { deleteGroup } from '@/apiManager/groups'
import Pagination from '@/components/common/Pagination.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import DeleteModal from '@/components/deleteModal/DeleteModal.vue'
import NoRecordFound from '@/components/common/NoRecordFound.vue'

export default {
  name: 'GroupListing',
  components: {
    Pagination,
    SkeletonLoader,
    NoRecordFound,
    DeleteModal,
  },
  props: ['data', 'allGroups', 'totalRecords', 'loading'],
  data() {
    return {
      delId: '',
    }
  },
  methods: {
    async removeGroup() {
      const data = await deleteGroup(this.delId)
      if (data.statusCode === 204) {
        this.$bvModal.hide('deleteModal')
        this.makeToast('Group deleted successfully', 'success', 'success')
      }
      this.$bvModal.hide('deleteModal')
      this.$emit('onGroupDeletion')
    },
    makeToast(msg, title, variant) {
      this.$bvToast.toast(msg, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: true,
      })
    },
    fetchMoreData(data) {
      this.$emit('onFetchMoreGroups', data)
    },
    getGroupActivitiesType(groupActivityTypes) {
      if (groupActivityTypes.length) {
        if (groupActivityTypes.length > 1) {
          return `${groupActivityTypes[0].activity_type.name} +${groupActivityTypes.length - 1} more`
        }
        return groupActivityTypes[0].activity_type.name
      }
      return 'N/A'
    },
    editGroup(group) {
      this.$emit('onEditGroup', group)
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/scss/global.scss";
@import '@core/scss/base/core/colors/palette-variables.scss';

.header-bg {
  background: linear-gradient(89.25deg, rgba(93, 13, 153, 0.65) 15.18%, $core-direction-base 100%);
}

.action-icons {
  width: 30px;
  height: 30px;
}

.group-img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

.group--profile {
  width: 10rem;
  padding: 0;
}

.group--title {
  width: 300px;
}

</style>
