<template>
  <div class="d-flex justify-content-end my-16">
    <button
      class="btn-cancel"
      type="button"
      data-bs-dismiss="modal"
      @click="$emit('onCancelModal')"
    >
      Cancel
    </button>
    <button
      class="btn-create mr-0"
      data-bs-dismiss="modal"
      @click="$emit('onCreateGroup')"
    >{{ isEdit ? "Update" : "Create" }} Group
    </button>
  </div>
</template>

<script>
export default {
  name: 'GroupModalActions',
  props: {
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style scoped>
.business-profile-contact-info-box button {
  max-width: 148px;
  min-width: 148px;
  height: 35px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: center;
  padding: 0;
}
</style>
