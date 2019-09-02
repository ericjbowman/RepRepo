'use strict'

const events = require('./events.js')

$(() => {
  const https = require('https')
  https.get('https://fast-fjord-28821.herokuapp.com')
  events.addHandlers()
})
