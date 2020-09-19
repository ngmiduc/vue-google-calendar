<template>
  <div class="cal-wrapper">
    <div class="cal" ref="cal">
      <calendar-column
        v-for="(value, name, index) in concatenatedData"
        :key="name"
        :data="value"
        :day="days[index]"
        :precision="precision"
      ></calendar-column>
    </div>
  </div>
</template>

<script>
import CalendarColumn from "./CalendarColumn"

export default {
  name: "calendar",
  components: { CalendarColumn },
  props: {
    precision: { type: Number, default: 30 },

    data: Array,
    selected: Date
  },

  mounted() {
    let now = this.$moment()
    let minutes = now.minutes() + now.hours() * 60

    let scrollPercent = ((minutes - 0) / (60 * 24 - 0)) * (100 - 0) + 0
    this.$refs.cal.scrollTop =
      (scrollPercent / 100) * this.$refs.cal.scrollHeight -
      this.$refs.cal.clientHeight / 2
  },

  computed: {
    days() {
      let result = []

      for (var i = 0; i < 7; i++) {
        result.push(
          this.$moment(this.selected)
            .startOf("isoWeek")
            .add(i, "days")
        )
      }
      return result
    },
    concatenatedData() {
      const roundTime = t => {
        let m = t.minutes()
        let h = t.hours()

        let i = 1
        let ceil = 0
        while (this.precision * i < 60) {
          ceil = this.precision * i
          i++
        }

        if (m > ceil) h++
        m =
          ((((m + this.precision / 2) / this.precision) | 0) * this.precision) %
          60
        t.hours(h)
        t.minutes(m)
        t.seconds(0)
        t.milliseconds(0)
        return t
      }

      let tmp = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: []
      }

      if (this.data)
        this.data.forEach(person =>
          person.dates.forEach(date => {
            let start = this.$moment(date.start.date || date.start.dateTime)
            let end = this.$moment(date.end.date || date.end.dateTime)
            let weekday = this.$moment(start)
              .format("ddd")
              .toLowerCase()

            let e = {
              id: date.id,
              color: person.color,

              owner: person,
              e: date,

              grid: {
                start: roundTime(start),
                end:
                  start != end
                    ? roundTime(end)
                    : roundTime(end.add(this.precision, "minutes")),
                dur:
                  start != end
                    ? Math.round(end.diff(start, "minutes") / this.precision)
                    : Math.round(
                        (end.diff(start, "minutes") + this.precision) /
                          this.precision
                      )
              }
            }

            let multievent = []
            if (date.attendees)
              this.data.forEach(p =>
                p.dates.forEach(i => {
                  if (date.attendees)
                    if (i.id === date.id) {
                      multievent.push(p.color)
                    }
                })
              )
            if (multievent.length > 1) {
              let existAlready = tmp[weekday].find(t => t.id == date.id)
              if (!existAlready) {
                e.color = multievent
                tmp[weekday].push(e)
              }
            } else tmp[weekday].push(e)
          })
        )

      return tmp
    }
  }
}
</script>

<style scoped lang="scss">
.cal-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
  border: 0.1px solid rgba(164, 164, 164, 0.25);
  box-shadow: 0 0 25px 5px rgba(135, 137, 182, 0.2);
  border-radius: 10px;
  overflow: hidden;

  * {
    font-weight: lighter;
    color: rgb(96, 96, 96);
  }

  .cal {
    overflow-y: scroll;
    background-color: white;

    height: 100%;
    user-select: none;

    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 300%;
  }
}
</style>
