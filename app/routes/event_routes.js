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

// SHOW
// GET /events/:id
router.get('events/:id', requireToken, removeBlanks, (req, res, next) => {
  Event.findById(req.params.id)
    .then(handle404)
    .then(event => res.status(200).json({ event: event.toObject() }))
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

// UPDATE
// PATCH /events/:id
router.patch('/events/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.event.owner

  Event.findById(req.params.id)
    .then(handle404)
    .then(event => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, event)

      // pass the result of Mongoose's `.update` to the next `.then`
      return event.updateOne(req.body.event)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
