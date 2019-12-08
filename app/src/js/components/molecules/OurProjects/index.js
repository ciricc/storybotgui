import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from '../../../store/router/actions';

import {
    HorizontalScroll,
    Div
} from '@vkontakte/vkui';

import './OurProjects.css';

class HomePanelBase extends React.Component {
    render() {
        const {id} = this.props;
        return (
            <HorizontalScroll>
                <div className="our-projects">
                    <div className="our-projects--item">
                        <div className="our-projects--item-cover">
                            <img src="https://sun9-35.userapi.com/c854520/v854520268/848a3/E5_fKdQQN4U.jpg"/>
                        </div>
                        <div className="our-projects--item-title">
                           World Bots
                        </div>
                    </div>
                    <div className="our-projects--item">
                        <div className="our-projects--item-cover">
                            <img src="https://sun9-30.userapi.com/c851536/v851536969/18add2/7bmqpr2umG8.jpg"/>
                        </div>
                        <div className="our-projects--item-title">
                            Счетчик
                        </div>
                    </div>
                    <div className="our-projects--item">
                        <div className="our-projects--item-cover">
                            <img src="https://sun9-49.userapi.com/c851128/v851128551/1fecbf/c6fCmq_Fndo.jpg"/>
                        </div>
                        <div className="our-projects--item-title">
                            QR без камеры
                        </div>
                    </div>
                </div>
            </HorizontalScroll>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelBase);