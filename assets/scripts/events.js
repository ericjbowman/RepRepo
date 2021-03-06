'use strict'

const getFormFields = require(`../../lib/get-form-fields`)
const api = require('./api')
const ui = require('./ui')
const store = require('./store')

let numChecked = 0

const onSignUp = function (event) {
  event.preventDefault()
  const data = getFormFields(this)
  $('.load-log').removeClass('disappear')
  api.signUp(data)
    .then(ui.signUpSuccess)
    .catch(ui.signUpFailure)
}

const onSignIn = function (event) {
  event.preventDefault()
  $('.load-log').removeClass('disappear')
  const data = getFormFields(this)
  api.signIn(data)
    .then(ui.signInSuccess)
    .catch(ui.signInFailure)
}

const onSignOut = function (event) {
  event.preventDefault()
  $('.load-log').removeClass('disappear')
  api.signOut()
    .then(ui.signOutSuccess)
}

const onChangePassword = function (event) {
  event.preventDefault()
  const data = getFormFields(this)
  api.changePassword(data)
    .then(ui.changePasswordSuccess)
    .catch(ui.changePasswordFailure)
}

const onClickMyRepertoire = function () {
  $('#search-results').html('')
  $('#log-message').html('')
  $('#log-message').addClass('dont-move')
  $('.actions').removeClass('disappear')
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
  $('.load-tunes').removeClass('disappear')
  api.indexTunes()
    .then(ui.showTunes)
    .then(() => $('.load-tunes').addClass('disappear'))
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
  if ($('#my-rep').hasClass('selected')) {
    const input = getFormFields(this)
    tuneData.tune.title = input.title
    tuneData.tune.composer = input.composer
    const userTunes = store.tunes.filter((tune) => tune.user.id === store.user.id)
    if (userTunes.every((tune) => {
      return ((tune.title.toUpperCase().replace(/\s/g, '') !== tuneData.tune.title.toUpperCase().replace(/\s/g, '')) || ((tune.composer.toUpperCase().replace(/\s/g, '') !== tuneData.tune.composer.toUpperCase().replace(/\s/g, '')) && ((tune.composer.toUpperCase().replace(/\s/g, '') !== ` ${tuneData.tune.composer.toUpperCase().replace(/\s/g, '')}`))))
    })) {
      api.createTune(tuneData)
        .then(() => $('#new-tune-message').html('Success'))
        .then(api.indexTunes)
        .then(ui.showTunes)
        .then(onClickMyRepertoire)
        .then(() => $('form').trigger('reset'))
        .catch(() => $('#new-tune-message').html('Failure'))
    } else {
      $('#new-tune-message').html('That tune already exists!')
      $('form').trigger('reset')
    }
  }
}

const onClickEditSubmit = function (event) {
  event.preventDefault()
  const input = getFormFields(this)
  patchTuneData.tune.title = input.title
  patchTuneData.tune.composer = input.composer
  if ($('#my-rep').hasClass('selected')) {
    const userTunes = store.tunes.filter((tune) => tune.user.id === store.user.id)
    if (tuneId === 0) {
      $('#edit-tune-message').html('Check a Tune to Edit')
    } else if (userTunes.every((tune) => {
      return ((tune.title.toUpperCase().replace(/\s/g, '') !== patchTuneData.tune.title.toUpperCase().replace(/\s/g, '')) || ((tune.composer.toUpperCase().replace(/\s/g, '') !== patchTuneData.tune.composer.toUpperCase().replace(/\s/g, '')) && ((tune.composer.toUpperCase().replace(/\s/g, '') !== ` ${patchTuneData.tune.composer.toUpperCase().replace(/\s/g, '')}`))))
    })) {
      api.patchTune(tuneId, patchTuneData)
        .then(onClickMyRepertoire)
        .then(() => $('#edit-tune-message').html('Success'))
        .then(() => $('form').trigger('reset'))
        .catch(() => $('#edit-tune-message').html('Failure'))
    } else {
      $('#edit-tune-message').html('That Tune Already Exists')
      $('form').trigger('reset')
    }
  }
}

const storeTunes = function (data) {
  store.tunes = data.tunes
}

const onClickEdit = function () {
  const greatestTuneIndex = store.tunes.reduce((tune1, tune2) => (tune1.id > tune2.id) ? tune1 : tune2)
  $('#edit-tune-data').removeClass('disappear')
  $('#edit-tune-message').html('Edit a tune')
  tuneId = 0
  numChecked = 0
  $('#edit-tune-message').html('Edit a tune')
  if ($('#my-rep').hasClass('selected')) {
    for (let i = 1; i <= greatestTuneIndex.id; i++) {
      if ($(`#${i}`).prop('checked')) {
        tuneId = i
        numChecked++
      }
    } if (numChecked !== 1) {
      $('#edit-tune-data').addClass('disappear')
      $('#edit-tune-message').html('Check 1 tune')
    }
  }
}

