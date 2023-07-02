import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import VueNumberFormat from 'vue-number-format'
import router from './plugins/routes.js'

Vue.use(VueNumberFormat, {prefix: '', decimal: '.', thousand: ',', precision: 2});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
