import React, { Component } from 'react';
import { Root, Button } from '@vkontakte/vkui';
import { Route, Router } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';

import ReactDOM from 'react-dom';

// Утилиты и библиотеки
import history from './lib/history';
import getRoute from './lib/routes';

// Дополнительные комопненты
import MainPage from './components/MainPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMinimize, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import Icon24Bug from '@vkontakte/icons/dist/24/bug';


// Стили
import '@vkontakte/vkui/dist/vkui.css';
import './index.css';


const electron = window.require('electron').remote;
const ipc = window.require('electron').ipcRenderer;

class App extends React.Component {
  
  constructor (props) {
    super(props);
    this.history = history;
    this.win = electron.getCurrentWindow();
    this.ipc = ipc;

    this.state = {
      accounts: [] /** Array */
    }

    this.ipc.send("get-accounts");
      
    /** Получаем список аккаунтов, которые уже добавлены в базу */
    this.ipc.on("get-accounts-response", (_, response) => {
      console.log('Получили список аккаунтов', response)
      this.setState({
        accounts: response
      })
    });

  } 

  /** Функция для закрытия окна программы */
  closeWindow = (e) => {
    e.preventDefault();
    this.win.close();
  }

  /** Функция для скрытия окна программы */
  minimizeWindow = (e) => {
    e.preventDefault();
    this.win.minimize();
  }

  /** Функция для включения дебага */
  debugWindow = (e) => {
    e.preventDefault();
    this.win.toggleDevTools();
  } 

  /**
   * Функция для рендеринга выбранной панели и View по текущему маршруту
   * @param {string} routeProps Строка-адрес текущего маршрута (hash браузера) 
   */ 
  renderPages = (routeProps) => {
    
    // Получаем роутер-страницу из адреса
    const route = getRoute(
      decodeURIComponent(routeProps.location.pathname)
    );
    
    const activeView = route.activeView;

    return (
      <div>
        <div className="titlebar" style={{display: 'flex', marginBottom: 15}}>
          <div className="column-title title">
           storybot
          </div>
          <div className="column-title window-controllers">
            <Button level="tertiary" onClick={this.debugWindow}>
              <Icon24Bug/>
            </Button>
            <Button level="tertiary" style={{marginLeft: 8}} onClick={this.minimizeWindow}>
              <FontAwesomeIcon icon={faWindowMinimize}/>
            </Button>
            <Button level="tertiary" style={{marginLeft: 8}} onClick={this.closeWindow}>
              <FontAwesomeIcon icon={faWindowClose}/>
            </Button>
          </div>
        </div>
        <Root activeView={activeView}>
           <MainPage  
            id="mainPage"
            route={route}
            history={this.history}
            accounts={this.state.accounts} />
        </Root>
      </div>
    );
  }

  render () {
    return (
      <Router history={this.history}>
        <Route path="/" component={this.renderPages}/>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));