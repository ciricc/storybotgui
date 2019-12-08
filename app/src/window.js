import React from 'react';
import { Titlebar, Color} from 'custom-electron-titlebar';

import '@vkontakte/vkui/dist/vkui.css';
import './css/main.css';

const ipc = window.require('electron').ipcRenderer;
const electron = window.require('electron').remote;


let events = [
  "get-accounts",
  "add-account",
  "delete-account"
];

let menu = new electron.Menu();

menu.append(new electron.MenuItem({
    label: 'Настройки',
    click: settingsProgram
}));

if (window.debug) {
    menu.append(new electron.MenuItem({
        label: 'Дебаг',
        // click: this.debugWindow
    }));
}

menu.append(new electron.MenuItem({
    label: 'О программе',
    click: aboutProgram
}));

new Titlebar({
    backgroundColor: Color.fromHex('#ECECEC'),
    maximizable: false,
    menu: menu
});

function aboutProgram () {
  let webview = document.querySelector('webview');
  webview.send('open-about')
}

function settingsProgram () {
  let webview = document.querySelector('webview');
  webview.send('open-settings')
}

ipc.on("update-scheme", (a, theme) => {
  document.body.setAttribute("scheme", theme);
});

window.onload = () => {
  let webview = document.querySelector('webview');
  events.forEach(event => {
    ipc.on(event + "-response", (d, a) => {
      console.log(event, a);
      webview.send(event + "-response", a);
    });
  });
  webview.addEventListener("ipc-message", console.log);
  webview.src = window.__dirname + '/index.html';
}