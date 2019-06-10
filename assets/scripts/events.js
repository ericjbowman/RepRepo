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
  // $('.shared').addClass('add')
  $('.shared').addClass('disappear')
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
  if ($('#my-rep').hasClass('selected')) {
  event.preventDefault()
  $('#new-tune-message').html('Create a tune')
  const input = getFormFields(this)
  console.log('input is', input)
  tuneData.tune.title = input.title
  tuneData.tune.composer = input.composer
  console.log('tune data is', tuneData)
  if (store.tunes.some((storeTune) => {
    return ((storeTune.title === tuneData.tune.title) && (storeTune.composer === tuneData.tune.composer))
  })) {
    $('#new-tune-message').html('No Duplicates!')
  } else {
    api.createTune(tuneData)
      .then(() => console.log('Created a tune!'))
      .then(() => $('#new-tune-message').html('Success'))
      .then(api.indexTunes)
      .then(ui.showTunes)
      .then(() => $('form').trigger('reset'))
      .catch(() => $('#new-tune-message').html('Failure'))
  }
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
      .then(() => $('#edit-tune-message').html('Success'))
      .then(() => console.log('Patch success'))
      .then(() => $('form').trigger('reset'))
      .catch(() => $('#edit-tune-message').html('Failure'))
  }
}

const onClickEdit = function () {
  $('#edit-tune-message').html('Edit a tune')
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
      .then($('#add-success').modal('show'))
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
let checkedUserTunes = []

const findCommonTunes = function () {
  console.log('second checked user tunes is', checkedUserTunes[1])
  let combinedTunes = []
  for (let i = 0; i < checkedUserTunes[0].length; i++) {
    checkedUserTunes[1].forEach(tune => {
      if (tune.title === checkedUserTunes[0][i].title) {
        combinedTunes.push(tune)
      }
    })
  }
  console.log('combined tunes are', combinedTunes)
  ui.showCombinedTunes(combinedTunes)
}

const findOurTunes = function () {
  checkedUserTunes = []
  console.log('something is checked!!')
  // let checkedUserTunes = []
  for (let i = 1; i <= 5000; i++) {
    if ($(`#${i}`).prop('checked')) {
      console.log('something is checked!!')
      store.userList.users.forEach(user => {
        if (user.id === i) {
          checkedUserTunes.push(user.tunes)
        }
      })
    }
  }
  console.log('checked user tunes is ', checkedUserTunes)
  findCommonTunes()
}

const onInputTuneData = function (event) {
  event.preventDefault()
  const newTuneData = getFormFields(this)
  console.log('newTuneData is', newTuneData)
}

// const modsubmit = function (event) {
//   event.preventDefault()
// }
// const poplulateStoreUserList = function (data) {
//   store.userList = data
//   console.log('data is ', data)
// }

const onClickOurRep = function () {
  $('.shared').removeClass('disappear')
  $('.add').addClass('disappear')
  $('.remove').addClass('disappear')
    $('.edit').addClass('disappear')
  // $('.add').removeClass('add')
  // $('.add').addClass('shared')
  // $('.shared').on('click', findOurTunes)
  api.indexUsers()
    .then(ui.showUsers)
    // .then((data) => console.log(data))
    // .then((data) => {
    //   store.userList = data
    // })
    // .then((data) => console.log('store.userList is', store.userList))
    // .then(ui.showUsers)
}

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
  $('body').on('click', '.shared', findOurTunes)
  $('#our-rep').on('click', onClickOurRep)
  $('.find-our-tunes').on('click', findOurTunes)
  // $('.input-tune-data').on('submit', onInputTuneData)
//   $('.input-tune-data').on('submit', (event) => event.preventDefault)
//   $('.modsub').on('submit', (event) => event.preventDefault)
}

module.exports = {
  addHandlers,
  onClickEdit
}
