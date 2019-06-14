<template>
  <div
    class="cal-popover-overlap"
    :style="getPos(data.grid)"
    :class="{ selected: opened }"
  >
    <div class="content" :style="getColor">
      {{ data.e.summary }}
    </div>
  </div>
</template>

<script>
export default {
  name: "calendareventv2",
  props: {
    data: Object,
    contacts: Array
  },
  data() {
    return {
      opened: false
    }
  },
  computed: {
    getColor() {
      if (Array.isArray(this.data.color)) {
        return { background: this.multicolor(this.data.color) }
      } else return { backgroundColor: this.data.owner.color }
    }
  },
  methods: {
    activate(value) {
      this.opened = value
      this.$emit("active", value)
    },

    multicolor(c) {
      let string = "repeating-linear-gradient(45deg"
      let stripe = 100 / c.length
      for (var i = 0; i < c.length; i++) {
        string += `,${c[i]} ${stripe * i}%, ${c[i]} ${stripe * (i + 1)}%`
      }
      string += ")"
      return string
    },

    timeToPercent(t) {
      //set top position of event block
      let percent = (t - 0) / (60 * 24 - 0)
      let outputX = percent * (100 - 0) + 0
      return outputX + "%"
    },
    durationToPercent(l) {
      //set height of event block
      let percent = (l - 0) / (60 * 24 - 0)
      let outputX = percent * (100 - 0) + 0
      return outputX + "%"
    },

    getPos({ start, end, dur, indent, index, indexOf }) {
      //set events into position with indent index absolute position

      let offset = start.minutes() + start.hours() * 60
      let duration = end.diff(start, "minutes")

      if (this.opened) {
        return {
          position: "absolute",
          right: "-0.5rem",
          // width: "100%",
          left: "0.25rem",
          top: this.timeToPercent(offset),
          height: this.durationToPercent(duration)
        }
      }
      let width = 90

      if (index !== null) width = width / indexOf
      let indentSize = 5

      let left = indent * indentSize
      if (index !== null) {
        left = left + width * (index - 1)
      }
      if (indent > 0 && index == null) width = width - indent * indentSize
      if (indent > 0 && index !== null) {
        width = (95 - indent * (indentSize + 1)) / indexOf

        left = indent * (indentSize + 1) + width * (index - 1)
      }

      let indentreset = 4

      if (indent > indentreset && index == null) {
        left = indentSize * (indent % indentreset)
        width = 95
      }

      if (indent > indentreset && index !== null) {
        width = (95 - (indent % indentreset) * (indentSize + 1)) / indexOf
        left =
          (indent % indentreset) * (indentSize + 1) +
          width * ((index % indentreset) - 1)
      }

      return {
        position: "absolute",
        // right: right + "rem",
        width: width + "%",
        left: left + "%",
        top: this.timeToPercent(offset),
        height: this.durationToPercent(duration)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cal-popover-overlap {
  z-index: 2;
  position: relative;

  .content {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-size: 1.5vmin;

    overflow: hidden;
    border: 0.1vmin solid white;
    border-radius: 0.25vmin;

    padding: 1vmin;

    position: absolute;
    top: 0.15vmin;
    left: 0.15vmin;
    bottom: 0.15vmin;
    right: 0.15vmin;
  }

  &.selected {
    border-radius: 0.3rem;
    z-index: 10;
    min-height: 40px;
    box-shadow: 5px 5px 20px 0px rgba(0, 0, 0, 07.5);
  }
}
</style>
