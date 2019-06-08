const store = require('./store')
const api = require('./api')

const signUpSuccess = function (data) {
  $('#log-message').html('Signed up!')
}


const showMasterTunes = function () {
  let display = ''
  store.masterTunes.forEach(tune => {
    display += `<div>${tune.title}, ${tune.composer}</div>`
  })
  $('#log-message').html(`${display}`)
}

const signInSuccess = function (data) {
  $('#sign-up').hide()
  $('#sign-in').hide()
  $('.step-one').hide()
  $('#full-rep').addClass('selected')
  store.user = data.user
  $('#log-message').html('Signed in!')
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
}

module.exports = {
  signInSuccess,
  signUpSuccess,
  signOutSuccess
}
