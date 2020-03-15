<template>
  <div id="app" class="h-100 d-flex flex-column">
    <NavbarComponent />
    <b-container fluid class="h-100">
      <router-view />
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
