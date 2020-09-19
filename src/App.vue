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
@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap");

body,
html {
  margin: 0;
}

body {
  background-color: lightgrey;
  height: 100vh;
  font-family: "Roboto Condensed", sans-serif;
}

.page {
  height: 100%;
  padding: 50px 60px;
  box-sizing: border-box;
}
</style>
