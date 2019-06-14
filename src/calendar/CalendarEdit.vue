<template>
  <div
    class="edit-column"
    :style="editgrid"
    @mouseleave="editstate ? reset() : null"
  >
    <div
      class="editbox"
      :class="{ grabbed: editstate || resize || move }"
      @mousedown="startDrag(n)"
      @mouseup="endDrag(n)"
      @mouseenter="drag(n)"
      v-for="n in 24 * (60 / editPrecision)"
      :key="`${n}`"
      :style="{
        gridRowStart: n,
        gridRowEnd: n + 1
      }"
    >
      <!-- <span>{{ $moment('2013-01-01T00:00:00.000').add((n-1)*editPrecision,"m").format("HH:mm")}}</span> -->
    </div>

    <div
      v-if="dragStart && dragEnd"
      class="add"
      :style="{
        gridRowStart: dragStart,
        gridRowEnd: dragEnd + 1,
        zIndex: editstate || resize || move ? 0 : 2,
        backgroundColor: color
      }"
    >
      <div class="resize resize-top" @mousedown="startResize('up')"></div>

      <div class="move" @mousedown="startMove"></div>

      <div class="content" v-popover:creation>
        <div class="text">
          {{
            $moment("2013-01-01T00:00:00.000")
              .add((dragStart - 1) * editPrecision, "m")
              .format("HH:mm")
          }}
          -
          {{
            $moment("2013-01-01T00:00:00.000")
              .add(dragEnd * editPrecision, "m")
              .format("HH:mm")
          }}
        </div>
      </div>

      <div class="resize resize-bottom" @mousedown="startResize('down')"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "calendaredit",
  props: {
    block: { type: Array, default: () => [] },
    editPrecision: Number,
    color: String,
    contacts: Array
  },
  data() {
    return {
      showPopup: false,
      searchContact: "",
      lecture: "",
      tabs: "first",

      interval: 15,

      editstate: false,
      resize: null,
      moveStart: null,
      move: null,
      dragStart: null,
      dragEnd: null
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      var links = this.contacts
      var results = queryString
        ? links.filter(
            item =>
              item.link.toLowerCase().indexOf(queryString.toLowerCase()) ===
                0 ||
              item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
          )
        : links

      cb(results)
    },

    startDrag(n) {
      if (this.showPopup) {
        this.reset()
        return
      }
      this.showPopup = false
      // if (this.checkBoundaries(n)) return
      this.$emit("edit", true)

      if (n == this.dragStart) {
        this.resize = "up"
        return
      }
      if (n == this.dragEnd) {
        this.resize = "down"
        return
      }

      this.dragStart = n
      this.dragEnd = n
      this.editstate = true
    },
    startMove() {
      this.showPopup = false
      this.editstate = true
      this.move = true
    },
    startResize(direction) {
      this.showPopup = false
      this.editstate = true
      this.resize = direction
    },
    endDrag(n) {
      if (this.editstate) {
        this.editstate = false
        this.resize = null
        this.move = null
        this.moveStart = null

        this.showPopup = true
      } else {
        this.showPopup = false
      }
    },

    timeToNumber(t) {
      return (
        t.hours() * (60 / this.editPrecision) +
        t.minutes() / this.editPrecision +
        1
      )
    },

    slotsCollide(n) {
      let collision = false
      this.block.forEach(slot => {
        let slotStart = this.timeToNumber(slot.start)
        let slotEnd = this.timeToNumber(slot.end) - 1

        if (
          (this.dragStart <= slotEnd && this.dragStart >= slotStart) ||
          (this.dragEnd >= slotStart && this.dragEnd <= slotEnd) ||
          (this.dragStart <= slotStart && this.dragEnd >= slotEnd)
        )
          collision = true
      })

      return collision
    },

    checkBoundaries(n) {
      let collision = false
      this.block.forEach(slot => {
        let slotStart = this.timeToNumber(slot.start)
        let slotEnd = this.timeToNumber(slot.end) - 1

        if (
          (n >= slotStart && n <= slotEnd) ||
          (n >= slotStart && n <= slotEnd) ||
          (this.dragStart <= slotEnd && n >= slotEnd) ||
          (this.dragEnd >= slotStart && n <= slotEnd)
        )
          collision = true
      })

      return collision
    },

    drag(n) {
      if (!!this.resize) {
        if (this.resize == "up") {
          this.dragStart = n
        } else if (this.resize == "down") this.dragEnd = n
        return
      }

      if (this.move) {
        if (!this.moveStart) this.moveStart = n

        let upper = this.dragStart - (this.moveStart - n)
        this.dragStart = upper

        if (this.dragStart < 1) this.dragStart = 1

        let lower = this.dragEnd - (this.moveStart - n)
        this.dragEnd = lower

        let max = 24 * (60 / this.editPrecision)
        if (this.dragEnd > max) this.dragEnd = max

        if (this.moveStart) this.moveStart = n

        if (this.dragEnd - this.dragStart < 3) this.reset()

        return
      }

      if (!this.editstate) return

      if (n < this.dragStart) {
        this.dragStart = n
        return
      }

      this.dragEnd = n
    },

    reset() {
      this.$emit("edit", false)
      this.endDrag()
      if (this.resize || this.move) return
      this.dragStart = null
      this.dragEnd = null
      this.showPopup = false
    },

    deleteSlot(id) {
      this.$emit("delete", id)
    },

    createSlot() {
      let e = {
        emit: "createSlot",
        start: this.dragStart,
        end: this.dragEnd,
        interval: this.interval
      }
      this.reset()
      this.$emit("createEvent", e)
    },
    create1v1() {
      let e = {
        emit: "create1v1",
        start: this.dragStart,
        end: this.dragEnd,
        contact: this.searchContact
      }
      this.reset()
      this.$emit("createEvent", e)
    },
    createLecture() {
      let e = {
        emit: "createLecture",
        start: this.dragStart,
        end: this.dragEnd,
        title: this.lecture
      }
      this.reset()
      this.$emit("createEvent", e)
    },
    addSlot() {
      let newslot = {
        start: this.dragStart,
        end: this.dragEnd
      }
      this.reset()
      this.$emit("add", newslot)
    }
  },

  computed: {
    range() {
      return {
        start: this.dragStart,
        end: this.dragEnd
      }
    },
    editgrid() {
      return {
        display: "grid",
        gridTemplateRows: `repeat(${24 * (60 / this.editPrecision)}, 1fr)`
      }
    }
  }
}
</script>

