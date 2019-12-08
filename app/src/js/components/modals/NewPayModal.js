import React from 'react';
import {connect} from 'react-redux';

import {openModal} from "../../store/router/actions";
import {setActivePay} from "../../store/app/actions";

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
    IS_PLATFORM_IOS
} from "@vkontakte/vkui";

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';

import Icon24MoneyCircle from '@vkontakte/icons/dist/24/money_circle';
import {getPayName, getPayIcon} from '../../services/renderers';

import OutlineMessage from '../../components/atoms/OutlineMessage';

import {decOfNum} from '../../services/_functions';

import classnames from 'classnames';

class HomeBotsListModal extends React.Component {

    getPayLife (expires) {
        if (expires === 0) return "Навсегда";

        let countDays = Math.floor(expires / 60 / 60 / 24);
        let currentSecs = Math.floor(new Date().getTime() / 1000);
        let daysDecs = ["день", "дня", "дней"];
        return `${countDays} ${decOfNum(countDays, daysDecs)}`;
    }

    cancelPay = () => {
        window.rest.get('cancelPay', {
            pay_id: this.props.activePay.id
        }).then(res => {
            this.props.setActivePay(res);
        }).catch(() => {
            window.alert("Платеж не удалось отменить!");
        });
    }

    render() {
        const {id, onClose, openModal, modalProps} = this.props;
        const pay = this.props.activePay;

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
                        {pay ? <span>Счет №{pay.id}</span> : null}
                    </ModalPageHeader>
                }
                onClose={() => {
                    this.props.setActivePay(null);
                    onClose();
                }}
                settlingHeight={80}
            >
                {pay ? <div style={{width:'100%'}}>
                    <List>
                        <Cell>
                            <InfoRow title="Тип заказа">{getPayName(pay.type)}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Для сервера">server#{pay.server_id}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Количество">{pay.quantity}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Срок годности">{this.getPayLife(pay.expires)}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Сумма к оплате">{pay.amount} ₽</InfoRow>
                        </Cell>
                    </List>
                    {pay.status !== 3 ? <FormLayout>
                    <Button size="xl" level="secondary" onClick={this.cancelPay}>Отменить</Button>
                    <Button size="xl" before={<Icon24MoneyCircle/>} level="commerce">Оплатить</Button>
                    </FormLayout>: null}
                    {pay.status === 3 ? <OutlineMessage text="Платеж отменен!"/> : null}
                </div> : null}
                {!pay ? pay === null ? <Div>Произошла ошибка. Попробуйте позже</Div> : <Spinner/> : null}
            </ModalPage>
        );
    }

}

const mapDispatchToProps = {
    openModal,
    setActivePay
};

export default connect((state) => ({
    modalProps: state.router.activeModalProps,
    activePay: state.app.activePay
}), mapDispatchToProps)(HomeBotsListModal);