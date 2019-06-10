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
      <input type="checkbox" value="" id=${tune.id}> ${tune.title}, ${tune.composer}</label></div>`
  })
  $('#log-message').html(`${display}`)
  $('#my-rep').removeClass('selected')
  $('#full-rep').addClass('selected')
  $('.add').html('Add to My Repertoire')
  $('.remove').addClass('disappear')
  $('.edit').addClass('disappear')
  $('.new-tune-waiting').attr('id', '')
  $('.add').removeClass('new')
  // $('#2').addClass('selected')
}

const signInSuccess = function (data) {
  $('#dropdownMenu2').removeClass('disappear')
  $('list-choice').show()
  $('.search').show()
  $('.reps').show()
  $('form').trigger('reset')
  $('.add').html('Add to My Repertoire')
  $('.add').removeClass('disappear')
  $('#sign-up').hide()
  $('#sign-in').hide()
  $('.step-one').hide()
  $('#full-rep').addClass('selected')
  $('.actions').removeClass('disappear')
  store.user = data.user
  store.user_id = data.user.id
  console.log('user id is', store.user_id)
  console.log('store.user is', store.user)
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

const showTunes = function (data) {
  store.tunes = data.tunes
  let userTunes = []
  userTunes = store.tunes.filter((tune) => tune.user.id === store.user.id)
  console.log('store.tunes is', userTunes)
  let display = ''
  userTunes.forEach(tune => {
    display += `<div><label class="checkbox-inline">
      <input type="checkbox" value="" id=${tune.id}> ${tune.title}, ${tune.composer}</label></div>`
  })
  $('#log-message').html(`${display}`)
  $('#full-rep').removeClass('selected')
  $('#my-rep').addClass('selected')
}

const signOutSuccess = function () {
  $('#dropdownMenu2').addClass('disappear')
  $('.search').hide()
  $('list-choice').hide()
  $('.reps').hide()
  $('#sign-up').show()
  $('#sign-in').show()
  $('#log-message').html('')
  $('.step-one').html('Sign in to access repertoire')
  $('.step-one').show()
  $('.reps').removeClass('selected')
  $('.action').addClass('disappear')
  $('.actions').addClass('disappear')
  $('.remove').removeClass('col-4')
  $('.edit').removeClass('col-4')
  store.tunes = []
}

const changePasswordSuccess = function () {
  $('.change-password-message').html('')
  $('.change-password-message').show()
  $('.change-password-message').html('Password Changed!')
  $('.change-password-message').delay(2000).fadeOut()
}

const changePasswordFailure = function () {
  $('.change-password-message').html('')
  $('.change-password-message').show()
  $('.change-password-message').html('Failure!')
  $('.change-password-message').delay(2000).fadeOut()
}

module.exports = {
  signInSuccess,
  signUpSuccess,
  signOutSuccess,
  changePasswordSuccess,
  changePasswordFailure,
  showMasterTunes,
  showTunes
}
