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
    .catch(ui.signUpFailure)
}

const onSignIn = function (event) {
  event.preventDefault()
  // $('#sign-in').html('')

  const data = getFormFields(this)
  api.signIn(data)
    .then(ui.signInSuccess)
    .catch(ui.signInFailure)
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

const afterDelete = function () {
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
  // if (store.tunes.some((storeTune) => {
  //   return ((storeTune.title === tuneData.tune.title) && (storeTune.composer === tuneData.tune.composer))
  // })) {
  //   $('#new-tune-message').html('No Duplicates!')
    api.createTune(tuneData)
      .then(() => console.log('Created a tune!'))
      .then(() => $('#new-tune-message').html('Success'))
      .then(api.indexTunes)
      // .then(deleteDuplicatesForUserTunes)
      .then(ui.showTunes)
      .then(onClickMyRepertoire)
      .then(() => $('form').trigger('reset'))
      .catch(() => $('#new-tune-message').html('Failure'))
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
  let userTunes = store.tunes.filter((tune) => tune.user.id === store.user.id)
  for (let i = 0; i < titles.length; i++) {
    tuneData = {
      tune: {
        title: `${titles[i]}`,
        composer: `${composers[i]}`
      }
    }
    if (userTunes.every((tune) => {
      return (tune.title !== tuneData.tune.title) && (tune.composer !== tuneData.tune.composer)
    })) {
      api.createTune(tuneData)
        .then(deleteCheckedTunes)
        .then(() => console.log('Created a tune!'))
        .then($('#add-success').modal('show'))
    }
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
let combinedTunes = []
const findCommonTunes = function () {
  combinedTunes = []
  let numOfCheckedUsers = checkedUserTunes.length
  console.log('number of checked users is', numOfCheckedUsers)
  console.log('second checked user tunes is', checkedUserTunes[1])
  const flattenedUserTunes = [].concat.apply([], checkedUserTunes)
  console.log('flattened user tunes is', flattenedUserTunes)
  // let combinedTunes = []
  for (let i = 0; i < flattenedUserTunes.length; i++) {
    let counter = 0
    // console.log('counter is', counter)
    for (let j = i; j < flattenedUserTunes.length; j++) {
      // let counter = 0
      if (flattenedUserTunes[i].title === flattenedUserTunes[j].title) {
        counter++
        console.log('match found!', counter)
        if (counter === numOfCheckedUsers) {
          combinedTunes.push(flattenedUserTunes[i])
          console.log('pushed tune is', flattenedUserTunes[i])
        }
      }
    }
  }
  console.log('combined tunes are', combinedTunes)
  for (let i = 0; i < combinedTunes.length; i++) {
    for (let j = 0; j < combinedTunes.length; j++) {
      if (combinedTunes[i].title === combinedTunes[j].title) {
        combinedTunes.splice(i, 1)
      }
    }
  }
  console.log('After mumbojumbo combined tunes are', combinedTunes)

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
let isUsers = true
const onClickOurRep = function () {
  isUsers = true
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

let searchTuneData = {}

const searchTunes = function (tuneArray) {
  console.log(tuneArray)
  // event.preventDefault()
  // const searchTuneData = getFormFields(this)
  $('#search').trigger('reset')
  const searchField = searchTuneData.credentials.search
  console.log('search tunes was clicked')
  let display = `<h6 id="search-message"></h6>`
  // console.log('getFormFields', getFormFields(this))
  console.log(searchTuneData.credentials.search)
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
    console.log('my rep selected')
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
    console.log('search tunes was clicked')
    let display = `<h6 id="search-message"></h6>`
    // console.log('getFormFields', getFormFields(this))
    console.log(searchTuneData.credentials.search)
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
    console.log('search tunes was clicked')
    let display = `<h6 id="search-message"></h6>`
    // console.log('getFormFields', getFormFields(this))
    console.log(searchTuneData.credentials.search)
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
  // $('body').on('click', '.edit', onClickEdit)
  $('.edit').on('click', onClickEdit)
  $('body').on('submit', '#input-tune-data', onClickNew)
  $('body').on('submit', '#edit-tune-data', onClickEditSubmit)
  $('body').on('click', '.shared', findOurTunes)
  $('#our-rep').on('click', onClickOurRep)
  $('.find-our-tunes').on('click', findOurTunes)
  // $('body').on('submit', '#search', searchTunes)
  $('#search').on('submit', onClickSearch)
  $('.reps').hide()
  $('#search').addClass('disappear')
  // $('.input-tune-data').on('submit', onInputTuneData)
//   $('.input-tune-data').on('submit', (event) => event.preventDefault)
//   $('.modsub').on('submit', (event) => event.preventDefault)
}

module.exports = {
  addHandlers,
  onClickEdit
}
