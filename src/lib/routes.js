import { matchPath } from 'react-router-dom';

let routes = {
  '/': {
    activeView: 'mainPage',
    activePanel: 'main'
  },
  '/addBot' : {
    activeView: 'mainPage',
    activePanel: 'addBot'
  },
  '/trends/article/:id': {
    activeView: 'trends',
    activeTab: 'trends',
    activePanelTab: 'article_trends',
    hideTabbar: true
  },
  '/trends/author/:id/:aid': {
    activeView: 'trends',
    activeTab: 'trends',
    activePanelTab: 'author_trends',
    hideTabbar: true
  },
  '/search' : {
    activeView: 'search',
    activeTab: 'search',
    activePanelTab: 'main'
  },
  '/search/categories' : {
    activeView: 'search',
    activeTab: 'search',
    activePanelTab: 'categories',
    hideTabbar: true
  },
  '/search/author/:id/:catid' : {
    activeView: 'search',
    activeTab: 'search',
    activePanelTab: 'author',
    hideTabbar: true
  },
  '/search/article/author/:arid/:aid' : {
    activeView: 'search',
    activeTab: 'search',
    activePanelTab: 'author',
    hideTabbar: true
  },
  '/search/article/:arid': {
    activeView: 'search',
    activeTab: 'search',
    activePanelTab: 'article_search',
    hideTabbar: true
  },
  '/search/category/:id': {
    activeView: 'search',
    activeTab: 'search',
    activePanelTab: 'category',
    hideTabbar: true
  },
  '/category/:id': {
    activeView: 'search',
    activeTab: 'search',
    activePanelTab: 'category',
    hideTabbar: true
  },
  '/subscriptions': {
    activeView: 'subscriptions',
    activeTab: 'subscriptions',
    activePanelTab: 'subscriptions'
  },
  '/testing': {
    activeView: 'testing',
    activeTab: 'testing',
    activePanelTab: 'testing'
  },
  '/about': {
    activeView: 'home',
    activeTab: 'home',
    activePanelTab: 'about',
    hideTabbar: true
  },
  '/guide': {
    activeView: 'guide',
    activeTab: 'testing',
    activePanelTab: 'testing'
  },
  '/test': {
    activeView: 'home',
    activeTab: 'home',
    activePanelTab: 'home'
  },
  '/subscriptions/author/:id': {
    activeView: 'subscriptions',
    activeTab: 'subscriptions',
    activePanelTab: 'author_subs',
    hideTabbar: true
  },
  '/article:id': {
    activeView: 'home',
    activeTab: 'home',
    activePanelTab: 'article_home',
    hideTabbar: true
  },
  '/article/:id': {
    activeView: 'home',
    activeTab: 'home',
    activePanelTab: 'article_home',
    hideTabbar: true
  },
  '/article/subscriptions/:id': {
    activeView: 'article',
    activeTab: 'subscriptions'
  },
  '/article/trends/:id': {
    activeView: 'article',
    activeTab: 'trends'
  },
  '/author/:id': {
    activeView: 'home',
    activeTab: 'home',
    activePanelTab: 'author_home',
    hideTabbar: true
  },
  '/author/:id/:aid': {
    activeView: 'home',
    activeTab: 'home',
    activePanelTab: 'author_home_a',
    hideTabbar: true
  },
  '/author/subscriptions/:id': {
    activeView: 'author',
    activeTab: 'subscriptions',
    hideTabbar: true
  },
  '/author/trends/:id': {
    activeView: 'author',
    activeTab: 'trends',
    hideTabbar: true
  },
  '/pc': {
    activeView: 'pc'
  },
  '/public:pubid': {
    activeView: 'home',
    activeTab: 'home',
    activePanelTab: 'author_home'
  },
  '/id:uid': {
    activeView: 'home',
    activeTab: 'home',
    activePanelTab: 'author_home'
  }
}

export default function getRoute (pathname) {
  for (let path in routes) {
    
    let obj = matchPath(pathname, {
      path: path,
      strict: false,
      exact: true
    })
    

    if (obj) { 
      let state = routes[path];

      if (!state.activePanel) {
        state.activePanel = state.activeView;
      }

      if (state.showTabs !== false) {
        state.showTabs = true;
      }
      
      state.match = obj;
      console.log(obj);
      return state;
    }
  }

  let s = routes['/'];
  
  s.activePanel = s.activeView;
  s.showTabs = true;

  return s;
}