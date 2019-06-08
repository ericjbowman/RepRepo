'use strict'

const getFormFields = require(`../../lib/get-form-fields`)
const api = require('./api')
const ui = require('./ui')
const store = require('./store')

const onSignUp = function (event) {
  event.preventDefault()
  const data = getFormFields(this)
  api.signUp(data)
    .then(ui.signUpSuccess)
    // .catch(ui.signUpFailure)
}

const onSignIn = function (event) {
  event.preventDefault()
  // $('#sign-in').html('')

  const data = getFormFields(this)
  api.signIn(data)
    .then(ui.signInSuccess)
    // .catch(ui.signInFailure)
}

const onSignOut = function (event) {
  event.preventDefault()
  api.signOut()
    .then(ui.signOutSuccess)
    // .catch(ui.signOutFailure)
}

const onChangePassword = function (event) {
  event.preventDefault()
  const data = getFormFields(this)
  api.changePassword(data)
    // .then(ui.changePasswordSuccess)
    // .catch(ui.changePasswordFailure)
}

const onClickMyRepertoire = function () {
  api.indexTunes()
    .then(ui.showTunes)
}

let checkedTunes = []
const addCheckedMasterTunes = function () {
  console.log('add was clicked')
  console.log('1 is', $('#1').html())
  for (let i = 1; i <= store.masterTunes.length; i++) {
    if ($(`#${i}`).prop('checked')) {
      console.log('checked tune is', $(`#${i}`).parent().text())
      checkedTunes.push($(`#${i}`).parent().text())
    }
  }
}

const addCheckedTunes = function () {
  if ($('#my-rep').hasClass('selected')) {
    // let deleteIds = []
    for (let i = 1; i <= 100; i++) {
      if ($(`#${i}`).prop('checked')) {
        console.log('checked tune is', $(`#${i}`).parent().text())
        // deleteIds.push(i)
        api.deleteTune(i)
          .then(onClickMyRepertoire)
          .catch(() => console.log('Delete failed'))
      }
    }
    // console.log('deleteIds are', deleteIds)
  }
}

const addHandlers = () => {
  $('#sign-up').on('submit', onSignUp)
  $('#sign-in').on('submit', onSignIn)
  $('#sign-out').on('submit', onSignOut)
  $('#change-password').on('submit', onChangePassword)
  $('#my-rep').on('click', onClickMyRepertoire)
  $('#full-rep').on('click', ui.showMasterTunes)
  $('.add').on('click', addCheckedMasterTunes)
  $('.remove').on('click', addCheckedTunes)
}

module.exports = {
  addHandlers
}
