<template>
  <div id="app">
    <NavbarComponent />
    <b-container>
      <b-row>
        <b-col>
          <router-view />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue';

export default {
  components: {
    NavbarComponent,
  },
};
</script>
