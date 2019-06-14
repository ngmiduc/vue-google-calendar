<template>
  <div class="page">
    <div class="buttons" v-if="api">
      <button type="button" name="button" @click="login()">
        google login
      </button>
      <button
        v-if="authorized"
        type="button"
        name="button"
        @click="getCalendars()"
      >
        get calendar list
      </button>
      <button
        v-if="authorized"
        type="button"
        name="button"
        @click="getCalendarData(weekRange)"
      >
        get calendar data
      </button>
    </div>
    <div class="content">
      <calendar
        :data="calendarData"
        :selected="selectedDate"
        :loading="false"
        :precision="15"
        :overlapping="true"
        :contacts="contacts"
        @deleteEvent=""
        @create1v1=""
        @createLecture=""
        @createSlot=""
        @invite=""
      ></calendar>
    </div>
  </div>
</template>

<script>
import Calendar from "./calendar/Calendar"

export default {
  name: "app",
  components: {
    Calendar
  },
  data() {
    return {
      contacts: [],
      selectedDate: new Date(),
      api: null,
      authorized: false,
      calendarList: [],
      calendarData: []
    }
  },

  async created() {
    this.api = await this.$getGapiClient()
  },
  methods: {
    async login() {
      this.$login().then(_ => (this.authorized = true))
    },
    async getCalendars() {
      let {
        result: { items }
      } = await this.api.client.calendar.calendarList.list()
      items.forEach(calendar => this.calendarList.push(calendar))
    },
    async getCalendarData({ from, to }) {
      await Promise.all(
        this.calendarList.map(async (calendar, index) => {
          let c = [
            "#4986e7",
            "#cabdbf",
            "#fa573c",
            "#ffad46",
            "#cd74e6",
            "#b3dc6c",
            "#9fe1e7",
            "#42d692",
            "#b99aff",
            "#fad165"
          ]

          let google = this.calendarList.find(c => c.id === calendar.id)
          google["color"] = c[index % c.length]

          let {
            result: { items }
          } = await this.api.client.calendar.events.list({
            calendarId: calendar.id,
            timeMin: from,
            timeMax: to,
            showDeleted: false,
            singleEvents: true,
            orderBy: "startTime"
          })

          google["dates"] = items

          if (this.calendarData.find(c => c.id == google.id)) {
            this.calendarData.forEach(c => {
              if (c.id == google.id) {
                c = google
              }
            })
          } else {
            this.calendarData.push(google)
          }
        })
      )
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
body {
  margin: 0;
}
.page {
  height: calc(100vh - 2vmin);
  padding: 1vmin;
  background-color: lightgrey;
  display: flex;
  flex-direction: column;

  .content {
    flex-grow: 2;
  }

  .buttons {
    border-bottom: 0.1vmin solid lightgrey;
    margin-bottom: 1vmin;

    button {
      margin: 1vmin;
    }
  }
}
</style>
