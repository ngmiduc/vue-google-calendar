<template>
  <div class="cal-column" :class="{ selected: active }">
    <div
      class="cal-column-header"
      :class="{ frst: day.isoWeekday() == 1, lst: day.isoWeekday() == 7 }"
    >
      <span class="dayname">{{ day | moment("dddd") }}</span>
      <span class="daynum">{{ day | moment("D") }}</span>
    </div>

    <div class="cal-column-body">
      <div class="cal-column-body-slotgrid">
        <div
          class="cal-column-body-slotgrid--lines"
          v-for="n in 24"
          :key="`${n}`"
        >
          {{ n }}:00
        </div>
      </div>
      <div class="cal-column-body-eventgrid">
        <div
          class="index"
          v-if="$moment().isSame(day, 'day')"
          :style="{ top: scrollPercent + '%' }"
        ></div>

        <calendar-event
          v-for="(e, index) in positioning"
          :key="index"
          :data="e"
        ></calendar-event>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarEvent from "./CalendarEvent"

export default {
  name: "calendarcolumn",
  components: {
    CalendarEvent
  },
  props: {
    precision: Number,
    day: Object,
    data: Array
  },
  data() {
    return {
      scrollPercent: 0,
      editing: false,
      active: false
    }
  },

  created() {
    let now = this.$moment()
    let minutes = now.minutes() + now.hours() * 60

    this.scrollPercent = ((minutes - 0) / (60 * 24 - 0)) * (100 - 0) + 0
  },
  computed: {
    positioning() {
      if (!this.data) return []
      return [...this.data]
        .sort((a, b) =>
          a.grid.start.isSame(b.grid.start)
            ? b.grid.dur - a.grid.dur
            : a.grid.start.diff(b.grid.start)
        )
        .map(item => {
          let block = this.data.filter(
            i =>
              i.grid.start.isBefore(item.grid.start) &&
              i.grid.end.isAfter(item.grid.start)
          )
          if (block.length == 0) {
            item.grid["indent"] = 0
          } else {
            let maxindent = 1

            block.forEach(i => {
              if (i.grid.indent)
                if (i.grid.indent >= maxindent) maxindent = i.grid.indent + 1
            })

            item.grid["indent"] = maxindent
          }

          let same = this.data.filter(i => i.grid.start.isSame(item.grid.start))

          if (same.length <= 1) {
            item.grid["index"] = null
            item.grid["indexOf"] = null
          } else {
            let index = 1

            same.forEach(i => {
              if (i.grid.index) {
                if (i.grid.index == index) index++
              }
            })

            item.grid["index"] = index
            item.grid["indexOf"] = same.length
          }

          return item
        })
    }
  }
}
</script>

<style scoped lang="scss">
.cal-column {
  height: inherit;
  z-index: 3;

  &.border-left {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }

  .cal-column-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 10px;
    background-color: rgba(240, 240, 240, 1);
    color: black;
    display: flex;
    align-items: center;
    justify-content: space-between;

    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 200;

    .dayname {
      font-size: 16px;
      text-transform: uppercase;
    }
    .daynum {
      font-size: 20px;
    }
  }

  .cal-column-body {
    position: relative;
    height: 100%;

    .cal-column-body-slotgrid,
    .cal-column-body-eventgrid,
    .cal-column-body-editgrid {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
    }

    .cal-column-body-eventgrid {
      right: 15px;

      .index {
        position: absolute;
        background-color: rgba(255, 0, 0, 0.5);
        left: 0px;
        right: -5px;
        height: 10px;
        z-index: 10;
        border-radius: 2px;
      }
    }

    .cal-column-body-slotgrid {
      display: grid;
      grid-template-rows: repeat(24, 1fr);
      z-index: 1;

      .cal-column-body-slotgrid--lines {
        color: rgba(200, 200, 200, 0.9);
        padding: 0 2px;
        text-align: right;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        user-select: none;

        &:not(:first-child) {
          border-top: 1px solid rgba(170, 170, 170, 0.2);
        }
      }
    }
  }
}
</style>
