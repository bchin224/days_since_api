const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  info: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

// virtual to calculate elapsed days between event and today
eventSchema.virtual('daysSince').get(function () {
  let dayCounter = 0
  let thisMonth = new Date().getMonth()
  let thisDay = new Date().getDate()
  let thisYear = new Date().getFullYear()
  // this.date pulls info from schema
  let pastMonth = new Date(this.date).getMonth()
  let pastDay = new Date(this.date).getDate()
  let pastYear = new Date(this.date).getFullYear()
  // current month calculation sets all months = 30 days
  if (pastMonth >= thisMonth && thisYear !== pastYear) {
    dayCounter += ((12 - (pastMonth - thisMonth)) * 30)
  } else if (pastMonth < thisMonth) {
    dayCounter += ((thisMonth - pastMonth) * 30)
  }
  if (pastDay >= thisDay) {
    dayCounter += (pastDay - thisDay)
  } else if (pastDay < thisDay) {
    dayCounter += (thisDay - pastDay)
  }
  const yearDiff = thisYear - pastYear
  const yearCalc = ((yearDiff) * 365) - 365
  if (yearCalc >= 0) {
    dayCounter += yearCalc
  }
  // account for leap years
  if (yearDiff >= 4) {
    dayCounter += ((yearDiff) / 4)
  }
  return dayCounter
})

module.exports = mongoose.model('Event', eventSchema)
