import {
    SET_PAGE, 
    SET_STORY, 
    GO_BACK, 
    OPEN_POPOUT, 
    CLOSE_POPOUT, 
    OPEN_MODAL, 
    CLOSE_MODAL,
    CLOSE_HEADER_CONTEXT,
    OPEN_HEADER_CONTEXT
} from './actionTypes';

import {routesRegExps, routes} from "../../services/routes";

export const setStory = (story, initial_panel, hash="", params={}, settingView="") => (
    {
        type: SET_STORY,
        payload: {
            story: story,
            initial_panel: initial_panel,
            hashParams: params,
            hash,
            settingView
        }
    }
);

export const setPage = (view, panel, hash="", params={}) => (
    {
        type: SET_PAGE,
        payload: {
            view: view,
            panel: panel,
            hashParams: params,
            hash
        }
    }
);

export const goBack = (from = 'iOS') => (
    {
        type: GO_BACK,
        payload: {
            from: from
        }
    }
);

export const openPopout = (popout) => (
    {
        type: OPEN_POPOUT,
        payload: {
            popout: popout
        }
    }
);

export const closePopout = () => (
    {
        type: CLOSE_POPOUT
    }
);

export const openModal = (id, props={}) => (
    {
        type: OPEN_MODAL,
        payload: {
            id,
            modalProps:  props
        }
    }
);

export const closeModal = () => (
    {
        type: CLOSE_MODAL
    }
);

export const openHeaderContext = (id="") => (
    {
        type: OPEN_HEADER_CONTEXT,
        payload: {
            id: id
        }
    }
)

export const closeHeaderContext = (id="") => (
    {
        type: CLOSE_HEADER_CONTEXT,
        payload: {
            id: id
        }
    }
)

export const setRouteHash = (hash="", params={}) => {
    return (dispatch) => {
        let matched = false;
        for (let route in routesRegExps) {
            if (hash.match(routesRegExps[route].regExp)) {
                matched = routesRegExps[route];
            }
        }

        if (matched) {
            if (matched.params) {
                let matchedParams = matched.params(hash.match(matched.regExp));
                params = {
                    ...params,
                    ...matchedParams
                }
                console.log(params);
            }

            dispatch(setStory(matched.story, matched.panel, hash, params, matched.view))
            dispatch(setPage(matched.view, matched.panel, hash, params))
        } 
    }
}