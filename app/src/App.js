import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {goBack, closeModal, setStory, openPopout, closePopout, openModal, setPage} from "./js/store/router/actions";
import {setColorScheme} from './js/store/vk/actions';
import {setAccounts} from './js/store/app/actions';
import {setUserData, setStateData, setSnack} from "./js/store/app/actions";

import VKConnect from "@vkontakte/vkui-connect-promise";
import * as VK from './js/services/VK';
import RestClient from './js/services/restApi';

import {routes, routesRegExps} from './js/services/routes';


import {
    Epic, 
    View, 
    Root, 
    Button,
    ModalRoot, 
    ConfigProvider, 
    Alert, 
    Textarea, 
    Spinner,
    Counter,
    Snackbar,
    Link
} from "@vkontakte/vkui";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMinimize, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import Icon24Bug from '@vkontakte/icons/dist/24/bug';

import ErrorPage from './js/components/pages/ErrorPage';

import SetupPanelBase from './js/panels/setup/setup';
import SetupPanelAddAccount from './js/panels/setup/addAccount';
import SetupPanelAddBot from './js/panels/setup/addBot';

import PanelSettings from './js/panels/settings/settings';

import HomeBotsListModal from './js/components/modals/HomeBotsListModal';
import HomeBotInfoModal from './js/components/modals/HomeBotInfoModal';
import NewPayModal from './js/components/modals/NewPayModal';
import NewAccountModal from './js/components/modals/NewAccountModal';
import NoAccessToNotifyModalCard from './js/components/modals/NoAccessToNotifyModalCard';
import SelectAccountModal from './js/components/modals/SelectAccountModal';

import Tabs from './js/components/molecules/Tabs';

import { Titlebar, Color} from 'custom-electron-titlebar'
import SelectAccount from './js/panels/setup/selectAccount';


const electron = window.require('electron').remote;
const {remote} = window.require('electron');

const ipc = window.require('electron').ipcRenderer;
const Store = window.require('electron-store');

class App extends React.Component {
    constructor(props) {
        super(props);
            
        this.state = {
            authIsSuccess: true
        }

        this.lastAndroidBackAction = 0;
        this.routes = routesRegExps;
        this.makedAuth = false;

        this.rest = new RestClient(ipc);
        this.rest.withErrorHandler(this.restApiErrorHandler);
        this.win = electron.getCurrentWindow();
        this.ipc = ipc;

        window.rest = this.rest;
        window.alert = (...args) => this.alert(...args);
        window.confirm = (...args) => this.confirm(...args);
        window.prompt = (...args) => this.prompt(...args);
        window.setScheme = this.setScheme;
        
        let rightClickPosition = null
        const rightClickInspectElementMenu = new electron.Menu();
        const rightClickInspectElementMenuItem = new electron.MenuItem({
            label: 'Просмотреть код элемента',
            click: () => {
                remote.getCurrentWindow()
                .inspectElement(rightClickPosition.x, rightClickPosition.y)
            }
        });

        rightClickInspectElementMenu.append(rightClickInspectElementMenuItem);
        
        document.addEventListener('DOMContentLoaded', () => {
            window.addEventListener('contextmenu', (e) => {
                e.preventDefault()
                if (window.debug) {
                    rightClickPosition = {x: e.x, y: e.y}
                    rightClickInspectElementMenu.popup(remote.getCurrentWindow())
                }
            }, false);
        });

        let menu = new electron.Menu();

        menu.append(new electron.MenuItem({
            label: 'Настройки',
            click: () => {
                this.props.setPage("settings", "settings")
            }
        }));

        if (window.debug) {
            menu.append(new electron.MenuItem({
                label: 'Дебаг',
                click: this.debugWindow
            }));
        }

        menu.append(new electron.MenuItem({
            label: 'О программе',
            click: this.debugWindow
        }));

        // new Titlebar({
        //     backgroundColor: Color.fromHex('#ECECEC'),
        //     maximizable: false,
        //     menu: menu
        // });

        this.store = new Store();
        this.setScheme(this.store.get('enable_dark_theme', false) ? "space_gray" : "bright_light");
        window.store = this.store;
        this.handlers();
        this.ipc.on('open-settings', () => this.props.setPage("settings", "settings"))

    }

    handlers () {
        this.ipc.on("update-accounts", (data) => {
            this.props.setAccounts(data);
        });
    }

