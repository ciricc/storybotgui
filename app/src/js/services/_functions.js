import {store} from "../../index";

export const smoothScrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;

    if (c > 30) {
        return;
    }

    if (c > 0) {
        window.requestAnimationFrame(smoothScrollToTop);
        window.scrollTo(0, c - c / 8);
    }
};

export const sortObject = (obj={}) => {
    let _obj = {}
    let keys = Object.keys(obj);
    keys = keys.sort();
    keys.forEach(key => {
        _obj[key] = obj[key];
    });
    return _obj;
}

export const restoreScrollPosition = () => {
    let scrolls = store.getState().vkui.componentScroll;

    Object.keys(scrolls).forEach((component) => {
        let componentData = scrolls[component];

        let element = document.getElementById(component);

        if (element) {
            element = element.getElementsByClassName("HorizontalScroll__in")[0];

            element.scrollLeft = componentData.x;
            element.scrollTop = componentData.y;
        }
    });
};

/** Функция для склонения существительных по числительному (5 листокв, 1 листок, 3 листка): decOfFum(num, ["листок", "листка", "листков"]) */
export const decOfNum = (number, titles) => {
  let decCases = [2, 0, 1, 1, 1, 2];
  return titles[number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)]];
}

/** Функция для преобразования секунд в строку */
export const createdTimeToString = (secs=0) => {
    let currentDate = new Date();
    let currentSecs = Math.floor(currentDate.getTime() / 1000);
    let deltaTime = currentSecs - secs;

    if (deltaTime < -50) {
        console.log(deltaTime)
        return "пост из будущего";
    }

    if (deltaTime < 20) {
        return "только что";
    } else if (deltaTime < 60) {
        return deltaTime + " " + decOfNum(deltaTime, ["секунду", "секунды", "секунд"]) + " назад";
    }

    let deltaTimeMinutes = Math.floor(deltaTime / 60);
    let deltaTimeHours = Math.floor(deltaTimeMinutes / 60);
    let deltaTimeDays = Math.floor(deltaTimeHours / 24);

    if (deltaTimeDays > 0) {
        return getFullDate(secs);
    } else if (deltaTimeHours > 0) {
        return deltaTimeHours + " " + decOfNum(deltaTimeHours, ["час", "часа", "часов"]) + " назад";
    } else if (deltaTimeMinutes > 0) {
        return deltaTimeMinutes + " " + decOfNum(deltaTimeMinutes, ["минуту", "минуты", "минут"]) + " назад"
    }

} 

export const getFullDate = (secs) => {
    let fullDateObj = new Date(secs * 1000);
    let monthes = [
        "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа",
        "сентября", "октября", "ноября", "декабря"
    ];

    let fullYear = fullDateObj.getFullYear();
    let fullYearString = fullYear === new Date().getFullYear() ? "" : fullYear;
    let fullMonth = fullDateObj.getMonth() + 1;
    let fullMonthName = monthes[fullMonth - 1];
    let dateString = fullDateObj.getDate();
    let hoursString = fullDateObj.getHours();
    let minutesString = fullDateObj.getMinutes();
    
    if (hoursString < 10) hoursString = '0' + String(hoursString);

    return `${dateString} ${fullMonthName} ${fullYearString} в ${hoursString}:${minutesString}`;
}