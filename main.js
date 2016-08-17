const electron = require('electron')
// Module to control application life.
const {app, BrowserWindow, dialog} = require('electron')
const fs = require('fs')  // native node.js module for file access
const path = require('path')  // native node.js module for working with file paths
// Module to create native browser window.
const config = 'config.json'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let shared = {} // these properties will be get-ted & set-ted from renderer.js

function readConfig() {
  fs.readFile(config, function(err, data) {
    data = JSON.parse(data)
    if (err) {
      console.log(err)
    } else {
      shared.config = data  // as add more attributes to 
    }
    queryFileSystem()
  })
}

readConfig()  // immediately call this function, and read the config

// from https://nodejs.org/api/all.html#fs_fs_readdir_path_options_callback
// fs.readdir(path[, options], callback)

function queryFileSystem() {
  shared.library = [] // reinitialize library
  shared.config.sources.forEach(function(filepath){ // should force filepath to end in '/'
    fs.readdir(filepath, function(err, files) {
      if(err) {
        throw err
      } else {
        files.forEach(function(filename){
          let entry = {}
          let newPath = filepath + filename
          entry.path = newPath
          if (path.extname(newPath).toLowerCase() !== '.mp3') {console.log(`${newPath} is not valid!`); return false}
          entry.size = fs.statSync(newPath).size
          entry.time= new Date(fs.statSync(newPath).birthtime)
          shared.library.push(entry)
        })
      }
    })
  })
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({frame:false})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

exports.get = function (property) {
  let value = shared[property]
  if (value) return value
  else {
    console.log(`error in passing "${property}" to main.js function get()`)
    return null
  }
}

exports.set = function (property, value) {
  shared[property] = value
}

//exports.queryDirectories = function() {}

