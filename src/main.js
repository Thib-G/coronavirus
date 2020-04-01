import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'leaflet/dist/leaflet.css';

import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';

import L from 'leaflet';

import '@/assets/style/app.css';

import App from './App.vue';
import router from './router';

// eslint-disable-next-line
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  // eslint-disable-next-line
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  // eslint-disable-next-line
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // eslint-disable-next-line
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
