# vue-google-calendar

VueJs Week Calendar based on Google Calendar API.

## install component (WIP)

`npm i vue-google-calendar`

`import VueGoogleCalendar from "vue-google-calendar/src/vue-google-calendar"`

and use it in your component file

```
<template>
  <vue-google-calendar :data="calendarData"/>
</template>

components: {VueGoogleCalendar}
```

## props

```
props: {
  precision: { type: Number, default: 30 },
  data: Array,
  selected: Date
}
```

## data format of prop data: Array

```
data: [
  {
    id: "test-user2e@test-email.ai",
    summary: "description ....",
    color: "#cd74e6",
    dates: [
      {
        id: "7413lef3g1hip8hvk6tbipkqrq_20200917T140000Z",
        summary: "event name",
        start: { dateTime: "2020-09-17T10:00:00-04:00" },
        end: { dateTime: "2020-09-17T11:00:00-04:00" }
      }
    ]
  }
]
```

![alt text](https://github.com/ngmiduc/vue-google-calendar/blob/master/docs/calendar.png)

![alt text](https://github.com/ngmiduc/vue-google-calendar/blob/master/docs/calendar2.png)
