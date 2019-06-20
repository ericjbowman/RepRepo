'use strict'

const getFormFields = require(`../../lib/get-form-fields`)
const api = require('./api')
const ui = require('./ui')
const store = require('./store')

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
  // $('#sign-in').html('')

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

// const afterDelete = function () {
//   api.indexTunes()
//     .then(ui.showTunes)
// }

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
    // console.log('input is', input)
    tuneData.tune.title = input.title
    tuneData.tune.composer = input.composer
    // console.log('tune data is', tuneData)
  // if (store.tunes.some((storeTune) => {
  //   return ((storeTune.title === tuneData.tune.title) && (storeTune.composer === tuneData.tune.composer))
  // })) {
  //   $('#new-tune-message').html('No Duplicates!')
  let userTunes = store.tunes.filter((tune) => tune.user.id === store.user.id)
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
    let userTunes = store.tunes.filter((tune) => tune.user.id === store.user.id)
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
  tuneId = 0
  $('#edit-tune-message').html('Edit a tune')
  if ($('#my-rep').hasClass('selected')) {
    for (let i = 1; i <= 5000; i++) {
      if ($(`#${i}`).prop('checked')) {
        tuneId = i
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
let checkedTuneIndexes = []
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
      $('#add-success-message').html('You must check at least 1 tune')
      $('#add-success').modal('show')
    }
  }

  let x = checkedTunes.map((tune) => tune.trim())
  let y = x.map((tune) => tune.split(','))
  let titles = []
  let composers = []
  y.forEach((arr) => titles.push(arr[0]))
  y.forEach((arr) => composers.push(arr[1]))
  // let userTunes = store.tunes.filter((tune) => tune.user.id === store.user.id)
  let userTunes = []
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
      return (tune.title !== tuneData.tune.title) || (tune.composer !== tuneData.tune.composer)
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
// const greatestTuneIndex = store.tunes.reduce((tune1, tune2) => (tune1.user.id > tune2.user.id) ? tune1 : tune2)
const deleteCheckedTunes = function () {
  const greatestTuneIndex = store.tunes.reduce((tune1, tune2) => (tune1.id > tune2.id) ? tune1 : tune2)
  if ($('#my-rep').hasClass('selected')) {
    for (let i = 1; i <= greatestTuneIndex.id; i++) {
      if ($(`#${i}`).prop('checked')) {
        // deleteIds.push(i)
        api.deleteTune(i)
          .then(onClickMyRepertoire)
          .then(() => {
            $('#add-success-message').html('Success!')
            $('#add-success').modal('show')
          })
          // .catch(() => console.log('Delete failed'))
      } else {
        $('#add-success-message').html('You must check at least 1 tune')
        $('#add-success').modal('show')
      }
    }
  }
}
let checkedUserTunes = []
let combinedTunes = []
// combinedTunes is an array of arrays, each array is all of users tunes
const findCommonTunes = function () {
  combinedTunes = []
  let numOfCheckedUsers = checkedUserTunes.length
  const flattenedUserTunes = [].concat.apply([], checkedUserTunes)
  console.log('flattened user tunes is', flattenedUserTunes)
  // let combinedTunes = []
  for (let i = 0; i < flattenedUserTunes.length; i++) {
    let counter = 0
    for (let j = i; j < flattenedUserTunes.length; j++) {
      // let counter = 0
      if (((flattenedUserTunes[i].title.toUpperCase() === flattenedUserTunes[j].title.toUpperCase()) && (flattenedUserTunes[i].composer.toUpperCase().replace(/\s/g, '') === flattenedUserTunes[j].composer.toUpperCase().replace(/\s/g, '')))) {
        counter++
        if (counter === numOfCheckedUsers) {
          combinedTunes.push(flattenedUserTunes[i])
          // console.log('pushed tune is', flattenedUserTunes[i])
        }
      }
    }
  }

  // This prevents duplicates but may cause bugs
  // for (let i = 0; i < combinedTunes.length; i++) {
  //   for (let j = 0; j < combinedTunes.length; j++) {
  //     if (combinedTunes[i].title === combinedTunes[j].title) {
  //       combinedTunes.splice(i, 1)
  //     }
  //   }
  // }
  // let combinedTitles = []
  // let combinedComposers = []
  // combinedTunes.forEach(tune => combinedTitles.push(tune.title))
  // combinedTunes.forEach(tune => combinedComposers.push(tune.composer))
  // let combinedUniqueTitles = [...new Set(combinedTitles)]
  // let combinedUniqueComposers = [...new Set(combinedComposers)]
  // If there are duplicate composers, combinedUniqueComposers will come up short.
  // Use the Id of the tunes to get the composer in the ui
  ui.showCombinedTunes(combinedTunes)
}

const findOurTunes = function () {
  isUsers = false
  checkedUserTunes = []
  // let checkedUserTunes = []
  for (let i = 1; i <= 5000; i++) {
    if ($(`#${i}`).prop('checked')) {
      // console.log('something is checked!!')
      store.userList.users.forEach(user => {
        if (user.id === i) {
          checkedUserTunes.push(user.tunes)
        }
      })
    }
  }
  findCommonTunes()
}

const onInputTuneData = function (event) {
  event.preventDefault()
  const newTuneData = getFormFields(this)
}

// const modsubmit = function (event) {
//   event.preventDefault()
// }
// const poplulateStoreUserList = function (data) {
//   store.userList = data
// }
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
    if (((tune.title.toUpperCase().includes(searchField.toUpperCase())) || (tune.composer.toUpperCase().includes(searchField.toUpperCase()))) || ((searchField.toUpperCase().includes(tune.title.toUpperCase())) || (searchField.toUpperCase().includes(tune.composer.toUpperCase())))) {
      display += `<div><label class="checkbox-inline">
      <input type="checkbox" value="" id=${tune.id}> ${tune.title}, ${tune.composer}</label></div>`
    }
  })
  $('#log-message').html(`${display}`)
  $('#search-message').text('Search results for: ' + searchField)
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
      if ((user.email.toUpperCase().includes(searchField.toUpperCase()) || (searchField.toUpperCase().includes(user.email.toUpperCase())))) {
        display += `<div><label class="checkbox-inline">
          <input type="checkbox" value="" id=${user.id}> ${user.email}</label></div>`
      }
    })
    $('#search-results').html(`${display}`)
    $('#search-message').text('Search results for: ' + searchField)
  } else if ($('#our-rep').hasClass('selected') && isUsers === false) {
    $('#search').trigger('reset')
    $('#search-results').removeClass('disappear')
    const searchField = searchTuneData.credentials.search
    let display = `<h6 id="search-message"></h6>`
    combinedTunes.forEach((tune) => {
      if (((tune.title.toUpperCase().includes(searchField.toUpperCase())) || (tune.composer.toUpperCase().includes(searchField.toUpperCase()))) || ((searchField.toUpperCase().includes(tune.title.toUpperCase())) || (searchField.toUpperCase().includes(tune.composer.toUpperCase())))) {
        display += `<div><span>${tune.title}, ${tune.composer}</span></div>`
      }
    })
    $('#search-results').html(`${display}`)
    $('#search-message').text('Search results for: ' + searchField)
  }
}