<style scoped lang="scss">
.creationpopup {
  padding: 0;

  .el-radio-group {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;

    .el-radio {
      text-align: left;
      margin: 0.2rem 0;

      .el-radio__label {
        margin-left: 0.3rem;
      }
    }
  }

  .el-tabs {
    border: none;
    box-shadow: none;

    .el-tabs__nav {
      display: flex;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .el-tabs__item {
      margin: 0 !important;
      padding: 0 0.5rem !important;
      width: 100%;
      text-align: center;
      border-right: none !important;
      border-left: none !important;
      border-top: none !important;
      background-color: white !important;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tab-pane {
      h3 {
        font-weight: bold;
        margin-bottom: 1rem;
        text-transform: uppercase;
      }
      .el-autocomplete {
        width: 100%;
      }
      .buttons {
        margin-top: 1rem;
        text-align: right;

        .el-input {
          margin: 2rem 0;
        }
      }
    }
  }
}

.edit-column {
  /* background-color: rgba(255, 255, 255, 0.8); */

  .slot {
    cursor: pointer;

    &:hover {
      border: 0.05rem solid navy;
    }
  }

  .add,
  .slot {
    /* border: 0.05rem solid blue; */
    /* background-color: rgba(0, 0, 255, 0.75); */
    /* margin: 0.15rem; */

    opacity: 0.9;
    grid-column: 1 / 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;

    border-radius: 0.3rem;
    box-shadow: 5px 5px 20px 0px rgba(0, 0, 0, 0.5);

    .content {
      position: absolute;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.5rem;
      cursor: default;
      color: white;
    }

    .move {
      flex-grow: 2;

      &:hover {
        cursor: grab;
        /* background-color: rgba(0, 0, 255, 0.1); */
      }
    }

    .resize {
      height: 0.5rem;
      /* background-color: rgba(0, 0, 255, 0.1); */

      &:hover {
        cursor: grab;
        background-color: rgba(0, 0, 255, 0.2);
      }
    }

    .buttons {
      margin-left: 0.5rem;
      z-index: 1;
      .el-button {
        cursor: pointer;
        padding: 0;
        margin: 0;
        height: 20px;
        width: 20px;
      }
    }
  }

  .editbox {
    background-color: transparent;
    /* border-top: 0.05rem solid rgba(200, 200, 200, 0.1); */
    grid-column: 1 / 2;
    z-index: 1;
    cursor: default;
    user-select: none;
    position: relative;
    color: transparent;

    span {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      padding: 0 0.1rem;
      margin: 0;

      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 0.4rem;
      color: inherit;
    }

    &:hover {
      /* border: 0.05rem solid rgba(0, 0, 255, 0.25); */
      /* background-color: rgba(0, 0, 255, 0.1); */
      /* border-radius: 0.185rem;
      cursor: grab;
      color: black; */
    }
    &.grabbed {
      cursor: grabbing;
      background-color: transparent;
      border: none;
      color: transparent;
    }
  }
}
</style>
