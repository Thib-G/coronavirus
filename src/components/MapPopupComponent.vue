<template>
  <div>
    <h4>{{ item['Country/Region'] }} {{ item['Province/State'] }}</h4>
    <p>
      <ChartComponent :item="item" />
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
  components: {
    ChartComponent,
  },
};
</script>
