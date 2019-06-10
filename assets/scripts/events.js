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
    .then(ui.changePasswordSuccess)
    .catch(ui.changePasswordFailure)
}

const onClickMyRepertoire = function () {
  $('.remove').addClass('col-4')
  $('.edit').addClass('col-4')
  $('.add').removeClass('col-12')
  $('.add').addClass('col-4')
  $('.action').removeClass('disappear')
  $('.add').html('New')
  $('.add').addClass('new')
  // $('.new').on('click', onClickNew)
  $('.new-tune-waiting').attr('id', 'new-tune')
  api.indexTunes()
    .then(ui.showTunes)
}

let tuneData = {
  tune: {
    title: 'Sample',
    composer: 'Dr. Ebow'
  }
}

let patchTuneData = {
  tune: {
    title: 'Sample',
    composer: 'Dr. Ebow',
    user_id: store.user_id
  }
}

let tuneId = 0

const onClickNew = function (event) {
  event.preventDefault()
  const input = getFormFields(this)
  console.log('input is', input)
  tuneData.tune.title = input.title
  tuneData.tune.composer = input.composer
  console.log('tune data is', tuneData)
  if (store.tunes.some((storeTune) => {
    return ((storeTune.title === tuneData.tune.title) && (storeTune.composer === tuneData.tune.composer))
  })) {
    alert('Duplicate Found')
  } else {
    api.createTune(tuneData)
      .then(() => console.log('Created a tune!'))
      .then(api.indexTunes)
      .then(ui.showTunes)
  }
}

const onClickEditSubmit = function (event) {
  event.preventDefault()
  const input = getFormFields(this)
  console.log('input is', input)
  patchTuneData.tune.title = input.title
  patchTuneData.tune.composer = input.composer
  console.log('patchTuneData is', patchTuneData)
  if ($('#my-rep').hasClass('selected')) {
    console.log('my rep is selected')
    api.patchTune(tuneId, patchTuneData)
      .then(onClickMyRepertoire)
      .then(() => console.log('Patch success'))
      .catch(() => console.log('Patch failed'))
  }
}

const onClickEdit = function () {
  if ($('#my-rep').hasClass('selected')) {
    console.log('Edit was clicked')
    for (let i = 1; i <= 5000; i++) {
      if ($(`#${i}`).prop('checked')) {
        console.log('checked tune is', $(`#${i}`).parent().text())
        tuneId = i
        console.log('tune Id is', tuneId)
      }
    }
  }
}

// const onClickActions = function (event) {
//   $('#edit-tune-data').on('submit', function (event) {
//     event.preventDefault()
//   })
//   $('#input-tune-data').on('submit', function (event) {
//     event.preventDefault()
//   })
//   // $('#input-tune-data').on('submit', onClickNew)
//   // $('.remove').on('click', deleteCheckedTunes)
//   // $('#edit-tune-data').on('submit', onClickEdit)
//   // $('.actions').on('submit', '#input-tune-data', )
// }

let checkedTunes = []
const addCheckedMasterTunes = function () {
  checkedTunes = []
  console.log('add was clicked')
  console.log('1 is', $('#1').html())
  for (let i = 1; i <= store.masterTunes.length; i++) {
    if ($(`#${i}`).prop('checked')) {
      console.log('checked tune is', $(`#${i}`).parent().text())
      checkedTunes.push($(`#${i}`).parent().text())
    }
  }
  let x = checkedTunes.map((tune) => tune.trim())
  let y = x.map((tune) => tune.split(','))
  let titles = []
  let composers = []
  console.log('checked tunes are', y)
  y.forEach((arr) => titles.push(arr[0]))
  y.forEach((arr) => composers.push(arr[1]))
  console.log('titles', titles)
  console.log('composers', composers)
  for (let i = 0; i < titles.length; i++) {
    tuneData = {
      tune: {
        title: `${titles[i]}`,
        composer: `${composers[i]}`
      }
    }
    api.createTune(tuneData)
      .then(() => console.log('Created a tune!'))
  }
}

const deleteCheckedTunes = function () {
  if ($('#my-rep').hasClass('selected')) {
    for (let i = 1; i <= 5000; i++) {
      if ($(`#${i}`).prop('checked')) {
        console.log('checked tune is', $(`#${i}`).parent().text())
        // deleteIds.push(i)
        api.deleteTune(i)
          .then(onClickMyRepertoire)
          .catch(() => console.log('Delete failed'))
      }
    }
  }
}

const onInputTuneData = function (event) {
  event.preventDefault()
  const newTuneData = getFormFields(this)
  console.log('newTuneData is', newTuneData)
}

// const modsubmit = function (event) {
//   event.preventDefault()
// }

const addHandlers = () => {
  $('#sign-up').on('submit', onSignUp)
  $('#sign-in').on('submit', onSignIn)
  $('#sign-out').on('submit', onSignOut)
  $('#change-password').on('submit', onChangePassword)
  $('#my-rep').on('click', onClickMyRepertoire)
  $('#full-rep').on('click', ui.showMasterTunes)
  $('.add').on('click', addCheckedMasterTunes)
  $('.remove').on('click', deleteCheckedTunes)
  $('.kill-dropdown').click(() => $('#dropdownMenu2').dropdown('toggle'))
  // $('body').on('click', '.edit', onClickEdit)
  $('.edit').on('click', onClickEdit)
  $('body').on('submit', '#input-tune-data', onClickNew)
  $('body').on('submit', '#edit-tune-data', onClickEditSubmit)
  // $('.input-tune-data').on('submit', onInputTuneData)
//   $('.input-tune-data').on('submit', (event) => event.preventDefault)
//   $('.modsub').on('submit', (event) => event.preventDefault)
}

module.exports = {
  addHandlers,
  onClickEdit
}
