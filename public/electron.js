const {
  app,
  session,
  BrowserWindow,
} = require('electron');


const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {

  mainWindow = new BrowserWindow({
    webPreferences: {
      session: session,
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload.js')
    },
    width: 900, height: 680,
  });
  
  const ses = mainWindow.webContents;

  // Устанавливаем основной user-agent Android, чтобы анимации и дизайн был от этой платформы
  ses.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Mobile Safari/537.36');

  mainWindow.setMenu(null);
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});