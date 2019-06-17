// Basic init
const electron = require('electron')
const {app, BrowserWindow} = electron

const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

// console.log(isDev)
// Let electron reloads by itself when webpack watches changes in ./app/
if (isDev) { require('electron-reload')(__dirname) }
  
// To avoid being garbage collected
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 900, height: 680,
    frame: false,
    resizeable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  const ses = mainWindow.webContents;
  
  // Устанавливаем основной user-agent Android, чтобы анимации и дизайн был от этой платформы
  ses.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Mobile Safari/537.36');

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

app.setName('Storybot GUI')