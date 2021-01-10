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

// function to calculate elapsed days between event and today
eventSchema.virtual('daysSince').get(function (date) {
  let dayCounter = 0
  let thisMonth = new Date().getMonth()
  let thisDay = new Date().getDate()
  let thisYear = new Date().getFullYear()
  let pastMonth = new Date(date).getMonth()
  let pastDay = new Date(date).getDate()
  let pastYear = new Date(date).getFullYear()
  if (pastMonth >= thisMonth && thisYear !== pastYear) {
    dayCounter += ((12 - (pastMonth - thisMonth)) * 30) + 5
  } else if (pastMonth < thisMonth) {
    dayCounter += ((thisMonth - pastMonth) * 30) + 5
  }
  if (pastDay >= thisDay) {
    dayCounter += (pastDay - thisDay)
  } else if (pastDay < thisDay) {
    dayCounter += (thisDay - pastDay)
  }
  const yearCalc = ((thisYear - pastYear) * 365) - 365
  if (yearCalc >= 0) {
    dayCounter += yearCalc
  }
  return dayCounter
})

module.exports = mongoose.model('Event', eventSchema)
