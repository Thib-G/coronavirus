<template>
  <div class="home">
    <h1>Coronavirus <small>Confirmed cases</small></h1>
    <b-row>
      <b-col />
      <b-col cols="9">
        <b-form-input type="range" v-model.number="index" :min="min" :max="max" />
      </b-col>
      <b-col>
        <b-button v-if="isPlaying" @click="stop">Stop</b-button>
        <b-button v-else @click="play">Play</b-button>
      </b-col>
    </b-row>
    <p class="text-center" v-if="dates.length > 0">
      {{ formatISO(dates[index], { representation: 'date' }) }}
    </p>
    <div class="map mb-2">
      <MapComponent :confirmed="confirmed" :idx="index" />
    </div>
  </div>
</template>

<script>
import formatISO from 'date-fns/formatISO';

import AppService from '@/services/app-service';
import MapComponent from '@/components/MapComponent.vue';

export default {
  name: 'Home',
  data() {
    return {
      formatISO,
      appService: AppService,
      confirmed: [],
      index: 0,
      isPlaying: false,
      playing: null,
    };
  },
  created() {
    this.getTimeSeriesConfirmed().then(() => {
      this.index = this.dates.length - 1;
    });
  },
  computed: {
    dates() {
      if (this.confirmed.length === 0) {
        return [];
      }
      return this.confirmed[0].series.map((d) => d.key);
    },
    min() {
      return 0;
    },
    max() {
      return this.dates.length - 1;
    },
  },
  methods: {
    getTimeSeriesConfirmed() {
      return this.appService.getTimeSeriesConfirmed().then((data) => {
        this.confirmed = data;
      });
    },
    play() {
      this.isPlaying = true;
      this.playing = setInterval(() => {
        this.index = (this.index + 1) % (this.max + 1);
      }, 500);
    },
    stop() {
      clearInterval(this.playing);
      this.isPlaying = false;
    },
  },
  components: {
    MapComponent,
  },
};
</script>

<style scoped>
  .map {
    width: 100%;
    height: 600px;
  }
</style>