    restApiErrorHandler = (error) => {
        if (error.isServerError) {
            alert(error.message ? error.message : "Неизвестная ошибка", "Ошибка");
        } else {
            alert(error.error ? error.error : "Неизвестная ошибка. Проверьте свое подключение к интернету.", "Ошибка");
        }
    }

    removeSnack = () => {
        this.props.setSnack(null);
    }

    darkTheme = () => {

    }


    confirm () {

    }

    alert (message, title="") {
        this.props.openPopout(
            <Alert
                actions={[{
                  title: 'ОК',
                  autoclose: true,
                }]}
                onClose={this.props.closePopout}
            >
                <h2>{title.toString()}</h2>
                <p>
                    {
                        (typeof message === "object" || Array.isArray(message)) ? 
                            JSON.stringify(message) : message.toString()
                    }
                </p>
            </Alert>
        );
    }

    prompt (message, callback=Function(), defaultValue="", titleAccept="ОК") {
        let value = "";

        const promptAreaStyles = {
            marginTop: 9
        }

        const areaStyles = {
            minHeight: 120
        }

        this.props.openPopout(
            <Alert
                actions={
                    [
                        {
                            title: 'Отмена',
                            autoclose: true,
                            style: 'cancel',
                            action : () => {
                                return callback(null)
                            }
                        }, 
                        {
                            title: titleAccept,
                            autoclose: true,
                            action : () => {
                                return callback(value);
                            }
                        }
                    ]
                }
                onClose={this.props.closePopout}
            >
                
                <div style={promptAreaStyles}>
                    <Textarea placeholder={message} style={areaStyles} className="white-TextArea-normal" defaultValue={defaultValue} onChange={(e) => {
                        value = e.target.value
                    }}/>
                </div>
            </Alert>
        );
    }

    confirm (message, callback=Function(), titleAccept='ОК') {
        this.props.openPopout(
            <Alert
                actions={
                    [
                        {
                            title: 'Отмена',
                            autoclose: true,
                            style: 'cancel',
                            action : () => {
                                return callback(false)
                            }
                        }, 
                        {
                            title: titleAccept,
                            autoclose: true,
                            action : () => {
                                return callback(true)
                            }
                        }
                    ]
                }
                onClose={this.props.closePopout}
            >
                <p>
                    {message}
                </p>
            </Alert>
        );
    }


