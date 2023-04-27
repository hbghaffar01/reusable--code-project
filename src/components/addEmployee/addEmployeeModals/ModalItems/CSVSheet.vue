<template>
  <div class="table-container">
    <table>
      <thead class="text-center t-head">
        <tr>
          <th>
            #
          </th>
          <th>
            First Name
          </th>
          <th>
            Last Name
          </th>
          <th>
            Email Address
          </th>
        </tr>
      </thead>
      <tbody class="text-center t-body">
        <tr
          v-for="(fileData, index) in tableData"
          :key="index"
          class="text-sm text-black"
        >
          <td>
            {{ index+1 }}
          </td>
          <td class="text-start">
            {{ fileData.firstname }}
          </td>
          <td>
            {{ fileData.lastname }}
          </td>
          <td>
            {{ fileData.email }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CSVSheet',
  props: {
    tableData: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped>
thead th,
tbody td {
  padding: 1rem 3rem;
}

.t-head tr th:nth-child(2), .t-body tr td:nth-child(2) {
  text-align: start;
}

.t-head {
  background-color: white;
}

.table-container {
  height: 400px;
  overflow-y: scroll;
  overflow-x: clip;
}

table {
  width: 100%;
}
</style>
