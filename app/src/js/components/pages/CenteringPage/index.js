import React from 'react';

import './CenteringPage.css';

export default class ErrorPage extends React.Component {
  render () {
    return (
      <div className="centering-page">
        {this.props.children}
      </div>
    );
  }
}