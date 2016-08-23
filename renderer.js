// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// const fs = require('fs')
const path = require('path')
const remote = require('electron').remote
const api = remote.require('./main.js')
const mp3 = api.mp3Player
window.$ = window.jQuery = require(`${__dirname}/jquery.js`)

// let sources = api.get('config').sources

// let filter = 'all'  // for filter buttons

// render out table

function getNiceTimeString (dateObject) {
  let day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObject.getDay()]
  let month = dateObject.getMonth() + 1
  let date = dateObject.getDate()
  let year = (dateObject.getFullYear() + '').slice(2)
  return `${day} ${month}/${date}/${year}`
}

function renderTable (where) {
  $('tr').remove('.temp')

  api.get('library').forEach(function (fileObject) {
    $(where).append(
      $('<tr class=\'temp\'>')
        .append(
          $('<td>').append(
            $('<button class=\'btn btn-mini btn-default\'>')
              .data('url', fileObject.path)
              .click(function (e) {
                let $this = $(this)
                let filepath = $this.data('url')
                if ($this.children('span').hasClass('icon-play')) {  // if this isn't playing...
                  $('.icon-pause').toggleClass('icon-play icon-pause')
                }
                $this.children('span').toggleClass('icon-play icon-pause')
                mp3.play(filepath)
              })
              .append('<span class=\'icon icon-play\'></span>')
          )
        )
        .append(`<td>${path.basename(fileObject.path)}</td>\
          <td>${getNiceTimeString(fileObject.time)}</td>\
          <td>${Math.floor(fileObject.size / 1000)}k</td>`)
    )
  })
}

renderTable('#library')
