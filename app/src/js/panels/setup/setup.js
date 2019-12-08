import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage, openModal, openPopout, closePopout} from '../../store/router/actions';
import {setAccounts, setStateData} from '../../store/app/actions';
import {setFormData} from '../../store/formData/actions';
import OutlineMessage from '../../components/atoms/OutlineMessage';
import BackButton from '../../components/atoms/BackButton';

import {
    Panel,
    PanelHeader,
    Div,
    Group,
    Cell,
    Avatar,
    // Tabs,
    TabsItem,
    FixedLayout,
    HorizontalScroll,
    Button,
    Spinner,
    PopoutWrapper,
    FormLayout,
    Input,
    Alert,
    ScreenSpinner,
    Search,
    FormStatus,
    CellButton,
    InfoRow,
    Progress,
    Link
} from '@vkontakte/vkui';

import Tabs from '../../components/molecules/Tabs';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28BugOutline from '@vkontakte/icons/dist/28/bug_outline';
import Icon36LogoVk from '@vkontakte/icons/dist/36/logo_vk';

import { Grid, Row, Col } from 'react-flexbox-grid';
import './css/setup.css';

import BotItem from '../../components/molecules/BotItem';

const {shell} = window.require('electron');

class SetupPanelBase extends React.Component {
  
  constructor (props) {
    super(props);
    const defaultInputData = {
      username: '',
      password: '',
      errorMessage: '',
      need2fa: false,
      two_factor: '',
      captchaSid: '',
      captchaImg: '',
      captchaKey: ''
    }
    
    const inputData = props.inputData['new_account_form'] || defaultInputData;

    this.defaultInputData = defaultInputData;
    
    this.state = {
      loadedAccounts: !!this.props.accounts.length,
      closePopout: false,
      inputData: inputData,
      searchQuery: '',
    }
  }

  componentDidMount () {
    if (!this.props.accounts.length && !this.state.loadedAccounts) {
      this.loadAccounts()
    }
  }

  componentWillUnmount () {
    this.saveData();
  }

  saveData () {
    this.props.setFormData('new_account_form', this.state.inputData);
  }

  loadAccounts () {
    window.rest.get('get-accounts').then(res => {
      console.log('Accounts: ', res);
      this.setState({
        loadedAccounts: true
      });
      this.props.setAccounts(res);
    })
  }

  closePopout = () => {
    this.props.closePopout();
  }

  handleInput = (e, needSave=true) => {
    let value = e.currentTarget.value;
    
    if (!isNaN(Number(value))) {
        value = Number(value);
    }

    if (e.currentTarget.type === 'checkbox') {
        value = e.currentTarget.checked;
    }

    this.setState({
        inputData: {
            ...this.state.inputData,
            [e.currentTarget.name]: value
        }
    });
  };

  clearForm = () => {
    this.setState({
      inputData: this.defaultInputData
    });
  }

  openNewAccountModal = (e) => {
    this.props.openPopout(
      <Alert
        actions={
            [
                {
                    title: 'Отмена',
                    autoclose: true,
                    style: 'cancel',
                    action: () => {
                      this.clearForm();
                    }
                }, 
                {
                    title: 'Добавить',
                    autoclose: true,
                    action: () => {
                      this.addNewAccount();
                    }
                }
            ]
        }
        onClose={() => {
          this.props.closePopout()
        }}
    >
        
        <div className="account-form">
          <div className="centered"><h2 syle={{display: 'inline'}}>Новый аккаунт</h2></div>
          <FormLayout>
            {this.state.inputData.errorMessage ?
  <FormStatus state="error" title="Произошла ошибка">{this.state.inputData.errorMessage}</FormStatus>
             : null}
            <Input onChange={this.handleInput} type="text" defaultValue={this.state.inputData.username} name="username" placeholder="Имя пользователя"/>
            <Input onChange={this.handleInput} type="password" defaultValue={this.state.inputData.password} name="password" placeholder="Пароль"/>
            {this.state.inputData.need2fa ? <Input onChange={this.handleInput} type="text" defaultValue={this.state.inputData.two_factor} name="two_factor" placeholder="Код для авторизации"/> : null}
            {this.state.inputData.captchaImg ? <div className="centered"><img src={this.state.inputData.captchaImg}/></div> : null}
            {this.state.inputData.captchaSid ? <div style={{maxWidth: 210, margin: '0 auto'}}><Input onChange={this.handleInput} type="text" defaultValue={this.state.inputData.captchaKey} name="captchaKey" placeholder="Код с картинки"/></div> : null}
          </FormLayout>
          <Div>
          <span className="description">Софт не является продуктом ВКонтакте. Ваши данные находятся только у Вас.</span>
          </Div>
        </div></Alert>
    );
    // this.props.setPage("addAccount", "addAccount");
  }

  searchAccount = (q) => {
    this.setState({
      searchQuery: q
    });
  }

