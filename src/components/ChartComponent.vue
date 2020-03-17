<template>
  <svg :width="outsideWidth" :height="outsideHeight">
    <g :transform="`translate(${margin.left},${margin.top})`">
      <g class="line" ref="line" />
      <g
        :transform="`translate(${scale.x(lastPoint.key)},${scale.y(lastPoint.value)})`"
        class="last-point"
      >
        <circle r="3" />
        <text :x="-5" :y="2">
          {{ dateFormat(lastPoint.key, 'd/M')}}:
          {{ lastPoint.value }}</text>
      </g>
      <g
        :transform="`translate(${scale.x(selected.key)},${scale.y(selected.value)})`"
        class="mouse-point"
        v-if="selected"
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
    <g
      :transform="`translate(${margin.left},${margin.top})`"
      class="overlay"
      ref="overlay"
    >
      <rect ref="overlayRect" :x="0" :y="0" :width="width" :height="height" />
    </g>
  </svg>
</template>

<script>
import dateFormat from 'date-fns/format';

import d3 from '@/assets/d3';
import { event as currentEvent } from 'd3-selection';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    isLogScale: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
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
      selected: null,
    };
  },
  mounted() {
    this.updateAxis();
    this.updatePath();
    this.initMouse();
  },
  watch: {
    scale() {
      this.updateAxis();
      this.updatePath();
    },
  },
  computed: {
    scaleLeft() {
      return this.isLogScale ? d3.scaleLog : d3.scaleLinear;
    },
    series() {
      return this.item.series.filter((d) => d.value > 0);
    },
    outsideWidth() {
      return this.width + this.margin.left + this.margin.right;
    },
    outsideHeight() {
      return this.height + this.margin.top + this.margin.bottom;
    },
    lastPoint() {
      return this.series[this.series.length - 1];
    },
    scale() {
      const x = d3.scaleLinear()
        .domain([
          Math.min(...this.series.map((d) => d.key)) - (1000 * 60 * 60 * 24),
          Math.max(...this.series.map((d) => d.key)),
        ])
        .range([0, this.width]);
      const y = this.scaleLeft()
        .domain([
          this.scaleLeft === d3.scaleLog ? 1 : 0,
          Math.max(...this.series.map((d) => d.value)),
        ])
        .range([this.height, 0]);
      return { x, y };
    },
    line() {
      return d3.line()
        .x((d) => this.scale.x(d.key))
        .y((d) => this.scale.y(d.value));
    },
    seriesInverted() {
      return [...this.series].sort((a, b) => b.key - a.key);
    },
  },
  methods: {
    updatePath() {
      d3.select(this.$refs.line)
        .selectAll('path')
        .data([this.series])
        .join('path')
        .transition(500)
        .attr('d', (d) => this.line(d))
        .attr('stroke', this.color);
    },
    updateAxis() {
      d3.select(this.$refs.axisX).call(
        d3.axisBottom(this.scale.x)
          .tickFormat((d) => dateFormat(d, 'd/M')),
      );
      d3.select(this.$refs.axisY)
        .transition(500)
        .call(
          d3.axisLeft(this.scale.y)
            .ticks(5, '.0f'),
        );
    },
    initMouse() {
      d3.select(this.$refs.overlayRect)
        .on('mousemove', () => {
          const mouse = d3.mouse(currentEvent.target);
          const item = this.seriesInverted.find((d) => this.scale.x(d.key) <= mouse[0]);
          this.selected = item;
        });
    },
  },
};
</script>

<style scoped>
  .line {
    fill: none;
    stroke-width: 2px;
  }
  .last-point > circle, .mouse-point > circle {
    fill: rgb(255, 255, 255, 0.2);
    stroke: black;
    stroke-width: 1px;
  }
  .last-point > text, .mouse-point > text {
    text-anchor: end;
    font-size: 9pt;
  }
  .overlay > rect {
    pointer-events: all;
    fill: none;
    stroke-width: 0;
  }
</style>
