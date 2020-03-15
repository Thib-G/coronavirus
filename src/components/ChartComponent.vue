<template>
  <svg :width="outsideWidth" :height="outsideHeight">
    <g :transform="`translate(${margin.left},${margin.top})`">
      <path :d="path" class="line" />
      <g
        :transform="`translate(${scale.x(lastPoint.key)},${scale.y(lastPoint.value)})`"
        class="last-point"
      >
        <circle r="3" />
        <text :x="-5" :y="2">
          {{ dateFormat(lastPoint.key, 'd/M')}}:
          {{ lastPoint.value }}</text>
      </g>
    </g>
    <g
      :transform="`translate(${margin.left},${margin.top + height})`"
      ref="axisX"
      class="axis axis-x"
    />
    <g
      :transform="`translate(${margin.left},${margin.top})`"
      ref="axisY"
      class="axis axis-y"
    />
  </svg>
</template>

<script>
import dateFormat from 'date-fns/format';

import d3 from '@/assets/d3';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dateFormat,
      width: 210,
      height: 150,
      margin: {
        top: 10, right: 10, bottom: 20, left: 50,
      },
    };
  },
  mounted() {
    this.addAxis();
  },
  watch: {
    scale() {
      this.addAxis();
    },
  },
  computed: {
    outsideWidth() {
      return this.width + this.margin.left + this.margin.right;
    },
    outsideHeight() {
      return this.height + this.margin.top + this.margin.bottom;
    },
    lastPoint() {
      return this.item.series[this.item.series.length - 1];
    },
    scale() {
      const x = d3.scaleLinear()
        .domain([
          Math.min(...this.item.series.map((d) => d.key)),
          Math.max(...this.item.series.map((d) => d.key)),
        ])
        .range([0, this.width]);
      const y = d3.scaleLinear()
        .domain([0, Math.max(...this.item.series.map((d) => d.value))])
        .range([this.height, 0]);
      return { x, y };
    },
    line() {
      return d3.line()
        .x((d) => this.scale.x(d.key))
        .y((d) => this.scale.y(d.value));
    },
    path() {
      return this.line(this.item.series);
    },
  },
  methods: {
    addAxis() {
      d3.select(this.$refs.axisX).call(
        d3.axisBottom(this.scale.x)
          .tickFormat((d) => dateFormat(d, 'd/M')),
      );
      d3.select(this.$refs.axisY).call(
        d3.axisLeft(this.scale.y)
          .tickFormat((d) => d.toFixed()),
      );
    },
  },
};
</script>

<style scoped>
  .line {
    fill: none;
    stroke: steelblue;
    stroke-width: 2px;
  }
  .last-point > circle {
    fill: rgb(255, 255, 255, 0.2);
    stroke: black;
    stroke-width: 1px;
  }
  .last-point > text {
    text-anchor: end;
    font-size: 9pt;
  }
</style>
