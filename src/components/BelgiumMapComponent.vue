<template>
  <div ref="map" class="map">
  </div>
</template>

<script>
import L from 'leaflet';
import basemaps from '@/assets/map/basemaps';

export default {
  props: {
    communes: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      zoom: 8,
      center: L.latLng([50.465841, 4.857634]),
      basemaps: basemaps('&copy; <a href="https://epistat.wiv-isp.be/covid/">https://epistat.wiv-isp.be/covid/</a> | '),
      communesFg: L.featureGroup(),
    };
  },
  mounted() {
    this.initMap();
    this.updateCommunes();
  },
  watch: {
    communes() {
      this.updateCommunes();
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
      this.communesFg.addTo(this.map);
    },
    updateCommunes() {
      this.$nextTick().then(() => {
        this.communesFg.clearLayers();
        const layers = L.geoJson(this.communes, {
          style: () => ({ weight: 2 }),
          onEachFeature: (feature, layer) => {
            layer.bindTooltip(`${feature.properties.Name}:
              ${feature.properties.cases ? feature.properties.cases.CASES : '?'}`);
          },
        });
        this.communesFg.addLayer(layers);
      });
    },
  },
};
</script>

<style scoped>
  .map {
    height: 100%;
    width: 100%;
  }
</style>
