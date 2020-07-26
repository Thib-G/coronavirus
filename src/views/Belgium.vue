<template>
  <div class="h-100 v-100">
    <BelgiumMapComponent
      :communes="communes"
      :last-update="lastUpdate"
      :options="options"
      v-model="selectedOption"
    />
  </div>
</template>

<script>
import AppService from '@/services/app-service';

import BelgiumMapComponent from '@/components/BelgiumMapComponent.vue';

export default {
  data() {
    const options = [
      { text: 'Total cumulative', value: -1 },
      { text: 'Last 7 days cumulative', value: 7 },
      { text: 'Last 14 days cumulative', value: 14 },
    ];
    return {
      appService: AppService,
      communes: {
        type: 'FeatureCollection',
        features: [],
      },
      lastUpdate: new Date(1970, 0, 1),
      options,
      selectedOption: options[0].value,
    };
  },
  created() {
    this.getCommunes(this.selectedOption);
    this.getLastUpdate();
  },
  watch: {
    selectedOption(newVal) {
      this.getCommunes(newVal);
    },
  },
  methods: {
    getCommunes(days) {
      this.appService.getBelgiumCommunes(days).then((data) => {
        this.communes = data;
      });
    },
    getLastUpdate() {
      this.appService.getBelgiumCommunesLastUpdate().then((data) => {
        this.lastUpdate = data;
      });
    },
  },
  components: {
    BelgiumMapComponent,
  },
};
</script>
