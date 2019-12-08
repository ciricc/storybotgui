import React from 'react';
import {connect} from 'react-redux';

import {openModal} from "../../store/router/actions";

import {
    Div,
    List, 
    Cell,  
    ModalPage, 
    ModalPageHeader, 
    HeaderButton,
    InfoRow, 
    Button,
    FormLayout,
    Spinner,
    Input,
    IS_PLATFORM_IOS
} from "@vkontakte/vkui";

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';

import Icon24MoneyCircle from '@vkontakte/icons/dist/24/money_circle';
import {getPayName, getPayIcon} from '../../services/renderers';

import OutlineMessage from '../atoms/OutlineMessage';

import {decOfNum} from '../../services/_functions';

import classnames from 'classnames';

class SelectAccountModal extends React.Component {
    render() {
        const {id, onClose, openModal, modalProps} = this.props;

        return (
            <ModalPage
                id={id}
                header={
                    <ModalPageHeader
                        left={!IS_PLATFORM_IOS &&
                        <HeaderButton onClick={onClose}><Icon24Cancel/></HeaderButton>}
                        right={IS_PLATFORM_IOS &&
                        <HeaderButton onClick={onClose}><Icon24Dismiss/></HeaderButton>}
                    >
                        Новый аккаунт
                    </ModalPageHeader>
                }
                onClose={() => {
                    onClose();
                }}
                settlingHeight={80}
            >
                
            </ModalPage>
        );
    }

}

const mapDispatchToProps = {
    openModal
};

export default connect((state) => ({
    modalProps: state.router.activeModalProps
}), mapDispatchToProps)(SelectAccountModal);