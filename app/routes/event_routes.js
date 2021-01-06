const express = require('express')

const passport = require('passport')

// pull in Mongoose model for examples
const Event = require('../models/event.js')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /events
router.get('/events', requireToken, (req, res, next) => {
  Event.find()
    .then(events => {
      return events.map(event => event.toObject())
    })
    .then(events => res.status(200).json({ events: events }))
    .catch(next)
})

// CREATE
// POST /events
router.post('/events', requireToken, removeBlanks, (req, res, next) => {
  // set owner of new event to be current User
  req.body.event.owner = req.user.id

  Event.create(req.body.event)
    .then(event => {
      res.status(201).json({ event: event.toObject() })
    })
    .catch(next)
})

module.exports = router
