import Vue from 'vue';
import VueRouter from 'vue-router';
import World from '../views/World.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/world',
  },
  {
    path: '/world',
    name: 'World',
    component: World,
  },
  {
    path: '/belgium',
    name: 'Belgium',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "belgium" */ '../views/Belgium.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

export default router;