// const deleteDuplicatesForUserTunes = function (data) {
//   store.tunes = data.tunes
//   let dupArray = []
//   let userTunes = store.tunes.filter((tune) => tune.user.id === store.user.id)
//   userTunes.sort(function (a, b) {
//     let nameA = a.title.toUpperCase()
//     let nameB = b.title.toUpperCase()
//     if (nameA < nameB) {
//       return -1
//     }
//     if (nameA > nameB) {
//       return 1
//     }
//     return 0
//   })
//   console.log('delete dup ran')
//   for (let i = 0; i < userTunes.length - 1; i++) {
//     console.log(userTunes[i])
//     if ((userTunes[i].title === userTunes[i + 1].title) && (userTunes[i].composer === userTunes[i + 1].composer)) {
//       console.log('duplicate found in user tunes', userTunes[i].title)
//       dupArray.push(i)
//       console.log('dupArray is', dupArray)
//       // api.deleteTune(userTunes[i].id)
//       //   .then(onClickMyRepertoire)
//     }
//   }
//
//   dupArray.forEach((indexOfDupe) => {
//     console.log(userTunes[indexOfDupe])
//     api.deleteTune(userTunes[indexOfDupe].id)
//       .then(() => console.log('duplicate deleted', userTunes[indexOfDupe].title))
//       .then(afterDelete)
//   })
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
  $('.edit').on('click', onClickEdit)
  $('body').on('submit', '#input-tune-data', onClickNew)
  $('body').on('submit', '#edit-tune-data', onClickEditSubmit)
  $('body').on('click', '.shared', findOurTunes)
  $('#our-rep').on('click', onClickOurRep)
  $('.find-our-tunes').on('click', findOurTunes)
  $('#search').on('submit', onClickSearch)
  $('.reps').hide()
  $('#search').addClass('disappear')
  $('body').on('click', '.new', () => $('#new-tune-message').html('New Tune'))
  // $('.step-one').delay(2000).addClass('enable')
}

module.exports = {
  addHandlers,
  onClickEdit
}
