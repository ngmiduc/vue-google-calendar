<script>
import Vue from "vue"
import VueGoogleCalendar from "@/vue-google-calendar.vue"

import testdata from "./test/test.data.js"

export default Vue.extend({
  name: "ServeDev",
  components: {
    VueGoogleCalendar
  },
  data() {
    return {
      data: testdata
    }
  }
})
</script>

<template>
  <div id="app">
    <vue-google-calendar :data="data" />
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0;
}

body {
  height: 100vh;
}

#app {
  height: 100%;
  padding: 50px;

  box-sizing: border-box;
}
</style>
