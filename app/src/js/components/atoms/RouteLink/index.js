import React from 'react';
import redux from 'redux';

import {setRouteHash} from '../../../store/router/actions';

import {connect} from 'react-redux';

/**
  Компонент для отрисовки ссылок-акшинов, которые создают переход по хешу приложения
  без смены URL адреса. Работает намного быстрее чем обычная смена URL через объект истории или Location,
  так как не ждет реакции браузера на изменение состояния

  Используется:
  <RouteLink hash="hash_link" params={{param1: true, param2: false}}>
  	Кликни на меня
  </RouteLink>

  params - параметры перехода, нового состояния
  hash - хеш-адрес из routes.js
*/
class RouteLink extends React.PureComponent {

	gotToPage = (e) => {
		let findedLink = false;
		let target = e.target;
		
		while (true) {
			if (!target.parentNode) break;
			if (target.parentNode === e.currentTarget) break;
			if (target.parentNode.href && target.parentNode.href.match(/^https/)) {
				findedLink = true;
				break;
			}
			target = target.parentNode;
		}

		if (findedLink || (e.target.href && String(e.target.href).match(/^https/))) return true;
		e.preventDefault();
		this.props.setRouteHash(this.props.href, this.props.params || {});
	}

	render () {
		return (
			React.cloneElement(this.props.children, {
				onClick: this.gotToPage
			})
		);
	}
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = {
    setRouteHash
};

export default connect(mapStateToProps, mapDispatchToProps)(RouteLink);