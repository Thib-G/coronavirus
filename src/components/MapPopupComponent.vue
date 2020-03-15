<template>
  <div>
    <h4>{{ item['Country/Region'] }} {{ item['Province/State'] }}</h4>
    <p>
      <b-form-checkbox v-model="isLogScale">Log scale</b-form-checkbox>
      <ChartComponent :item="item" :is-log-scale="isLogScale" />
    </p>
  </div>
</template>

<script>
import ChartComponent from '@/components/ChartComponent.vue';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLogScale: false,
    };
  },
  components: {
    ChartComponent,
  },
};
</script>
