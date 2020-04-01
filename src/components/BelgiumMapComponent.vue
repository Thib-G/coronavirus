<template>
  <div class="h-100">
    <div ref="map" class="map h-100" />
    <div class="overlay text-center">
      <div class="small">Incidence (cases/100k inhab.)</div>
      <BelgiumMapLegendComponent
        :height="35"
        :width="220"
        :scale="scaleColor"
      />
    </div>
  </div>
</template>

<script>
import L from 'leaflet';

import d3 from '@/assets/d3';
import basemaps from '@/assets/map/basemaps';

import BelgiumMapLegendComponent from '@/components/BelgiumMapLegendComponent.vue';

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
      this.map = L.map(this.$refs.map, {
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
            layer.on({
              mouseover: () => {
                layer.bringToFront();
                layer.setStyle({ color: 'black' });
              },
              mouseout: () => {
                layer.setStyle({ color: 'grey' });
              },
            });
          },
        });
        this.communesFg.addLayer(layers);
      });
    },
    getIncidence(feature) {
      const p = feature.properties;
      const name = `${p.NameDut || ''} ${p.NameFre || ''} ${p.NameGer || ''}`;
      const cases = p.cases ? p.cases.CASES : '?';
      const pop = p.population ? p.population.POP : 0;
      const incidence = (pop > 0 && cases !== '?') ? ((cases === '<5' ? 5 : +cases) / pop) * 1e5 : 0;
      return {
        name,
        cases,
        pop,
        incidence,
      };
    },
  },
  components: {
    BelgiumMapLegendComponent,
  },
};
</script>

<style scoped>
  .overlay {
    height: 75px;
    width: 240px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 999;
    background-color: rgb(255, 255, 255);
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    padding: 5px;
  }
</style>
