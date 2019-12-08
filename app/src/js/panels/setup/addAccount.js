import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from '../../store/router/actions';
import OutlineMessage from '../../components/atoms/OutlineMessage';
import BackButton from '../../components/atoms/BackButton';

import {
    Panel,
    PanelHeader,
    Div
} from '@vkontakte/vkui';

class SetupPanelAddAccount extends React.Component {
    render() {
        const {id} = this.props;
        return (
            <Panel id={id}>
                <PanelHeader left={<BackButton/>}>Ляля</PanelHeader>
                <Div>
                    <OutlineMessage text={this.props.text}/>
                </Div>
            </Panel>
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

export default connect(mapStateToProps, mapDispatchToProps)(SetupPanelAddAccount);