import {
    SET_PAGE,
    GO_BACK,
    OPEN_POPOUT,
    CLOSE_POPOUT,
    OPEN_MODAL,
    CLOSE_MODAL,
    SET_STORY,
    OPEN_HEADER_CONTEXT,
    CLOSE_HEADER_CONTEXT
} from './actionTypes';

import * as VK from "../../services/VK";
import {smoothScrollToTop} from "../../services/_functions";


const initialState = {
    activeStory: null,
    activeView: null,
    activePanel: null,
    activeHash: null,

    storiesHistory: [],
    viewsHistory: [],
    panelsHistory: [],

    activeModals: [],
    modalHistory: [],
    popouts: [],

    scrollPosition: [],
    activeModalProps: {},
    headerContexts: [],
    routeParams: {},
    hashParams: {},
    storiesHashes: {}
};

export const routerReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_PAGE: {
            let View = action.payload.view;
            let Panel = action.payload.panel;
            let {hash, hashParams} = action.payload;

            window.history.pushState(null, null);

            let panelsHistory = state.panelsHistory[View] || [];
            let viewsHistory = state.viewsHistory[state.activeStory] || [];
            let {storiesHashes} = state;

            if (!storiesHashes[state.activeStory]) {
                storiesHashes[state.activeStory] = {
                    hashes: [], // История хешей в окнтексте одной story
                    hashParams: [] // История параметров хешей в контексте этой story
                } 
            }

            if (!hash) {
                storiesHashes[state.activeStory].hashParams.push(hashParams || {});
            }

            const viewIndexInHistory = viewsHistory.indexOf(View);

            if (viewIndexInHistory !== -1) {
                viewsHistory.splice(viewIndexInHistory, 1);
            }

            if (panelsHistory.indexOf(Panel) === -1) {
                panelsHistory = [...panelsHistory, Panel];
            }

            if (panelsHistory.length > 1) {
                VK.swipeBackOn();
            }


            return {
                ...state,
                activeView: View,
                activePanel: Panel,

                panelsHistory: {
                    ...state.panelsHistory,
                    [View]: panelsHistory,
                },
                viewsHistory: {
                    ...state.viewsHistory,
                    [state.activeStory]: [...viewsHistory, View]
                },
                scrollPosition: {
                    ...state.scrollPosition,
                    [state.activeStory + "_" + state.activeView + "_" + state.activePanel]: window.pageYOffset
                },
                storiesHashes
            };
        }

        case OPEN_HEADER_CONTEXT: {
            window.history.pushState(null, null);
            let headerContexts = new Set([...state.headerContexts, action.payload.id]);
            headerContexts = Array.from(headerContexts);
            return {
                ...state,
                headerContexts: headerContexts
            }
        }

        case CLOSE_HEADER_CONTEXT: {
            let headerContexts = [...state.headerContexts];
            let haveIndex = headerContexts.indexOf(action.payload.id);
            if (haveIndex >= 0) {
                headerContexts.splice(haveIndex, 1);
            }

            return {
                ...state,
                headerContexts: headerContexts
            }
        }

        case SET_STORY: {
            window.history.pushState(null, null);

            let viewsHistory = state.viewsHistory[action.payload.story] || [action.payload.story];

            let storiesHistory = state.storiesHistory;
            let activeView = viewsHistory[viewsHistory.length - 1];
            let panelsHistory = state.panelsHistory[activeView] || [action.payload.initial_panel];
            let activePanel = panelsHistory[panelsHistory.length - 1];
            let headerContexts = [...state.headerContexts];

            let hashParams = {...state.hashParams};
            let { storiesHashes } = state;

            if (!storiesHashes[action.payload.story]) {
                storiesHashes[action.payload.story] = {
                    hashes: [], // История хешей в окнтексте одной story
                    hashParams: [] // История параметров хешей в контексте этой story
                } 
            }


            let hashesHistory = storiesHashes[action.payload.story].hashes;
            let hashesParamsHistory = storiesHashes[action.payload.story].paramsHashes;


            if (action.payload.story === state.activeStory && !action.payload.settingView) {
                if (panelsHistory.length > 1) {
                    let firstPanel = panelsHistory.shift();
                    panelsHistory = [firstPanel];

                    activePanel = panelsHistory[panelsHistory.length - 1];
                } else if (viewsHistory.length > 1) {
                    let firstView = viewsHistory.shift();
                    viewsHistory = [firstView];

                    activeView = viewsHistory[viewsHistory.length - 1];
                    panelsHistory = state.panelsHistory[activeView];
                    activePanel = panelsHistory[panelsHistory.length - 1];
                }

                if (headerContexts.length > 0) {
                    headerContexts.pop();
                }

                if (storiesHashes[action.payload.story].hashes.length && (!action.payload.hash || (action.payload.hash && action.payload.hash === hashesHistory[hashesHistory.length - 1]))) {
                    storiesHashes[action.payload.story].hashes.pop();
                }

                if (storiesHashes[action.payload.story].hashParams.length && (!action.payload.hash || (action.payload.hash && action.payload.hash === hashesHistory[hashesHistory.length - 1]))) {
                    storiesHashes[action.payload.story].hashParams.pop();
                }
            }

            if (action.payload.story === state.activeStory 
                && panelsHistory.length === 1 && window.pageYOffset > 0
                && !action.payload.hash) {
                window.scrollTo(0, 30);

                smoothScrollToTop();
            }

            const storiesIndexInHistory = storiesHistory.indexOf(action.payload.story);

            if (storiesIndexInHistory === -1 || (storiesHistory[0] === action.payload.story && storiesHistory[storiesHistory.length - 1] !== action.payload.story)) {
                storiesHistory = [...storiesHistory, action.payload.story];
            }

            if (action.payload.hash) {
                storiesHashes[action.payload.story].hashes.push(action.payload.hash || '')
                let hashParams = action.payload.hashParams || {};
                console.log('push', hashParams)
                storiesHashes[action.payload.story].hashParams.push(hashParams)
            }

            let currentStoriesHashes = storiesHashes[action.payload.story];
            console.log(currentStoriesHashes);
            
            return {
                ...state,
                activeStory: action.payload.story,
                activeView: activeView,
                activePanel: activePanel,

                storiesHistory: storiesHistory,
                viewsHistory: {
                    ...state.viewsHistory,
                    [activeView]: viewsHistory
                },
                panelsHistory: {
                    ...state.panelsHistory,
                    [activeView]: panelsHistory
                },

                scrollPosition: {
                    ...state.scrollPosition,
                    [state.activeStory + "_" + state.activeView + "_" + state.activePanel]: window.pageYOffset
                },
                headerContexts: headerContexts,
                activeHash: currentStoriesHashes.hashes[currentStoriesHashes.hashes.length - 1],
                storiesHashes: storiesHashes,
                hashParams: currentStoriesHashes.hashParams[currentStoriesHashes.hashParams.length - 1]
            };
        }

        case GO_BACK: {
            let setView = state.activeView;
            let setPanel = state.activePanel;
            let setStory = state.activeStory;
            let hashesHistory;
            let hashesParamsHistory;
            let { hashParams } = state;
            let { storiesHashes } = state;
            let { activeHash } = state;

            let popoutsData = state.popouts;

            if (popoutsData[setView]) {
                popoutsData[setView] = null;

                return {
                    ...state,
                    popouts: {
                        ...state.popouts, popoutsData
                    }
                };
            }

            let viewModalsHistory = state.modalHistory[setView];


            if (viewModalsHistory !== undefined && viewModalsHistory.length !== 0) {
                let activeModal = viewModalsHistory[viewModalsHistory.length - 2] || null;

                if (activeModal === null) {
                    viewModalsHistory = [];
                } else if (viewModalsHistory.indexOf(activeModal) !== -1) {
                    viewModalsHistory = viewModalsHistory.splice(0, viewModalsHistory.indexOf(activeModal) + 1);
                } else {
                    viewModalsHistory.push(activeModal);
                }

                return {
                    ...state,
                    activeModals: {
                        ...state.activeModals,
                        [setView]: activeModal
                    },
                    modalHistory: {
                        ...state.modalHistory,
                        [setView]: viewModalsHistory
                    }
                };
            }

            let panelsHistory = state.panelsHistory[setView] || [];
            let viewsHistory = state.viewsHistory[state.activeStory] || [];
            let storiesHistory = state.storiesHistory;

            if (panelsHistory.length > 1) {
                console.log(panelsHistory, 'go back before')
                panelsHistory.pop();

                setPanel = panelsHistory[panelsHistory.length - 1];
            } else if (viewsHistory.length > 1) {
                console.log(viewsHistory, 'go back before')

                viewsHistory.pop();

                setView = viewsHistory[viewsHistory.length - 1];
                let panelsHistoryNew = state.panelsHistory[setView];
                console.log(panelsHistoryNew, 'new panels history');

                setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
            } else if (storiesHistory.length > 1 && action.payload.from === 'Android') {
                storiesHistory.pop();

                setStory = storiesHistory[storiesHistory.length - 1];
                setView = state.viewsHistory[setStory][state.viewsHistory[setStory].length - 1];

                let panelsHistoryNew = state.panelsHistory[setView];

                if (panelsHistoryNew.length > 1) {
                    setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
                } else {
                    setPanel = panelsHistoryNew[0];
                }
            } else {
                console.log('CLosing app', hashesHistory);
                VK.closeApp();
            }

            let currentStoriesHashes = storiesHashes[state.activeStory];

            if (currentStoriesHashes) {
                if (currentStoriesHashes.hashes.length) {
                    currentStoriesHashes.hashes.pop();
                    console.log('pop')
                }
                if (currentStoriesHashes.hashParams.length) {
                    console.log('pop')
                    currentStoriesHashes.hashParams.pop()
                }

                hashParams = currentStoriesHashes.hashParams[currentStoriesHashes.hashParams.length - 1];
                activeHash = currentStoriesHashes.hashes[currentStoriesHashes.hashes.length - 1];               
            }

            if (panelsHistory.length === 1 && action.payload.from === 'iOS') {
                VK.swipeBackOff();
            }

            console.log(storiesHashes, 'go back ater', setView, setPanel, setStory);

            return {
                ...state,
                activeView: setView,
                activePanel: setPanel,
                activeStory: setStory,

                viewsHistory: {
                    ...state.viewsHistory,
                    [state.activeView]: viewsHistory
                },
                panelsHistory: {
                    ...state.panelsHistory,
                    [state.activeView]: panelsHistory
                },
                storiesHashes,
                hashParams,
                activeHash
            };
        }

        case OPEN_POPOUT: {
            window.history.pushState(null, null);

            return {
                ...state,
                popouts: {
                    ...state.popouts,
                    [state.activeView]: action.payload.popout
                }
            };
        }

        case CLOSE_POPOUT: {
            return {
                ...state,
                popouts: {
                    ...state.popouts,
                    [state.activeView]: null
                }
            };
        }

        case OPEN_MODAL: {
            window.history.pushState(null, null);

            let activeModal = action.payload.id || null;
            let modalProps = action.payload.modalProps || {};
            let modalsHistory = state.modalHistory[state.activeView] ? [...state.modalHistory[state.activeView]] : [];

            if (activeModal === null) {
                modalsHistory = [];
            } else if (modalsHistory.indexOf(activeModal) !== -1) {
                modalsHistory = modalsHistory.splice(0, modalsHistory.indexOf(activeModal) + 1);
            } else {
                modalsHistory.push(activeModal);
            }

            return {
                ...state,
                activeModals: {
                    ...state.activeModals,
                    [state.activeView]: activeModal
                },
                modalHistory: {
                    ...state.modalHistory,
                    [state.activeView]: modalsHistory
                },
                activeModalProps: modalProps
            };
        }

        case CLOSE_MODAL: {
            let activeModal = state.modalHistory[state.activeView][state.modalHistory[state.activeView].length - 2] || null;
            let modalsHistory = state.modalHistory[state.activeView] ? [...state.modalHistory[state.activeView]] : [];

            if (activeModal === null) {
                modalsHistory = [];
            } else if (modalsHistory.indexOf(activeModal) !== -1) {
                modalsHistory = modalsHistory.splice(0, modalsHistory.indexOf(activeModal) + 1);
            } else {
                modalsHistory.push(activeModal);
            }

            return {
                ...state,
                activeModals: {
                    ...state.activeModals,
                    [state.activeView]: activeModal
                },
                modalHistory: {
                    ...state.modalHistory,
                    [state.activeView]: modalsHistory
                }
            };
        }

        default: {
            return state;
        }
    }
};