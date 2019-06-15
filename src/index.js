import React, { Component } from 'react';
import { Root } from '@vkontakte/vkui';
import { Route, Router } from 'react-router-dom';

import ReactDOM from 'react-dom';

import history from './lib/history';
import getRoute from './lib/routes';

import MainPage from './components/MainPage';

import '@vkontakte/vkui/dist/vkui.css';


import './index.css';


class App extends React.Component {
  
  constructor (props) {
    super(props);
    this.history = history;
  } 

  renderPages = (routeProps) => {
    
    // Получаем роутер-страницу из адреса
    const route = getRoute(
      decodeURIComponent(routeProps.location.pathname)
    );
    
    const activeView = route.activeView;

    return (
      <Root activeView={activeView}>
         <MainPage  
          id="mainPage"
          route={route}
          history={this.history} />
      </Root>
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