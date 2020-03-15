<template>
  <div class="h-100">
    <b-table small :items="items" class="small" />
  </div>
</template>

<script>
export default {
  props: {
    cases: {
      type: Array,
      required: true,
    },
    idx: {
      type: Number,
      required: true,
    },
  },
  computed: {
    items() {
      return this.cases.map((row) => ({
        Location: `${row['Province/State']} ${row['Country/Region']}`,
        Total: row.series[this.idx].value,
      })).sort((a, b) => b.Total - a.Total);
    },
  },
};
</script>
