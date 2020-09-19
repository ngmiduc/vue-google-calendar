<template>
  <div class="page">
    <calendar
      :data="calendarData"
      :selected="new Date()"
      :precision="60"
    ></calendar>
  </div>
</template>

<script>
import Calendar from "./calendar/Calendar"
import CalendarData from "./test/test.data.js"

export default {
  name: "app",
  components: {
    Calendar
  },
  data() {
    return {
      calendarData: CalendarData
    }
  }
}
</script>

<style lang="scss">
body,
html {
  margin: 0;
}

body {
  background-color: lightgrey;
  height: 100vh;
}

.page {
  height: 100%;
  padding: 50px 60px;
  box-sizing: border-box;
}
</style>
