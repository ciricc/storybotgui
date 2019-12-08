import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {setUIProps} from '../../../store/ui/actions';

import { platform, IOS } from '@vkontakte/vkui';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';

import {
	FixedLayout,
	HorizontalScroll,
	Button
} from '@vkontakte/vkui';

import './BottomHeader.css';
const osname = platform();

class BottomHeader extends React.Component {
	
	constructor (props) {
		super(props)
		this.state = {
			activerStyles: this.props.bottomHeaderActiverStyles
		}
		
		this.bottomScrollPos = this.props.bottomHeaderScrollPos || 0;
	}

	setRefFirstButton = (ref) => {
		// console.log(document.body.querySelectorAll('.bottom-header--button'), this.props.activeCategory)

	}

	componentDidMount () {
		
		let targetButton = document.body.querySelectorAll('.bottom-header--button')[this.props.activeCategory];
		let hsBottomHeader = document.querySelector('#BOTTOM_HEADER_ITEMS .HorizontalScroll__in');
		let rect = targetButton.getBoundingClientRect();
		const hsScrolLeft = hsBottomHeader.scrollLeft;
		
		if (!this.state.activerStyles.width) {
			this.setState({
				activerStyles: {
					width: rect.width,
					transform: `translateX(${rect.left + hsScrolLeft}px)`
				}
			})
		}

		hsBottomHeader.scrollTo({
			left: this.props.bottomHeaderScrollPos,
			top: 0
		});
	}

	componentWillUnmount () {
		this.props.setUIProps({
			bottomHeaderActiverStyles: this.state.activerStyles,
			bottomHeaderScrollPos: this.bottomScrollPos
		})
	}

	changeCategory (e, i) {
		let targetButton = e.currentTarget;
		let hsBottomHeader = document.querySelector('#BOTTOM_HEADER_ITEMS .HorizontalScroll__in');
		let rect = targetButton.getBoundingClientRect();
		const hsScrolLeft = hsBottomHeader.scrollLeft;
		let newScroll = hsScrolLeft + rect.left;
		let offsetWindowWidth = window.innerWidth / 2;
		newScroll = newScroll + (rect.width / 2) < (window.innerWidth / 2) ? 0 : newScroll - (newScroll > offsetWindowWidth ? (offsetWindowWidth - rect.width / 2) : 0);
		this.bottomScrollPos = newScroll;
		// console.log(offsetWindowWidth, newScroll + rect.width)
		hsBottomHeader.scrollTo({
			left: newScroll,
			top: 0,
			behavior: 'smooth'
		})
		this.setState({
			activerStyles: {
				width: rect.width,
				transform: `translateX(${rect.left + hsScrolLeft}px)`
			}
		})
		if (this.props.onChangeCategory) {
			this.props.onChangeCategory.call(e, i, e);
		}
	}

	render () {
		let activeCategory = this.props.activeCategory || 0;
			
		const headerStyles = {
			position: 'relative', 
			top: 0,
			marginTop: (osname === IOS) ? 56 : 56, 
			left: 0, 
			right: 0, 
			zIndex: 111
		}

		return (
			<div style={headerStyles}>
				<div className="bottom-header-wrap">
				 <HorizontalScroll id="BOTTOM_HEADER_ITEMS">
				 	<div className="bottom-header-wrap--items">
				 		{this.props.categories && this.props.categories.length ? this.props.categories.map((category, i) => {
				 			let stateItem = activeCategory === i ? "active" : "inactive";
				 			let classes = classNames("bottom-header-wrap--item", {
			 					active: activeCategory === i
			 				});
				 			return (
				 				<div key={"category_" + i + stateItem} className={classes}>
						 			<div onClick={(e) => {
						 				this.changeCategory(e, i)
						 				if (this.props.onClick) {
						 					this.props.onClick(e);
						 				}
						 			}} ref={this.setRefFirstButton} className="bottom-header--button">{category.name}</div>
						 		</div>
				 			);
				 		}) : null}
				 	</div>
				 	{!this.props.showActiver ? <div className="bottom-header--activer" style={this.state.activerStyles} id="activerBottomHeader"></div> : null }
				 </HorizontalScroll>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
    return {
    	bottomHeaderActiverStyles: state.ui.bottomHeaderActiverStyles,
    	bottomHeaderScrollPos: state.ui.bottomHeaderScrollPos
    }
}

const mapDispatchToProps = {
    setUIProps
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomHeader);