import {combineReducers} from "redux";
import {routerReducer} from './router/reducers';
import {vkuiReducer} from './vk/reducers';
import {formDataReducer} from "./formData/reducers";
import {appReducer} from './app/reducers';
import {uiReducer} from "./ui/reducers";

export default combineReducers({
    vkui: vkuiReducer,
    router: routerReducer,
    formData: formDataReducer,
    app: appReducer,
    ui: uiReducer
});