const store = require('./store')
const api = require('./api')

const signUpSuccess = function (data) {
  $('#log-message').html('Signed up!')
  $('form').trigger('reset')
}

const showMasterTunes = function () {
  let display = ''
  store.masterTunes.forEach(tune => {
    display += `<div><label class="checkbox-inline">
      <input type="checkbox" value=""> ${tune.title}, ${tune.composer}</label></div>`
  })
  $('#log-message').html(`${display}`)
}

const signInSuccess = function (data) {
  $('form').trigger('reset')
  $('.action').removeClass('disappear')
  $('#sign-up').hide()
  $('#sign-in').hide()
  $('.step-one').hide()
  $('#full-rep').addClass('selected')
  store.user = data.user
  // $('#log-message').html('Signed in!')
  api.indexMasterTunes()
    .then((index) => {
      store.masterTunes = index.master_tunes
    })
    .then((index) => console.log('Index worked', store.masterTunes))
    // .then(() => $('#log-message').html(`${store.masterTunes[0].title}`))
    .then(showMasterTunes)
    // .catch($('#log-message').append(' Index failed!'))
}

const signOutSuccess = function () {
  $('#sign-up').show()
  $('#sign-in').show()
  $('#log-message').html('Signed out!')
  $('#full-rep').removeClass('selected')
}

module.exports = {
  signInSuccess,
  signUpSuccess,
  signOutSuccess
}
