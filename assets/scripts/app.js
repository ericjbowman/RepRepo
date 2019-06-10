'use strict'

const events = require('./events.js')

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

$(() => {
  events.addHandlers()
  // $('list-choice').hide()
  $('.reps').hide()
  $('.search').hide()
  // $('.edit').on('click', '#edit-tune-data', data, events.onClickEdit(data))
})
