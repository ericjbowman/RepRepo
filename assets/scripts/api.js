'use strict'

const config = require('./config')
const store = require('./store')

const signUp = function (data) {
  return $.ajax({
    url: config.apiUrl + '/sign-up',
    method: 'POST',
    data
  })
}

const signIn = function (data) {
  return $.ajax({
    url: config.apiUrl + '/sign-in',
    method: 'POST',
    data
  })
}

const signOut = function () {
  return $.ajax({
    url: config.apiUrl + '/sign-out',
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const changePassword = function (data) {
  return $.ajax({
    url: config.apiUrl + '/change-password',
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

const indexMasterTunes = function () {
  return $.ajax({
    url: config.apiUrl + '/master_tunes',
    method: 'GET'
    // headers: {
    //   Authorization: 'Token token=' + store.user.token
    // }
  })
}

const indexTunes = function () {
  return $.ajax({
    url: config.apiUrl + '/tunes',
    method: 'GET'
  })
}

const showTune = function (id) {
  return $.ajax({
    url: config.apiUrl + '/tunes/' + id,
    method: 'GET'
  })
}

const deleteTune = function (id) {
  return $.ajax({
    url: config.apiUrl + '/tunes/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const createTune = function (data) {
  return $.ajax({
    url: config.apiUrl + '/tunes',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data: data
  })
}

const patchTune = function (i, tuneData) {
  return $.ajax({
    url: config.apiUrl + '/tunes/' + i,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data: tuneData
  })
}

const indexUsers = function () {
  return $.ajax({
    url: config.apiUrl + '/users',
    method: 'GET'
  })
}

module.exports = {
  signUp,
  signIn,
  signOut,
  changePassword,
  indexMasterTunes,
  indexTunes,
  showTune,
  deleteTune,
  createTune,
  patchTune,
  indexUsers
}
