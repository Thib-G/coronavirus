<template>
  <div class="h-100 v-100">
    <BelgiumMapComponent :communes="communes" />
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
    };
  },
  created() {
    this.getCommunes();
  },
  methods: {
    getCommunes() {
      this.appService.getBelgiumCommunes().then((data) => {
        this.communes = data;
      });
    },
  },
  components: {
    BelgiumMapComponent,
  },
};
</script>
