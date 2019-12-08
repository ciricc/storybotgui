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

import {store} from '../../../index';

export const setUserData = (userVKId, userFirstName, userLastName, userPhoto, showOnboarding=true, canNotify=false, permissionLevel=-1, adminId=0) => {
  return {
    type: SET_USER_DATA,
    payload: {
      userVKId: Number(userVKId),
      userFirstName,
      userLastName,
      userPhoto,
      showOnboarding,
      canNotify
    }
  }
}

export const setActiveMainTab = (activeMainTab='minecraft') => (
  {
    type: SET_ACTIVE_MAIN_TAB,
    payload: {
      activeMainTab
    } 
  }
)

export const setServers = (servers = []) => (
  {
    type: SET_SERVERS,
    payload: {
      servers
    }
  }
)

export const setMyServers = (servers = []) => (
  {
    type: SET_MY_SERVERS,
    payload: {
      myServers: servers
    }
  }
)

export const setInfiniteScrolls = (infiniteScrolls) => (
  {
    type: SET_INFINITE_SCROLLS,
    payload: {
      infiniteScrolls
    }
  }
);

export const setSnack = (snack, initer="") => {
  const {activePanel} = store.getState().router;
  return {
    type: SET_SNACK,
    payload: {
      snack,
      snackIniter: initer ? initer : snack ? activePanel : ""
    } 
  }
}

export const setFloodWallPosts = (floodWallPosts=[]) => (
  {
    type: SET_FLOOD_WALL_POSTS,
    payload: {
      floodWallPosts
    } 
  }
)

export const setNeedUpdateFloodWall = (newState=true) => (
  {
    type: SET_NEED_UPDATE_FLOOD_WALL,
    payload: {
      needUpdateFloodWall: newState
    } 
  }
)

export const setStateData = (state={}) => (
  {
    type: SET_STATE_DATA,
    payload: state   
  }
)

export const setPays = (pays=[]) => (
  {
    type: SET_PAYS,
    payload: {
      pays
    }
  }
)

export const setSearchQuery = (query="") => (
  {
    type: SET_SEARCH_QUERY,
    payload: {
      searchQuery: query
    }  
  }
)

export const updateServer = (server={}) => (
  {
    type: UPDATE_SERVER,
    payload: {
      server
    }
  }
)

export const saveScrollPosition = (panelName="", scroll={}) => (
  {
    type: SET_CUSTOM_SCROLL_POSITION,
    payload: {
      panelName,
      scroll
    } 
  }
)

export const setActivePay = (pay=false) => (
  {
      type: SET_ACTIVE_PAY,
      payload: {
        activePay: pay
      }
  }
)

export const setAccounts = (accounts=[]) => (
  {
    type: SET_ACCOUNTS,
    payload: {
      accounts
    }
  }
)