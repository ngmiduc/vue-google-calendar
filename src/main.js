import Vue from "vue"
import App from "./App.vue"

import VueGAPI from "vue-gapi"
import { apiConfig } from "../private/keys.js"

Vue.use(VueGAPI, apiConfig)
Vue.use(require("vue-moment"))

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount("#app")
