import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './../components/Home.vue'
import Token from './../components/Token.vue'

Vue.use(VueRouter);

const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'token', path: '/:id', component: Token },
];

export default new VueRouter({
  // mode: 'history',
  routes,
  scrollBehavior() {
    return {x: 0, y: 0, behavior: 'smooth'}
  }
});
