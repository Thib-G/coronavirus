<template>
  <div id="app" class="h-100 d-flex flex-column">
    <NavbarComponent />
    <div class="h-100">
      <router-view />
    </div>
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
