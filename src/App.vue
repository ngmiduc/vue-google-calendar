<template>
  <div class="page">
    <calendar
      :data="calendarData"
      :selected="selectedDate"
      :precision="60"
    ></calendar>
  </div>
</template>

<script>
import Calendar from "./calendar/Calendar"
import CalendarData from "./test.data.js"

export default {
  name: "app",
  components: {
    Calendar
  },
  data() {
    return {
      selectedDate: new Date(),
      calendarData: CalendarData
    }
  },

  computed: {
    week() {
      return this.$moment(this.selectedDate).isoWeek()
    },
    weekRange() {
      return {
        from: this.startWeek.toISOString(),
        to: this.endWeek.toISOString()
      }
    },
    startWeek() {
      return this.$moment()
        .isoWeek(this.week)
        .startOf("isoWeek")
    },
    endWeek() {
      return this.$moment()
        .isoWeek(this.week)
        .endOf("isoWeek")
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
}

* {
  font-family: "Roboto Condensed", sans-serif;
  font-weight: lighter;
  color: rgb(96, 96, 96);
}

.page {
  height: 100%;
  padding: 50px 60px;
  box-sizing: border-box;
}
</style>
