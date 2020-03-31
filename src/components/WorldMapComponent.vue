<template>
  <div class="map">
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Vue from 'vue';

import basemaps from '@/assets/map/basemaps';

import WorldMapPopupComponent from '@/components/WorldMapPopupComponent.vue';

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export default {
  props: {
    confirmed: {
      type: Array,
      required: true,
    },
    deaths: {
      type: Array,
      required: true,
    },
    recovered: {
      type: Array,
      required: true,
    },
    idx: {
      type: Number,
      required: true,
    },
    selectedCase: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      zoom: 2,
      center: L.latLng([50.465841, 4.857634]),
      pH: 3,
      basemaps: basemaps(),
      map: null,
      circleHoveredStyle: {
        opacity: 1.0,
        fillOpacity: 0.6,
      },
      circleDefaultStyle: {
        color: '#3388FF',
        weight: 1,
        opacity: 0.7,
        fillOpacity: 0.2,
      },
      cases: [
        {
          name: 'confirmed',
          color: '#3388FF',
          fg: L.featureGroup(),
        },
        {
          name: 'recovered',
          color: 'green',
          fg: L.featureGroup(),
        },
        {
          name: 'deaths',
          color: 'darkred',
          fg: L.featureGroup(),
        },
      ],
      popupComponentInstance: null,
    };
  },
  mounted() {
    this.initMap();
    this.update();
  },
  watch: {
    confirmed() {
      this.update();
    },
    deaths() {
      this.update();
    },
    recovered() {
      this.update();
    },
    idx() {
      this.update();
    },
    selectedCase(newVal) {
      if (newVal) {
        this.map.flyTo(newVal.latLng, 5);
      }
    },
  },
  methods: {
    initMap() {
      this.map = L.map(this.$el, {
        center: this.center,
        zoom: this.zoom,
      });
      L.control.layers(this.basemaps).addTo(this.map);
      this.basemaps.light.addTo(this.map);
      this.cases.forEach((c) => {
        c.fg.addTo(this.map);
      });
    },
    update() {
      this.cases.forEach((c) => {
        c.fg.clearLayers();
        this[c.name].forEach((d) => {
          const number = this.idx < d.series.length ? d.series[this.idx].value : 0;
          const circleDefaultStyle = { ...this.circleDefaultStyle, color: c.color };
          if (number > 0) {
            const layer = L.circleMarker(d.latLng, circleDefaultStyle);
            const radius = Math.sqrt(number) / 5;
            layer.setRadius(radius);
            layer.bindTooltip(`<b>${d['Country/Region']} ${d['Province/State']}</b><br />
              ${capitalizeFirstLetter(c.name)}: ${number}`);
            layer.bindPopup();
            layer.on({
              mouseover: (e) => {
                e.target.setStyle(this.circleHoveredStyle);
              },
              mouseout: (e) => {
                e.target.setStyle(circleDefaultStyle);
              },
              popupopen: (e) => {
                this.onPopupOpen(e, d, c.color);
              },
              popupclose: this.onPopupClose,
            });
            c.fg.addLayer(layer);
          }
        });
      });
    },
    onPopupOpen(e, item, color) {
      const { popup } = e;
      const ComponentConstructor = Vue.extend(WorldMapPopupComponent);
      this.popupComponentInstance = new ComponentConstructor({
        propsData: { item, color },
        parent: this,
      }).$mount();
      popup.setContent(this.popupComponentInstance.$el);
    },
    onPopupClose() {
      if (this.popupComponentInstance) {
        this.popupComponentInstance.$destroy();
      }
    },
  },
};
</script>

<style scoped>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
