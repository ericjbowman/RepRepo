const store = require('./store')
const api = require('./api')

const signUpSuccess = function (data) {
  $('.load-log').addClass('disappear')
  $('.step-one').html('Sign-up success')
  $('form').trigger('reset')
}

const showMasterTunes = function () {
  $('#log-message').addClass('dont-move')
  let display = '<h6>Check standards you know and click "Add to Repertoire"</h6>'
  store.masterTunes.forEach(tune => {
    display += `<div><label class="checkbox-inline">
      <input type="checkbox" value="" id=${tune.id}> ${tune.title}, ${tune.composer}</label></div>`
  })
  $('.actions').removeClass('disappear')
  $('#log-message').html(`${display}`)
  $('#my-rep').removeClass('selected')
  $('#full-rep').addClass('selected')
  $('.add').html('Add to My Repertoire')
  $('.remove').addClass('disappear')
  $('.edit').addClass('disappear')
  $('.new-tune-waiting').attr('id', '')
  $('.add').removeClass('new')
  $('#our-rep').removeClass('selected')
  $('.shared').addClass('disappear')
  $('.add').removeClass('disappear')
  $('#image').addClass('disappear')
  $('#search').removeClass('disappear')
  $('#search-results').addClass('disappear')
}

const signInSuccess = function (data) {
  $('.load-log').addClass('disappear')
  $('.actions').removeClass('disappear')
  $('#dropdownMenu2').removeClass('disappear')
  $('list-choice').show()
  $('#search').removeClass('disappear')
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

  api.indexMasterTunes()
    .then((index) => {
      store.masterTunes = index.master_tunes
    })
    .then(showMasterTunes)

  api.indexTunes()
    .then((index) => {
      store.tunes = index.tunes
    })
}

const signInFailure = function () {
  $('.load-log').addClass('disappear')
  $('form').trigger('reset')
  $('.step-one').html('Sign-in failed')
}

const signUpFailure = function () {
  $('.load-log').addClass('disappear')
  $('form').trigger('reset')
  $('.step-one').html('Sign-up failed')
}

const showTunes = function (data) {
  store.tunes = data.tunes
  let userTunes = []
  userTunes = store.tunes.filter((tune) => tune.user.id === store.user.id)
  userTunes.sort(function (a, b) {
    const nameA = a.title.toUpperCase()
    const nameB = b.title.toUpperCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })

  let display = `<h6>${userTunes.length} tunes:</h6>`
  for (let i = 0; i < userTunes.length; i++) {
    display += `<div><label class="checkbox-inline">
      <input type="checkbox" value="" id=${userTunes[i].id}></label><span class=${i}></p></div>`
  }
  $('#log-message').html(`${display}`)
  for (let i = 0; i < userTunes.length; i++) {
    $(`.${i}`).text(' ' + userTunes[i].title + ', ' + userTunes[i].composer)
  }
  $('#full-rep').removeClass('selected')
  $('#our-rep').removeClass('selected')
  $('#my-rep').addClass('selected')
  $('#image').addClass('disappear')
  $('#search').removeClass('disappear')
  $('#search-results').addClass('disappear')
}

const showCombinedTunes = function (combinedTunes) {
  $('.actions').addClass('disappear')
  $('#search-results').addClass('disappear')
  let display = `<h6>Y'all have ${combinedTunes.length} tunes in common:</h6>`
  for (let i = 0; i < combinedTunes.length; i++) {
    display += `<div id=${i}> ${combinedTunes[i].title}, ${combinedTunes[i].composer}</div>`
  }
  $('#log-message').html(`${display}`)
  if (combinedTunes.length === 0) {
    $('#image').removeClass('disappear')
  }
}

const showUsers = function (data) {
  $('#search-results').addClass('disappear')
  $('#image').addClass('disappear')
  $('#our-rep').addClass('selected')
  $('#my-rep').removeClass('selected')
  $('#full-rep').removeClass('selected')
  $('#search').removeClass('disappear')
  const emailList = []
  store.userList = data
  store.userList.users.forEach(tune => emailList.push(tune.email))
  let display = '<h6>Choose 2 or more users and click "Get Shared Repertoire":</h6>'
  const alphaUsers = store.userList.users.sort(function (a, b) {
    const nameA = a.email.toUpperCase()
    const nameB = b.email.toUpperCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })
  alphaUsers.forEach(user => {
    display += `<div><label class="checkbox-inline">
      <input type="checkbox" value="" id=${user.id}> ${user.email}</label></div>`
  })
  $('#log-message').html(`${display}`)
}

const signOutSuccess = function () {
  $('.load-log').addClass('disappear')
  $('#search-results').addClass('disappear')
  $('#image').addClass('disappear')
  $('#dropdownMenu2').addClass('disappear')
  $('list-choice').hide()
  $('.reps').hide()
  $('#sign-up').show()
  $('#sign-in').show()
  $('#log-message').html('')
  $('.step-one').html('Signed Out! Sign in to access repertoire')
  $('.step-one').show()
  $('.reps').removeClass('selected')
  $('.action').addClass('disappear')
  $('.actions').addClass('disappear')
  $('.remove').removeClass('col-4')
  $('.edit').removeClass('col-4')
  $('#search').addClass('disappear')
  store.tunes = []
}

const changePasswordSuccess = function () {
  $('form').trigger('reset')
  $('.change-password-message').html('')
  $('.change-password-message').show()
  $('.change-password-message').html('Password Changed!')
  $('.change-password-message').delay(2000).fadeOut()
}

const changePasswordFailure = function () {
  $('form').trigger('reset')
  $('.change-password-message').html('')
  $('.change-password-message').show()
  $('.change-password-message').html('Failure!')
  $('.change-password-message').delay(2000).fadeOut()
}

module.exports = {
  signInSuccess,
  signUpSuccess,
  signOutSuccess,
  signUpFailure,
  signInFailure,
  changePasswordSuccess,
  changePasswordFailure,
  showMasterTunes,
  showTunes,
  showUsers,
  showCombinedTunes
}