    componentDidMount() {
        const {goBack, dispatch} = this.props;

        dispatch(VK.initApp());

        window.onpopstate = (e) => {
            let timeNow = +new Date();

            if (e.type === "popstate") {
                if (timeNow - this.lastAndroidBackAction > 500) {
                    this.lastAndroidBackAction = timeNow;

                    if (this.props.headerContexts.length) {
                        this.props.closeHeaderContext(this.props.headerContexts[this.props.headerContexts.length - 1])
                    } else {
                        goBack('Android');
                    }

                } else {
                    window.history.pushState(null, null);
                }
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('[App] update main App component');
        
        const {activeView, activeStory, activePanel, scrollPosition} = this.props;

        if (
            prevProps.activeView !== activeView ||
            prevProps.activePanel !== activePanel ||
            prevProps.activeStory !== activeStory
        ) {
            let pageScrollPosition = scrollPosition[activeStory + "_" + activeView + "_" + activePanel] || 0;

            // window.scroll(0, pageScrollPosition + 30);
        }
    }

    setScheme = (scheme) => {
        this.ipc.send("update-scheme", scheme);
        this.props.setColorScheme(scheme);
    }

    onSaveServer = (server) => {
        if (this.props.canNotify) {
            this.sendServerToMessages(server).then(this.setSuccessSnack);
        } else {
            this.getAccessToNotify().then(() => {
                this.sendServerToMessages(server).then(this.setSuccessSnack);
            });
        }
    }

    setSuccessSnack = (res) => {
        console.log('[Render] Prepare snack');
        let snack = res ? this.successSaveServerSnack() : this.failSaveServerSnack();
        console.log('[Render] Set this snack', snack);
        this.props.setSnack(snack);
    } 

    sendServerToMessages (server={}) {
        return new Promise((resolve, reject) => {
            return  window.rest.get('sendServerPayloadToUser', {
                server_id: server.id
            }).then(() => {
                console.log('Resolving, true');
                resolve(true)
            }).catch(() => {
                console.log('Resolving, false');
                resolve(false); 
            });
        });
    }

    getAccessToNotify () {
        return VKConnect.send("VKWebAppAllowMessagesFromGroup", 
        {"group_id": VK.GROUP_ID}).then(res => {
            this.props.setStateData({
                canNotify: true
            });
            return res;
        }).catch(e => {
            this.props.openModal("NO_ACCESS_NOTIFY")
            throw e;
        });
    }

    /** Функция для закрытия окна программы */
    closeWindow = (e) => {
        e.preventDefault();
        this.win.close();
    }

    /** Функция для скрытия окна программы */
    minimizeWindow = (e) => {
        e.preventDefault();
        this.win.minimize();
    }

    /** Функция для включения дебага */
    debugWindow = () => {
        this.win.toggleDevTools();
    } 

    render() {
        const {goBack, closeModal, popouts, activeView, activeStory, activePanel, activeModals, panelsHistory, colorScheme} = this.props;

        let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];
        let popout = (popouts[activeView] === undefined) ? null : popouts[activeView];
        let activeModal = (activeModals[activeView] === undefined) ? null : activeModals[activeView];

        const homeModals = (
            <ModalRoot activeModal="MODAL_PAGE_BOTS_LIST">
                <HomeBotsListModal
                    id="MODAL_PAGE_BOTS_LIST"
                    onClose={() => closeModal()}
                />
                <HomeBotInfoModal
                    id="MODAL_PAGE_BOT_INFO"
                    onClose={() => closeModal()}
                />
                <NewPayModal
                    id="MODAL_NEW_PAY"
                    onClose={() => closeModal()}
                />
                <NoAccessToNotifyModalCard id="NO_ACCESS_NOTIFY" onClose={() => closeModal()}/>
                <NewAccountModal id="MODAL_NEW_ACCOUNT" onClose={() => closeModal()}/>
                <SelectAccountModal id="SELECT_ACCOUNT" onClose={() => closeModal()}/>
            </ModalRoot>
        ); 

        let rootClass = (colorScheme === "client_dark" || colorScheme === "space_gray") ? "dark-root" : "";

        console.log('[Render] ActiveView:', activeView);
        console.log('[Render] ActiveStory:', activeStory);
        console.log('[Render] ActivePanel:', activePanel);
        console.log('[Render] ActiveModal:', !!homeModals);

        return (
            
            <ConfigProvider isWebView={true} scheme={colorScheme}>
                <Epic activeStory={activeStory}>
                    <Root onTransition={() => {
                        console.log('Transitions ended')
                    }} className={rootClass} id="setup" activeView={activeView} popout={popout}>
                        <View id="setup" modal={homeModals}
                            activePanel={activePanel}
                            history={history}
                            onSwipeBack={() => goBack()}
                            header={false}
                            >
                            <SetupPanelBase id="setup"/>
                        </View>
                        <View id="addAccount" activePanel={activePanel}
                            history={history}
                            onSwipeBack={() => goBack()}>
                            <SetupPanelAddAccount id="addAccount"/>         
                        </View>
                        <View id="addBot" activePanel={activePanel}
                            history={history}
                            onSwipeBack={() => goBack()}
                            className="haveHeader">
                            <SetupPanelAddBot id="addBot"/>
                            <SelectAccount id="selectAccount"/>    
                        </View>
                        <View id="selectAccount" activePanel={activePanel}
                            history={history}
                            onSwipeBack={() => goBack()}
                            className="haveHeader">
                            <SelectAccount id="selectAccount"/>     
                        </View>
                        <View id="settings" activePanel={activePanel}
                            history={history}
                            onSwipeBack={() => goBack()}
                            className="haveHeader"
                            modal={homeModals}>
                            <PanelSettings id="settings"/>         
                        </View>
                    </Root>
                </Epic>
            </ConfigProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        activePanel: state.router.activePanel,
        activeStory: state.router.activeStory,
        panelsHistory: state.router.panelsHistory,
        activeModals: state.router.activeModals,
        popouts: state.router.popouts,
        scrollPosition: state.router.scrollPosition,
        headerContexts: state.router.headerContexts,
        colorScheme: state.vkui.colorScheme,
        userVKId: state.app.userVKId,
        canNotify: state.app.canNotify
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators(
            {
                setStory, 
                goBack, 
                closeModal, 
                setUserData, 
                openPopout, 
                closePopout, 
                setColorScheme,
                setStateData,
                openModal,
                setSnack,
                setAccounts,
                setPage
            }, dispatch
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);