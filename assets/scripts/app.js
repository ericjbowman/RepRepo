'use strict'

const events = require('./events.js')

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

$(() => {
  const https = require('https')
  https.get('https://fast-fjord-28821.herokuapp.com')
  events.addHandlers()
  // $('list-choice').hide()
  // $('.edit').on('click', '#edit-tune-data', data, events.onClickEdit(data))
})
