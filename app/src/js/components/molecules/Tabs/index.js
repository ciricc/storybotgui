import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from '../../../store/router/actions';
// import OutlineMessage from '../../components/atoms/OutlineMessage';
// import BackButton from '../../components/atoms/BackButton';

import {
    Panel,
    PanelHeader,
    Div
} from '@vkontakte/vkui';

import classnames from 'classnames';

import './Tabs.css';

class Tabs extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        activeItem: this.props.activeItem || 0
      } 
    }

    render() {
        const {id} = this.props;
        return (
            <div className="tabs">
              <ul className="tabs-items">
                {this.props.items.map((item, i) => (
                  <li onClick={() => {
                    if (this.props.onChangeActive) {
                      this.props.onChangeActive(i);
                    }
                    this.setState({activeItem: i})}
                  } key={"tabs-item-" + i} className={classnames("tabs-item", {
                    "active": this.state.activeItem === i
                  })}>{item.label}</li>
                ))}
              </ul>
            </div>
        );
    }

}

// Connection state from redux to component
const mapStateToProps = (state) => {
    return {

    }
}

// Dispatches to property functions
const mapDispatchToProps = {
    setPage,
    goBack,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);