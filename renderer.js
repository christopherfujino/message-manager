// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs')
const path = require('path')
const remote = require('electron').remote
const api = remote.require('./main.js')

let sources = api.get('config').sources

let filter = 'all'  // for filter buttons

// render out table

function getNiceTimeString(dateObject) {
  let string = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObject.getDay()] +
    ' ' + (dateObject.getMonth() + 1) +
    '/' + dateObject.getDate() +
    '/' + dateObject.getFullYear()
  return string
}

function renderTable(where) {
  $('tr').remove('.temp')
    
  api.get('library').forEach(function(fileObject){
    $(where).append(
      $('<tr>')
        .append(
          $('<td>').append(
            $('<button class=\'btn btn-mini btn-default\'>')
              .data('url', fileObject.path)
              .click(function(e){
                console.log($(this).data('url'))
              })
              .append('<span class=\'icon icon-play\'></span>')
          )
        )
        .append(`<td>${path.basename(fileObject.path)}</td>\
          <td>${getNiceTimeString(fileObject.time)}</td>\
          <td>${Math.floor(fileObject.size/1000)}k</td>`)
    )
  })
}

renderTable('#library')
