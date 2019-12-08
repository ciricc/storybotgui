// Polyfills
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'url-search-params-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';

import {applyMiddleware, createStore} from "redux";
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import rootReducer from './js/store/reducers';

import {composeWithDevTools} from 'redux-devtools-extension';
import {setStory} from "./js/store/router/actions";


// Styles importings
import '@vkontakte/vkui/dist/vkui.css';
import './css/main.css';

import {GROUP_LINK, ERROR_NOTIFICATION_MESSAGE} from './js/services/constants';

import App from './App';


export const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk),
));

store.dispatch(setStory('setup', 'setup'));

/** Error handling function for best user excperience */
window.onerror = function (errorMsg, url, lineNumber, columnNumber, error) {
    let textAoutput = ERROR_NOTIFICATION_MESSAGE.replace(/\{GROUP_LINK\}/g, GROUP_LINK) + ' <br/><pre>'+ errorMsg 
    + '\n' +  url + ':' + lineNumber + ':' + columnNumber + '\n' + (error || {}).stack + '</pre><br/>' + window.navigator.userAgent;

    document.body.innerHTML = textAoutput;
    console.error(error);
    console.info(textAoutput);
    return false;
}

const root = document.getElementById('root');

window.debug = true;

mVKMiniAppsScrollHelper(root);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    root
);