let checkedTunes = []
const checkedTuneIndexes = []
const indexAndstore = function () {
  api.indexTunes()
    .then(storeTunes)
}
const addCheckedMasterTunes = function () {
  if ($('#full-rep').hasClass('selected')) {
    checkedTunes = []
    for (let i = 1; i <= store.masterTunes.length; i++) {
      if ($(`#${i}`).prop('checked')) {
        checkedTuneIndexes.push(i)
        checkedTunes.push($(`#${i}`).parent().text())
      } else {
        $('#add-success-message').html('Check at least 1 tune')
        $('#add-success').modal('show')
      }
    }

    const x = checkedTunes.map((tune) => tune.trim())
    const y = x.map((tune) => tune.split(','))
    const titles = []
    const composers = []
    y.forEach((arr) => titles.push(arr[0]))
    y.forEach((arr) => composers.push(arr[1]))
    const userTunes = []
    store.tunes.forEach((tune) => {
      if (tune.user.id === store.user.id) {
        userTunes.push(tune)
      }
    })
    for (let i = 0; i < titles.length; i++) {
      tuneData = {
        tune: {
          title: `${titles[i]}`,
          composer: `${composers[i]}`
        }
      }
      if (userTunes.every((tune) => {
        return (tune.title.toUpperCase().replace(/\s/g, '') !== tuneData.tune.title.toUpperCase().replace(/\s/g, '')) || (tune.composer.toUpperCase().replace(/\s/g, '') !== tuneData.tune.composer.toUpperCase().replace(/\s/g, ''))
      })) {
        api.createTune(tuneData)
          .then(indexAndstore)
        $('#add-success-message').html('Success!')
        $('#add-success').modal('show')
      } else {
        $('#add-success-message').html('Choose New Tunes!')
        $('#add-success').modal('show')
      }
    }
  }
  $('.checkbox-inline > input').prop('checked', false)
}

const deleteCheckedTunes = function () {
  const greatestTuneIndex = store.tunes.reduce((tune1, tune2) => (tune1.id > tune2.id) ? tune1 : tune2)
  if ($('#my-rep').hasClass('selected')) {
    for (let i = 1; i <= greatestTuneIndex.id; i++) {
      if ($(`#${i}`).prop('checked')) {
        api.deleteTune(i)
          .then(onClickMyRepertoire)
          .then(() => {
            $('#add-success-message').html('Success!')
            $('#add-success').modal('show')
          })
      } else {
        $('#add-success-message').html('Check at least 1 tune')
        $('#add-success').modal('show')
      }
    }
  }
}
let checkedUserTunes = []
let combinedTunes = []

const findCommonTunes = function () {
  const commonTunes = {}
  combinedTunes = []
  const numOfCheckedUsers = checkedUserTunes.length
  const flattenedUserTunes = [].concat.apply([], checkedUserTunes)
  for (let i = 0; i < flattenedUserTunes.length; i++) {
    const title = flattenedUserTunes[i].title.toUpperCase().replace(/\s/g, '')
    const composer = flattenedUserTunes[i].composer.toUpperCase().replace(/\s/g, '')
    if (commonTunes.hasOwnProperty(title + composer)) {
      console.log('match found, checkedUserTunes', checkedUserTunes)
      commonTunes[title + composer] += 1
      if (commonTunes[title + composer] === numOfCheckedUsers) {
        combinedTunes.push(flattenedUserTunes[i])
      }
    } else {
      commonTunes[title + composer] = 1
    }
  }
  ui.showCombinedTunes(combinedTunes)
}

const findOurTunes = function () {
  const greatestTuneIndex = store.tunes.reduce((tune1, tune2) => (tune1.id > tune2.id) ? tune1 : tune2)
  isUsers = false
  checkedUserTunes = []
  // let checkedUserTunes = []
  for (let i = 1; i <= greatestTuneIndex.id; i++) {
    if ($(`#${i}`).prop('checked')) {
      // console.log('something is checked!!')
      store.userList.users.forEach(user => {
        if (user.id === i) {
          checkedUserTunes.push(user.tunes)
        }
      })
    }
  }
  if (checkedUserTunes.length > 1) {
    $('form').trigger('reset')
    findCommonTunes()
  } else {
    $('#add-success-message').html('Check 2 or more users')
    $('#add-success').modal('show')
  }
}

const onInputTuneData = function (event) {
  event.preventDefault()
  const newTuneData = getFormFields(this)
}

