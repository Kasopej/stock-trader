<template>
  <tr>
    <th scope="row">{{ index + 1 }}</th>
    <td>{{ new Date(record.timestamp) }}</td>
    <td>{{ record.type }}</td>
    <td>{{ record.amount }}</td>
    <td>{{ record.location }}</td>
  </tr>
</template>

<script>
export default {
  props: {
    record: {
      type: Object,
    },
    index: Number,
  },
};
</script>

<style></style>
