import { createHashHistory } from 'history';

const history = createHashHistory({
  hashType: 'slash'
});

window.globalHistoryLength = 0;
window.navHistory = [];

history.length = 0;

history.listen((loc, act, a) => {
  console.log(a)
  if (act === "PUSH") {
    window.navHistory.push(loc)
    history.length += 1;
    window.globalHistoryLength += 1;
  } else if (act === "POP") {
    window.navHistory = window.navHistory.slice(0,window.navHistory.length - 2);
    window.globalHistoryLength -= 1;
    history.length -= 1
  }

})

export default history;