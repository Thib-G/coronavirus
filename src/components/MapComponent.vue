<template>
  <div class="map">
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Vue from 'vue';
import { mapBoxKey } from '@/assets/keys';

import MapPopupComponent from '@/components/MapPopupComponent.vue';

// eslint-disable-next-line
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  // eslint-disable-next-line
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  // eslint-disable-next-line
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // eslint-disable-next-line
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

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
  },
  data() {
    const options = { tileSize: 512, maxZoom: 18, zoomOffset: -1 };
    return {
      zoom: 2,
      center: [50.465841, 4.857634],
      pH: 3,
      basemaps: {
        dark: L.tileLayer(
          `https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}@2x?access_token=${mapBoxKey}`,
          {
            attribution: `&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a>
                        &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
            ...options,
          },
        ),
        light: L.tileLayer(
          `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}@2x?access_token=${mapBoxKey}`,
          {
            attribution: `&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a>
                        &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
            ...options,
          },
        ),
        satellite: L.tileLayer(
          `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}@2x?access_token=${mapBoxKey}`,
          {
            attribution: `&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a>
                        &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
            ...options,
          },
        ),
      },
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
  },
  methods: {
    initMap() {
      this.map = L.map(this.$el, {
        center: this.center,
        zoom: this.zoom,
      });
      this.basemaps.light.addTo(this.map);
      L.control.layers(this.basemaps).addTo(this.map);
      this.cases.forEach((c) => {
        c.fg.addTo(this.map);
      });
    },
    update() {
      this.cases.forEach((c) => {
        c.fg.clearLayers();
        this[c.name].forEach((d) => {
          const number = d.series[this.idx].value;
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
      const ComponentConstructor = Vue.extend(MapPopupComponent);
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
