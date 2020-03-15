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

export default {
  props: {
    confirmed: {
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
        color: 'red',
      },
      circleDefaultStyle: {
        color: '#3388FF',
        weight: 1,
        opacity: 0.7,
      },
      confirmedFg: L.featureGroup(),
      popupComponentInstance: null,
    };
  },
  mounted() {
    this.initMap();
    this.updateConfirmed();
  },
  watch: {
    confirmed() {
      this.updateConfirmed();
    },
    idx() {
      this.updateConfirmed();
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
      this.confirmedFg.addTo(this.map);
    },
    updateConfirmed() {
      this.confirmedFg.clearLayers();
      this.confirmed.forEach((d) => {
        const number = d.series[this.idx].value;
        if (number > 0) {
          const layer = L.circleMarker(d.latLng, this.circleDefaultStyle);
          const radius = Math.sqrt(number) / 5;
          layer.setRadius(radius);
          layer.bindTooltip(`${number}`);
          layer.bindPopup(`<h4>${d['Province/State']}
            ${d['Country/Region']}</h4><p>Confirmed: ${number}</p>`);
          layer.on({
            mouseover: (e) => {
              e.target.setStyle(this.circleHoveredStyle);
            },
            mouseout: (e) => {
              e.target.setStyle(this.circleDefaultStyle);
            },
            popupopen: (e) => {
              this.onPopupOpen(e, d);
            },
            popupclose: this.onPopupClose,
          });
          this.confirmedFg.addLayer(layer);
        }
      });
    },
    onPopupOpen(e, item) {
      const { popup } = e;
      const ComponentConstructor = Vue.extend(MapPopupComponent);
      this.popupComponentInstance = new ComponentConstructor({
        propsData: { item },
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
