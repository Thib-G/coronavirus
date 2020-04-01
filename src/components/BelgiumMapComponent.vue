<template>
  <div ref="map" class="map">
  </div>
</template>

<script>
import L from 'leaflet';

import d3 from '@/assets/d3';
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
  computed: {
    scaleColor() {
      const incidences = this.communes.features.map((f) => this.getIncidence(f).incidence);
      const min = Math.min(...incidences);
      const max = Math.max(...incidences);
      return d3.scaleSequential(d3.interpolateGreens)
        .domain([min, max]);
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
          style: () => ({
            weight: 2, color: 'grey', opacity: 0.8, fillOpacity: 0.6,
          }),
          onEachFeature: (feature, layer) => {
            const inc = this.getIncidence(feature);
            layer.setStyle({ fillColor: this.scaleColor(inc.incidence) });
            layer.bindTooltip(`<b>${inc.name}:</b>
              ${inc.cases} cases<br />
              Population: ${inc.pop}<br />
              Incidence: ${inc.cases === '<5' ? '<' : ''}${inc.incidence.toFixed(1)} cases/100k inhab.`);
          },
        });
        this.communesFg.addLayer(layers);
      });
    },
    getIncidence(feature) {
      const name = feature.properties.Name;
      const cases = feature.properties.cases ? feature.properties.cases.CASES : '?';
      const pop = feature.properties.population ? feature.properties.population.POP : 0;
      const incidence = (pop > 0 && cases !== '?') ? ((cases === '<5' ? 5 : +cases) / pop) * 1e5 : 0;
      return {
        name,
        cases,
        pop,
        incidence,
      };
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
