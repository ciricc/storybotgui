import { matchPath } from 'react-router-dom';

let routes = {
  '/': {
    activeView: 'mainPage',
    activePanel: 'main'
  },
  '/addBot' : {
    activeView: 'mainPage',
    activePanel: 'addBot'
  }
}

export default function getRoute (pathname) {
  for (let path in routes) {
    
    let obj = matchPath(pathname, {
      path: path,
      strict: false,
      exact: true
    });

    if (obj) {
      let state = routes[path];

      if (!state.activePanel) state.activePanel = state.activeView;
      if (state.showTabs !== false) state.showTabs = true;
      
      state.match = obj;
      return state;
    }

  }

  let s = routes['/'];
  
  s.activePanel = s.activeView;
  s.showTabs = true;

  return s;
}