let isUsers = true
const onClickOurRep = function () {
  isUsers = true
  $('.actions').removeClass('disappear')
  $('.shared').removeClass('disappear')
  $('.add').addClass('disappear')
  $('.remove').addClass('disappear')
  $('.edit').addClass('disappear')
  api.indexUsers()
    .then(ui.showUsers)
}

let searchTuneData = {}

const searchTunes = function (tuneArray) {
  $('#search').trigger('reset')
  const searchField = searchTuneData.credentials.search
  let display = `<h6 id="search-message"></h6>`
  tuneArray.forEach((tune) => {
    if (((tune.title.toUpperCase().replace(/\s/g, '').includes(searchField.toUpperCase().replace(/\s/g, ''))) || (tune.composer.toUpperCase().replace(/\s/g, '').includes(searchField.toUpperCase().replace(/\s/g, '')))) || ((searchField.toUpperCase().replace(/\s/g, '').includes(tune.title.toUpperCase().replace(/\s/g, ''))) || (searchField.toUpperCase().replace(/\s/g, '').includes(tune.composer.toUpperCase().replace(/\s/g, ''))))) {
      display += `<div><label class="checkbox-inline">
      <input type="checkbox" value="" id=${tune.id}> ${tune.title}, ${tune.composer}</label></div>`
    }
  })
  $('#log-message').html(`${display}`)
  $('#search-message').text('Search results for: ' + '"' + searchField + '"')
}

const onClickSearch = function (event, tuneArray) {
  event.preventDefault()
  searchTuneData = getFormFields(this)
  if ($('#full-rep').hasClass('selected')) {
    searchTunes(store.masterTunes)
  } else if ($('#my-rep').hasClass('selected')) {
    const tunes = []
    store.tunes.forEach((tune) => {
      if (tune.user.id === store.user.id) {
        tunes.push(tune)
      }
    })
    searchTunes(tunes)
  } else if ($('#our-rep').hasClass('selected') && isUsers === true) {
    $('#search').trigger('reset')
    $('#search-results').removeClass('disappear')
    const searchField = searchTuneData.credentials.search
    let display = `<h6 id="search-message"></h6>`
    store.userList.users.forEach((user) => {
      if ((user.email.toUpperCase().replace(/\s/g, '').includes(searchField.toUpperCase().replace(/\s/g, '')) || (searchField.toUpperCase().replace(/\s/g, '').includes(user.email.toUpperCase().replace(/\s/g, ''))))) {
        display += `<div><label class="checkbox-inline">
          <input type="checkbox" value="" id=${user.id}> ${user.email}</label></div>`
      }
    })
    $('#log-message').removeClass('dont-move')
    $('#search-results').html(`${display}`)
    $('#search-message').text('Search results for: ' + '"' + searchField + '"')
  } else if ($('#our-rep').hasClass('selected') && isUsers === false) {
    $('#search').trigger('reset')
    $('#search-results').removeClass('disappear')
    const searchField = searchTuneData.credentials.search
    let display = `<h6 id="search-message"></h6>`
    combinedTunes.forEach((tune) => {
      if (((tune.title.toUpperCase().replace(/\s/g, '').includes(searchField.toUpperCase().replace(/\s/g, ''))) || (tune.composer.toUpperCase().replace(/\s/g, '').includes(searchField.toUpperCase().replace(/\s/g, '')))) || ((searchField.toUpperCase().replace(/\s/g, '').includes(tune.title.toUpperCase().replace(/\s/g, ''))) || (searchField.toUpperCase().replace(/\s/g, '').includes(tune.composer.toUpperCase().replace(/\s/g, ''))))) {
        display += `<div><span>${tune.title}, ${tune.composer}</span></div>`
      }
    })
    $('#search-results').html(`${display}`)
    $('#search-message').text('Search results for: ' + '"' + searchField + '"')
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
  $('.remove').on('click', deleteCheckedTunes)
  $('.kill-dropdown').click(() => $('#dropdownMenu2').dropdown('toggle'))
  $('.edit').on('click', onClickEdit)
  $('body').on('submit', '#input-tune-data', onClickNew)
  $('body').on('submit', '#edit-tune-data', onClickEditSubmit)
  $('.shared').on('click', findOurTunes)
  $('#our-rep').on('click', onClickOurRep)
  $('.find-our-tunes').on('click', findOurTunes)
  $('#search').on('submit', onClickSearch)
  $('.reps').hide()
  $('#search').addClass('disappear')
  $('body').on('click', '.new', () => $('#new-tune-message').html('New Tune'))
  $('.app-name').on('click', () => $('*').scrollTop(0))
}

module.exports = {
  addHandlers,
  onClickEdit
}
