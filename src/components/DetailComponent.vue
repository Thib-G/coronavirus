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
      return this.cases.map((row) => {
        const evol = this.idx > 0
          ? (row.series[this.idx].value - row.series[this.idx - 1].value)
          : 0;
        return {
          Location: `${row['Province/State']} ${row['Country/Region']}`,
          Total: row.series[this.idx].value,
          Evol: evol > 0 ? `+${evol}` : `${evol}`,
        };
      }).sort((a, b) => b.Total - a.Total);
    },
  },
};
</script>
