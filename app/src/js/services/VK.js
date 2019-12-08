import VKConnectOld from "@vkontakte/vk-connect";
import VKConnect from "@vkontakte/vkui-connect-promise";

import {store} from "../../index";

import {setColorScheme, setAccessToken} from "../store/vk/actions";

export const APP_ID =  7167476;
export const GROUP_ID = 187886147;

const API_VERSION = '5.101';

export const initApp = () => (dispatch) => {
    const VKConnectOldCallback = (e) => {
        if (e.detail.type === 'VKWebAppUpdateConfig') {
            VKConnectOld.unsubscribe(VKConnectOldCallback);

            dispatch(setColorScheme(e.detail.data.scheme));
        }
    };

    VKConnectOld.subscribe(VKConnectOldCallback);
    VKConnect.send('VKWebAppInit', {});
};

export const getAuthToken = (scope) => (dispatch) => {
    VKConnect.send("VKWebAppGetAuthToken", {
        "app_id": APP_ID,
        "scope": scope.join(',')
    }).then(data => {
        dispatch(setAccessToken(data.data.access_token));
    }).catch(() => {
        dispatch(setAccessToken(null));
    });
};

export const closeApp = () => {
    VKConnect.send("VKWebAppClose", {"status": "success"});
};

export const swipeBackOn = () => {
    VKConnect.send("VKWebAppEnableSwipeBack", {});
};

export const swipeBackOff = () => {
    VKConnect.send("VKWebAppDisableSwipeBack", {});
};

export const groupsGet = () => {
    return APICall('groups.get', {
        "extended": "1",
        "fields": "description",
        "count": "100"
    });
};

export const APICall = (method, params) => {
    params['access_token'] = store.getState().vkui.accessToken;
    params['v'] = params['v'] === undefined ? API_VERSION : params['v'];

    return VKConnect.send("VKWebAppCallAPIMethod", {
        "method": method,
        "params": params
    }).then(data => {
        return data.data.response;
    }).catch(error => {
        return error;
    });
};

export const shareAppLink = (link="") => {
    VKConnect.send("VKWebAppShare", {
        link: "https://vk.com/app" + String(APP_ID) + "#" + link
    })
}

export const setStatusBarColor = (color="dark", background="#fff") => {
    VKConnect.send("VKWebAppSetViewSettings", {
        "status_bar_style": color, 
        "action_bar_color": background
    });
}