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

function renderTable(where) {
  $('tr').remove('.temp')
    
  api.get('library').forEach(function(fileObject){
    $(where).append($('<tr>').addClass('temp')
        .append(`<td><button class='btn btn-mini btn-default'
          data-url='${ fileObject.path + fileObject.filename }'>
          <span class='icon icon-play'></span></button></td>`)
        .append($('<td>').append(path.basename(fileObject.path)))
        .append($('<td>').append(`
            ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
              [fileObject.time.getDay()]}
            ${fileObject.time.getMonth()+1}/${fileObject.time.getDate()}/${fileObject.time.getFullYear()}`))
        .append($('<td>').append(Math.floor(fileObject.size/1000)+ 'k'))
        )
  })
}

renderTable('#library')
