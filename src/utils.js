export const diffMinutes = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000
  diff /= 60
  return Math.abs(Math.round(diff))
}

export const isBefore = (d1, d2) => {
  return d1.getTime() < d2.getTime()
}
export const isAfter = (d1, d2) => {
  return d1.getTime() > d2.getTime()
}

export const isSame = (d1, d2) => {
  return d1.getTime() === d2.getTime()
}

export const getMonday = d => {
  d = new Date(d)
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

export const addDays = (date, amount) => {
  const d = date
  d.setDate(d.getDate() + amount)
  return d
}
