// Basic init
const electron = require('electron')
const {app, BrowserWindow, session} = electron

const { ipcMain } = electron;
const Listeners = require('./database.js')


const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

// console.log(isDev)
// Let electron reloads by itself when webpack watches changes in ./app/
if (isDev) { require('electron-reload')(__dirname) }

const log = require('electron-log');

// To avoid being garbage collected
let mainWindow;


function createWindow () {
  mainWindow = new BrowserWindow({
    width: 900, height: 680,
    frame: false,
    resizeable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.toggleDevTools();

  const ses = mainWindow.webContents;
  
  // Устанавливаем основной user-agent Android, чтобы анимации и дизайн был от этой платформы
  ses.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Mobile Safari/537.36');

  session.defaultSession.webRequest.onBeforeRequest({}, (details, callback) => {
    if (details.url.indexOf('7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33') !== -1) {
      callback({redirectURL: details.url.replace('7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33', '57c9d07b416b5a2ea23d28247300e4af36329bdc')});
    } else {
      callback({cancel: false});
    }
  });

  Listeners.forEach(listener => {
    ipcMain.on(listener.channel, (...data) => {
      listener.listener({
        win: mainWindow
      }, ...data)
    });
  })

  mainWindow.setResizable(false);
  mainWindow.setMenu(null);

  mainWindow.loadURL(`file://${__dirname}/app/index.html`)
}

app.on('ready', createWindow)

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.setName('Storybot GUI');