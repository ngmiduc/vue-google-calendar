<template>
  <div
    class="col"
    :class="{ selected: active, 'border-left': day.isoWeekday() != 1 }"
  >
    <div
      class="header"
      :class="{ frst: day.isoWeekday() == 1, lst: day.isoWeekday() == 7 }"
    >
      <span class="dayname">{{ day | moment("dddd") }}</span>
      <span class="daynum">{{ day | moment("D") }}</span>
    </div>

    <div class="column-body">
      <div class="slotgrid">
        <div class="lines" v-for="n in 24" :key="`${n}`">{{ n }}:00</div>
      </div>
      <div class="eventgrid">
        <div
          class="index"
          v-if="$moment().isSame(day, 'day')"
          :style="{ top: scrollPercent + '%' }"
        ></div>

        <calendar-event
          @active="active = $event"
          @deleteEvent="$emit('deleteEvent', $event)"
          @invite="$emit('invite', $event)"
          v-for="(e, index) in positioning"
          :key="index"
          :data="e"
          :contacts="contacts"
        ></calendar-event>
      </div>

      <calendar-edit
        class="editgrid"
        :style="{ zIndex: editing ? 4 : 1 }"
        v-if="!readOnly"
        @edit="editing = $event"
        @createEvent="$emit('createEvent', $event)"
        :editPrecision="precision"
        :block="blockingElements"
        :color="color"
        :contacts="contacts"
      ></calendar-edit>
    </div>
  </div>
</template>

<script>
import CalendarEvent from "./CalendarEvent"
import CalendarEdit from "./CalendarEdit"

export default {
  name: "calendarcolumn",
  components: {
    CalendarEdit,
    CalendarEvent
  },
  props: {
    readOnly: Boolean,
    precision: Number,

    day: Object,
    data: Array,

    color: String,
    contacts: Array
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
    blockingElements() {
      if (!this.data) return []
      return this.data.filter(item => item.type === "slot")
    },

    positioning() {
      if (!this.data) return []
      return this.data
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
.col {
  height: inherit;
  display: flex;
  flex-direction: column;
  z-index: 3;

  &.border-left {
    border-left: 0.025rem solid rgba(0, 0, 0, 0.2);
  }

  &.selected {
    z-index: 4;
  }

  .header {
    border-bottom: 0.025rem solid rgba(0, 0, 0, 0.2);
    padding: 0.6rem 0.5rem;
    background-color: rgba(255, 255, 255, 1);
    color: black;
    display: flex;
    align-items: center;
    justify-content: space-between;

    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 100;

    &.frst {
      // border-top-left-radius: 0.25rem;
    }

    &.lst {
      // border-top-right-radius: 0.25rem;
    }

    &:not(.frst) {
      border-left: 0.025rem solid rgba(0, 0, 0, 0.1);
    }

    .dayname {
      font-size: 0.5rem;
      text-transform: uppercase;
    }
    .daynum {
      font-size: 1.5rem;
    }
  }

  .column-body {
    position: relative;
    flex-grow: 2;
    height: 100%;

    .slotgrid,
    .eventgrid,
    .editgrid {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
    }

    .eventgrid {
      right: 0.5rem;

      .index {
        position: absolute;
        background-color: rgba(255, 0, 0, 0.5);
        left: 0.125rem;
        right: -0.5rem;
        height: 0.05rem;
        z-index: 10;
      }
    }
    .editgrid {
      left: 0.5rem;
    }
  }

  .slotgrid {
    display: grid;
    grid-template-rows: repeat(24, 1fr);
    z-index: 1;

    .lines {
      color: rgba(200, 200, 200, 0.9);
      padding: 0 0.1rem;
      text-align: right;
      /* letter-spacing: 0.01rem; */
      font-size: 0.45rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      user-select: none;

      &:not(:first-child) {
        border-top: 0.025rem solid rgba(0, 0, 0, 0.2);
      }

      &:hover {
        /* background-color: black; */
      }
    }
  }
}
</style>
