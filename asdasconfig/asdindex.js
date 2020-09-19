import VueGoogleCalender from "./calendar/Calendar"

function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component("vue-google-calendar", VueGoogleCalender)
}

const plugin = {
  install
}

let GlobalVue = null
if (typeof window !== "undefined") {
  GlobalVue = window.Vue
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

VueGoogleCalender.install = install

export default VueGoogleCalender
