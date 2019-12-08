import {
  SET_USER_DATA, 
  SET_ACTIVE_MAIN_TAB,
  SET_SERVERS,
  SET_INFINITE_SCROLLS,
  SET_SNACK,
  SET_FLOOD_WALL_POSTS,
  SET_NEED_UPDATE_FLOOD_WALL,
  SET_STATE_DATA,
  SET_PAYS,
  SET_SEARCH_QUERY,
  UPDATE_SERVER,
  SET_MY_SERVERS,
  SET_CUSTOM_SCROLL_POSITION,
  SET_ACTIVE_PAY,
  SET_ACCOUNTS
} from './actionTypes';

const initialState = {
  infiniteScrolls: {},
  snack: null,
  accounts: [],
  activeItemTab: 0,
  selectedAccount: null,
  formAddBotCollectors: [],
  addBotSelectsAccount: false
};

export const appReducer = (state=initialState, action) => {
  switch (action.type) {
    case SET_STATE_DATA:
      return {
        ...state,
        ...action.payload
      }
      break;
    case UPDATE_SERVER:
      let servers = [...state.servers];
      let myServers = [...state.myServers];

      let serverIndex = -1;
      
      for (let i = 0; i < servers.length; i++) {
        let server = servers[i];
        if (server.id === action.payload.server.id) {
          serverIndex = i;
          break;
        }
      }

      if (serverIndex !== -1) {
        servers[serverIndex] = action.payload.server;
      }

      serverIndex = -1;
      
      for (let i = 0; i < myServers.length; i++) {
        let server = myServers[i];
        if (server.id === action.payload.server.id) {
          serverIndex = i;
          break;
        }
      }

      if (serverIndex !== -1) {
        myServers[serverIndex] = action.payload.server;
      }
      
      return {
        ...state,
        servers,
        myServers
      }

      break;
    case SET_CUSTOM_SCROLL_POSITION:
      let scrollPositions = {...state.scrollPositions};
      scrollPositions[action.payload.panelName] = action.payload.scroll;

      return {
        ...state,
        scrollPositions
      }
      
      break;
    case SET_SNACK:  
    case SET_USER_DATA:
    case SET_ACTIVE_MAIN_TAB:
    case SET_SERVERS:
    case SET_MY_SERVERS:
    case SET_INFINITE_SCROLLS:
    case SET_FLOOD_WALL_POSTS:
    case SET_NEED_UPDATE_FLOOD_WALL:
    case SET_SEARCH_QUERY:
    case SET_PAYS:
    case SET_ACTIVE_PAY:
    case SET_ACCOUNTS:
      console.log('[Store] update application state', action.type)
      console.log('[Store] update state value', action.payload)
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}