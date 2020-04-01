<template>
  <svg :width="width" :height="height">
    <defs>
      <linearGradient id="legend-gradient">
        <stop
          v-for="t in ticks"
          :key="t.key"
          :offset="t.offset"
          :stop-color="t.stopColor"
        />
      </linearGradient>
    </defs>
    <g :transform="`translate(${margin.left},${margin.top})`">
      <rect
        class="legend"
        x="0"
        y="0"
        :width="insideWidth"
        :height="insideHeight"
      />
    </g>
    <g
      ref="xAxis"
      class="x-axis"
      :transform="`translate(${margin.left},${margin.top + insideHeight})`"
    />
  </svg>
</template>

<script>
import d3 from '@/assets/d3';

export default {
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    scale: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      margin: {
        top: 5,
        right: 5,
        bottom: 10,
        left: 5,
      },
    };
  },
  mounted() {
    this.updateAxis();
  },
  watch: {
    scale() {
      this.updateAxis();
    },
  },
  computed: {
    ticks() {
      return this.scale.ticks().map((t, i, arr) => ({
        key: `${t}-${i}`,
        offset: `${(100 * i) / arr.length}%`,
        stopColor: this.scale(t),
      }));
    },
    axisScale() {
      return d3.scaleLinear()
        .domain(this.scale.domain())
        .range([0, this.insideWidth]);
    },
    insideWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    insideHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
  },
  methods: {
    updateAxis() {
      d3.select(this.$refs.xAxis)
        .call(
          d3.axisBottom(this.axisScale)
            .ticks(this.insideWidth / 40)
            .tickSize(-this.insideHeight),
        );
    },
  },
};
</script>

<style scoped>
  svg >>> .x-axis line, svg >>> .x-axis path {
    stroke: white;
  }
  rect.legend {
    fill: url(#legend-gradient);
    opacity: 0.6;
  }
</style>
