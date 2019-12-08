import React from 'react';

import './OutlineMessage.css';

export default class OutlineMessage extends React.PureComponent {
	render () {
		return (
			<div className="outline-message">
				{this.props.text}
			</div>
		);
	}
}