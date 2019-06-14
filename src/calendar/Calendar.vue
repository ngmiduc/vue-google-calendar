<template>
  <div class="cal-wrapper">
    <div class="loader" v-if="loading">
      LOADING
    </div>
    <div class="cal" :class="{ loading: loading }" ref="cal">
      <calendar-column
        v-for="(value, name, index) in concatenatedData"
        :data="value"
        :day="days[index]"
        :key="name"
        :precision="precision"
        :readOnly="readOnly"
        :color="color"
        :contacts="contacts"
        :overlapping="overlapping"
        @deleteEvent="$emit('deleteEvent', $event)"
        @createEvent="createEvent(days[index], $event)"
        @invite="$emit('invite', $event)"
      ></calendar-column>
    </div>
  </div>
</template>

<script>
import CalendarColumn from "./CalendarColumn"
import Vue from "vue"
import Component from "vue-class-component"

export default {
  name: "calendar",
  components: { CalendarColumn },
  props: {
    overlapping: Boolean,
    precision: { type: Number, default: 30 },
    readOnly: { type: Boolean, default: false },

    loading: Boolean,

    data: Array,
    selected: Date,

    color: { type: String, default: "#4986e7" },
    contacts: { type: Array, default: () => [] }
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
      let start = this.$moment(this.selected).startOf("isoWeek")
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
      let tmp = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }

      if (this.data)
        this.data.forEach(person =>
          person.dates.forEach(date => {
            let start = this.$moment(date.start.date || date.start.dateTime)
            let end = this.$moment(date.end.date || date.end.dateTime)
            let weekday = this.$moment(start).isoWeekday()

            let e = {
              id: date.id,
              color: person.color,

              owner: person,
              e: date,

              grid: {
                start: this.roundTime(start),
                end:
                  start != end
                    ? this.roundTime(end)
                    : this.roundTime(end.add(this.precision, "minutes")),
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
  },
  methods: {
    addslot(day, { start, end }) {
      let newslot = {}
      let d = day.format("dddd")
      newslot["start"] = this.$moment()
        .day(d)
        .set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
        .add((start - 1) * this.precision, "minutes")
      newslot["end"] = this.$moment()
        .day(d)
        .set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
        .add(end * this.precision, "minutes")

      this.$emit("add", newslot)
    },

    createEvent(day, payload) {
      payload.start = this.$moment(day)
        .set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
        .add((payload.start - 1) * this.precision, "minutes")
      payload.end = this.$moment(day)
        .set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
        .add(payload.end * this.precision, "minutes")

      this.$emit(payload.emit, payload)
    },

    roundTime(t) {
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
  }
}
</script>

<style scoped lang="scss">
.cal-wrapper {
  height: 100%;
  position: relative;
  border: 0.1vmin solid grey;
  border-radius: 0.5vmin;

  .loader {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    z-index: 200;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0.5rem;
  }
}

.cal {
  overflow-y: scroll;
  /* overflow-x: hidden; */
  background-color: white;
  border-radius: 0.25rem;

  height: 100%;
  user-select: none;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 300%;

  &.loading {
    overflow: hidden;
  }
}

.block {
  opacity: 0.5;
  cursor: wait;
}
</style>