  addNewAccount () {
    this.props.openPopout(<ScreenSpinner/>);
    const NO_LETTERS = /\s\n\t/g;
    if (!String(this.state.inputData.username).replace(NO_LETTERS, '').length || !String(this.state.inputData.password).replace(NO_LETTERS, '').length) {
      this.errorForm("Поля не могут быть пустыми!");
      this.openNewAccountModal();
      return;
    }
    window.rest.get('add-account', {
      username: this.state.inputData.username,
      password: this.state.inputData.password,
      two_factor: String(this.state.inputData.two_factor),
      captcha_sid: this.state.inputData.captchaSid,
      captcha_key: this.state.inputData.captchaKey
    }).then(res => {
      this.props.closePopout();
      this.props.setAccounts(res);
      this.clearForm();
    }).catch(e => {
      
      this.setState({
        inputData: {
          ...this.state.inputData,
          captchaSid: '',
          captchaImg: '',
          captchaKey: ''
        }
      });

      if (e.message) {
        this.errorForm(e.message);
        this.openNewAccountModal();
      } else if (e.e.error_code === "invalid_client") {
        this.errorForm("Неправильный логин или пароль!");
        this.openNewAccountModal();
      } else if (e.e.error_code === "need_validation") {
        this.errorForm("Вам необходимо ввести код двухфакторной аутентификации", {
          need2fa: true
        });
        this.openNewAccountModal();
      } else if (e.e.error === "need_captcha") {
        this.errorForm("Введите код с картинки", {
          captchaSid: e.e.captcha_sid,
          captchaImg: e.e.captcha_img
        });
        this.openNewAccountModal();
      } else {
        this.props.closePopout();
        window.alert('Произошла неизвестная ошибка при добавлении аккаунта!');
      }
    });
  }

  errorForm (message="", data={}) {
    this.setState({
      inputData: {
        ...this.state.inputData,
        errorMessage: message,
        ...data
      }
    })
  }

  deleteAccount (account={}) {
    this.props.openPopout(<ScreenSpinner/>);
    window.rest.get('delete-account', {
      account_id: account.id 
    }).then(res => {
      this.props.closePopout();
      this.props.setAccounts(res);
    })
  }

  renderTab () {
    switch (this.props.activeItemTab) {
      case 0:
        return this.accountsPage();
        break;
      case 1:
        return this.botsPage();
        break;
      default:
        return null;
    }
  }

  newActiveTabItem = (item=0) => {
    this.props.setStateData({
      activeItemTab: item
    });
  }

  botsPage () {
    return (
      <Grid style={{marginTop: 56 + 14}} fluid>
        <Row>
          <Col md={6}>
            <BotItem/>
            <BotItem/>
          </Col>
          <Col md={6}>
            <BotItem/>
            <BotItem/>
            <BotItem/>
          </Col>
        </Row>
        <Row>
          <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex'}} vertical="bottom">
            <Col mdOffset={8} md={4}>
                <Div>
                  <Button size="xl" before={<Icon24Add/>} onClick={this.openNewBotPanel}>Добавить бота</Button>
                </Div>
            </Col>
          </div>
        </Row>
      </Grid>
    );
  }

  openNewBotPanel = () => {
    this.props.setPage("addBot", "addBot")
  }

  accountsPage () {
    let q = this.state.searchQuery.toLocaleLowerCase();
    let accounts = this.props.accounts.filter(acc => acc.vk_id && (acc.first_name.toLocaleLowerCase().match(q) || acc.last_name.toLocaleLowerCase().match(q)));
    return (
      <Grid fluid style={{marginTop: 56 + 4}}>
        <Row>
          <div style={{flex: 12, marginBottom: 4}}>
            <Search onChange={this.searchAccount} placeholder={"Поиск аккаунта"}/>
          </div>
        </Row>
        {this.state.loadedAccounts ? this.props.accounts.length ? 
        <Row>
          {accounts.map(acc => (
            <Col md={6}>
              <Group>
                <Cell 
                  before={<Avatar src={acc.photo_200 ? acc.photo_200 : "https://vk.com/images/camera_200.png?ava=1"}/>}
                  asideContent={<Button onClick={() => window.confirm("Вы уверены, что хотите удалить этот аккаунт?", (res) => {
                    if (res) {
                      this.deleteAccount(acc)
                    }
                  }, "Да")} level="tertiary"><Icon28DeleteOutlineAndroid/></Button>}
                >{acc.first_name} {acc.last_name}</Cell>
                <Div>
                  <Input defaultValue={acc.access_token.slice(0, 15) + "**************************"} disabled />
                </Div>
              </Group>
            </Col>
          ))}
          {!accounts.length  ? <Col md={12} className="centered"><OutlineMessage text="Аккаунтов не найдено"/></Col> : null}
        </Row> : <OutlineMessage text="У вас пока что нет аккаунтов"/> : <Div><Spinner/></Div>}
        <Row>
          <div style={{position: 'fixed', bottom: 0, left: 0, right: 0}} vertical="bottom">
            <Col mdOffset={8} md={4}>
                <Div>
                  <Button size="xl" before={<Icon24Add/>} onClick={this.openNewAccountModal}>Добавить аккаунт</Button>
                </Div>
            </Col>
          </div>
        </Row>
      </Grid>
    );
  }

  render() {
      const {id} = this.props;
      return (
          <Panel theme="white" id={id}>
            {this.renderTab()}
            <Tabs items={[{
                  label: 'Аккаунты'
              }, {
                label: 'Боты'
              }]} activeItem={this.props.activeItemTab} onChangeActive={this.newActiveTabItem}/>
          </Panel>
      );
  }

}

// Connection state from redux to component
const mapStateToProps = (state) => {
    return {
      accounts: state.app.accounts,
      inputData: state.formData.forms,
      activeItemTab: state.app.activeItemTab
    }
}

// Dispatches to property functions
const mapDispatchToProps = {
    setPage,
    goBack,
    setAccounts,
    openPopout,
    closePopout,
    setFormData,
    setStateData
};

export default connect(mapStateToProps, mapDispatchToProps)(SetupPanelBase);