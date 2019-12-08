import React from 'react';
import {connect} from 'react-redux';

import {goBack} from '../../../store/router/actions';

import {HeaderButton} from '@vkontakte/vkui';

import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

class BackButton extends React.PureComponent {
	render () {
		return (<HeaderButton onClick={() => {
			if (this.props.onClick) 
				return this.props.onClick();
			this.props.goBack();
		}}>{this.props.icon === "close" ? <Icon24Cancel/> : <Icon24Back/>}</HeaderButton>);
	}
}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(BackButton);