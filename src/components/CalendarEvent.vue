<template>
  <div
    class="cal-event"
    :style="getPos(data.grid)"
    :class="{ selected: opened }"
  >
    <div class="cal-event-content" :style="getColor" @click="opened = !opened">
      {{ data.e.summary }}
    </div>
  </div>
</template>

<script>
import * as fn from "../utils"

export default {
  name: "calendareventv2",
  props: {
    data: Object
  },
  data() {
    return {
      opened: false
    }
  },
  computed: {
    getColor() {
      const getContrastColor = color => {
        // Counting the perceptive luminance - human eye favors green color...
        const R = parseInt(color[1] + color[2], 16)
        const G = parseInt(color[3] + color[4], 16)
        const B = parseInt(color[5] + color[6], 16)

        const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255

        return luminance > 0.5 ? "#454545" : "#FFFFFF"
      }

      if (Array.isArray(this.data.color)) {
        return { background: this.multicolor(this.data.color) }
      } else
        return {
          backgroundColor: this.data.owner.color,
          color: getContrastColor(this.data.owner.color)
        }
    }
  },
  methods: {
    multicolor(c) {
      let string = "repeating-linear-gradient(45deg"
      let stripe = 50 / c.length
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

    getPos({ start, end, indent, index, indexOf }) {
      //set events into position with indent index absolute position

      let offset = start.getMinutes() + start.getHours() * 60
      let duration = fn.diffMinutes(start, end)

      if (this.opened) {
        return {
          position: "absolute",
          right: "0px",
          left: "2.5px",
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
.cal-event {
  z-index: 2;
  position: relative;
  opacity: 0.95;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgb(222, 222, 222);

  transition: all 50ms;

  &:hover {
    transition: all 250ms;
    opacity: 1;
    cursor: pointer;
    transform: scale(1.025);
  }

  &.selected {
    transition: all 250ms;
    z-index: 100;
    min-height: 40px;
    box-shadow: 5px 5px 20px 0px rgba(109, 126, 135, 0.56);
  }

  .cal-event-content {
    width: 100%;
    height: 100%;
    padding: 4px;

    box-sizing: border-box;

    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 1.5vmin;

    color: #454545;
  }
}
</style>
