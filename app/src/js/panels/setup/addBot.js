import React from 'react';
import {connect} from 'react-redux';

import {setStateData} from '../../store/app/actions';

import {goBack, setPage, openModal} from '../../store/router/actions';
import OutlineMessage from '../../components/atoms/OutlineMessage';
import BackButton from '../../components/atoms/BackButton';

import {
    Panel,
    PanelHeader,
    Div,
    FormLayout,
    Input,
    File,
    Button,
    FormLayoutGroup,
    Cell,
    Avatar,
    Radio,
    Checkbox
} from '@vkontakte/vkui';

import { Grid, Row, Col } from 'react-flexbox-grid';

import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';
import Icon24Document from '@vkontakte/icons/dist/24/document';
import Icon24Users from '@vkontakte/icons/dist/24/users';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon24Add from '@vkontakte/icons/dist/24/add';

class SetupPanelAddBot extends React.Component {
    
    state = {
        selects: false,
        collectors: this.props.formAddBotCollectors
    }

    addAccountCollector = () => {
        this.props.setStateData({addBotSelectsAccount: 'collector'})
        this.props.setPage("addBot", "selectAccount");
    }

    componentDidMount (prevProps) {
        console.log(prevProps, this.props);
        if (true) {
            console.log('Selected new account!');
            switch (this.props.selects) {
                case 'collector':
                    this.addCollector(this.props.selectedAccount);
                    break;
                case 'viewer':
                    break;
            }
        }
    }

    addCollector (account) {
        if (account && this.props.formAddBotCollectors.indexOf(account) === -1) {
            this.props.setStateData({
                formAddBotCollectors: [...this.props.formAddBotCollectors, account] 
            });
        }
    }

    deleteCollector = (index=0) => {
        let collectors = [...this.props.formAddBotCollectors];
        collectors.splice(index, 1);
        this.props.setStateData({
            formAddBotCollectors: collectors
        });
    }

    render() {
        const {id} = this.props;
        return (
            <Panel id={id} theme="white">
                <PanelHeader left={<BackButton onClick={() => {
                    window.confirm("Удалить нового бота?", (r) => {
                        if (r) {
                            this.props.goBack();
                        }
                    })
                }}/>}>Новый бот</PanelHeader>
                <Div>
                    <Grid fluid>
                        <Row>
                            <Col md={6}>
                                <FormLayout>
                                    <FormLayoutGroup top="Настройки сборщиков историй">
                                        {this.props.formAddBotCollectors.map((account, i) => (
                                            <Cell description={account.access_token.slice(0, 15) + "**********"} asideContent={<Button level="tertiary" onClick={() => this.deleteCollector(i)}><Icon28DeleteOutlineAndroid/></Button>} before={<Avatar size={32} src={account.photo_200}/>}>{account.first_name} {account.last_name}</Cell>
                                        ))}
                                        <Button size="xl" level="secondary" onClick={this.addAccountCollector} before={<Icon24Add/>}>Добавить аккаунт</Button>
                                    </FormLayoutGroup>
                                    <Button size="xl" before={<Icon24Users/>} level="commerce">Выбрать группы (0)</Button>
                                    <FormLayoutGroup top="Смотреть истории только у">
                                        <Row>
                                            <Col md={5}>
                                                <Radio name="sex" value="1">Женщин</Radio>
                                            </Col>
                                            <Col md={6}>
                                                <Radio name="sex" value="2">Мужчин</Radio>
                                            </Col>
                                        </Row>
                                    <File before={<Icon24Document/>} level="outline">Выбрать файл таргета (*.txt)</File>
                                    </FormLayoutGroup>
                                        <Input top="Прокси адрес для сборщиков" placeholder="http://user:password@server:port"></Input>
                                </FormLayout>
                            </Col>
                            <Col md={6}>
                                <FormLayout>
                                    <FormLayoutGroup top="Настройки аккаунта-смотрителя">
                                        <Button size="xl" before={<Avatar style={{marginRight: 8}} size={24} src="https://vk.com/images/camera_50.png?ava=1"/>} level="secondary">Выбрать аккаунт</Button>
                                    </FormLayoutGroup>
                                    <Input top="Прокси адрес для смотрителя" placeholder="http://user:password@server:port"></Input>
                                    <Input top="Сколько смотреть историй у пользователя?" placeholder="Число от 1 до ∞"></Input>
                                    <Checkbox checked={true}>Смотреть с последней выложенной истории</Checkbox>
                                    <Checkbox defaultValue={true}>Не смотреть истории из групп сейчас</Checkbox>
                                    <Button before={<Icon24Done/>} size="xl">Готово</Button>
                                </FormLayout>
                            </Col>
                        </Row>
                    </Grid>
                </Div>
            </Panel>
        );
    }

}

// Connection state from redux to component
const mapStateToProps = (state) => {
    return {
        selectedAccount: state.app.selectedAccount,
        formAddBotCollectors: state.app.formAddBotCollectors,
        selects: state.app.addBotSelectsAccount
    }
}

// Dispatches to property functions
const mapDispatchToProps = {
    setPage,
    goBack,
    openModal,
    setStateData
};

export default connect(mapStateToProps, mapDispatchToProps)(SetupPanelAddBot);