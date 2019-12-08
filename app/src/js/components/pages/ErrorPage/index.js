import React from 'react';

import {Button} from '@vkontakte/vkui';

import './ErrorPage.css';

export default class ErrorPage extends React.Component {
  render () {
    return (
      <div className="error-page">
        <div className="error-page--message">
          Авторизация не прошла успешно. Попробуйте перезапустить сервис
        </div>
        <Button style={{marginTop: 28}} onClick={this.props.onClickRefresh}>Попробовать снова</Button>
      </div>
    );
  }
}