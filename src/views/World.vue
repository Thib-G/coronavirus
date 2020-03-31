<template>
  <b-container class="world">
    <b-row>
      <b-col>
        <h1>Coronavirus <small>Confirmed cases, deaths and recovered</small></h1>
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
        <p class="text-center" v-else>Loading</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="map" md="9" sm="12">
        <WorldMapComponent
          :confirmed="confirmed"
          :deaths="deaths"
          :recovered="recovered"
          :idx="index"
          :selected-case="selectedCase"
        />
      </b-col>
      <b-col md="3" sm="12" class="tbl flex-grow overflow-auto">
        <b-form-select v-model="selected" :options="options" size="sm" class="mt-1 mb-1" />
        <WorldDetailComponent
          :cases="this[selected]"
          :idx="index"
          @on-case-selected="setSelected"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p class="small">
          Data:
          <a href="https://github.com/CSSEGISandData/COVID-19/" target="_blank">
            2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository by Johns Hopkins CSSE
          </a>
          <br />
          Source: <a href="https://github.com/Thib-G/coronavirus" target="_blank">Github</a>
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import formatISO from 'date-fns/formatISO';

import AppService from '@/services/app-service';
import WorldMapComponent from '@/components/WorldMapComponent.vue';
import WorldDetailComponent from '@/components/WorldDetailComponent.vue';

export default {
  name: 'Home',
  data() {
    return {
      formatISO,
      appService: AppService,
      confirmed: [],
      deaths: [],
      recovered: [],
      index: 0,
      isPlaying: false,
      playing: null,
      options: ['confirmed', 'recovered', 'deaths'],
      selected: 'confirmed',
      selectedCase: null,
    };
  },
  created() {
    this.getTimeSeriesConfirmed().then(() => {
      this.index = this.dates.length - 1;
    });
    this.getTimeSeriesDeaths();
    this.getTimeSeriesRecovered();
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
    getTimeSeriesDeaths() {
      return this.appService.getTimeSeriesDeaths().then((data) => {
        this.deaths = data;
      });
    },
    getTimeSeriesRecovered() {
      return this.appService.getTimeSeriesRecovered().then((data) => {
        this.recovered = data;
      });
    },
    play() {
      this.isPlaying = true;
      if (this.index === this.max) {
        this.index = 0;
      }
      this.playing = setInterval(() => {
        if (this.index < this.max) {
          this.index += 1;
        } else {
          clearInterval(this.playing);
          this.isPlaying = false;
        }
      }, 500);
    },
    stop() {
      clearInterval(this.playing);
      this.isPlaying = false;
    },
    setSelected(item) {
      this.selectedCase = item;
    },
  },
  components: {
    WorldMapComponent,
    WorldDetailComponent,
  },
};
</script>

<style scoped>
  .map, .tbl {
    height: 500px;
  }
</style>
