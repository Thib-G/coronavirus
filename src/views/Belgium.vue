<template>
  <div class="h-100 v-100">
    <BelgiumMapComponent :communes="communes" :last-update="lastUpdate" />
  </div>
</template>

<script>
import AppService from '@/services/app-service';

import BelgiumMapComponent from '@/components/BelgiumMapComponent.vue';

export default {
  data() {
    return {
      appService: AppService,
      communes: {
        type: 'FeatureCollection',
        features: [],
      },
      lastUpdate: new Date(1970, 0, 1),
    };
  },
  created() {
    this.getCommunes();
    this.getLastUpdate();
  },
  methods: {
    getCommunes() {
      this.appService.getBelgiumCommunes().then((data) => {
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
