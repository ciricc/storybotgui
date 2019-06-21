Привет! Это - Storybot GUI.

# Storybot GUI

Storybot - это бот для просмотра историй ВКонтакте автоматически (о нем тут - <a href="https://github.com/ciricc/storybot"/>github.com/ciricc/storybot</a>). Мне показалось, что недостаточно просто предоставить API этого бота, к нему не хватает интерфейса и простого взаимодействия для пользователя.

Кроме того, по скольку вы видите этот репозиторий, этот проект является примером работы связки двух технологий: React и Electron. А для создания интерфейса в коде используется библиотека компонентов <a href="https://github.com/VKCOM/VKUI/">VK UI</a>


## Как запустить? (Windows)

<b>Если вы разработчик</b> - то нужно скачать данный репозиторий через команду `git clone`

```shell
git clone https://github.com/ciricc/storybotgui.git && cd storybotgui
```

Далее необходимо запустить build

```shell
npm i && npm run build
```

### Спеициальный билды под другие архитектуры и платформы

#### Windows x64
```shell
npm run production_win_x64
```

#### Windows x32
```shell
npm run production_win_x32
```

Теперь вы можете запускать готовый exe файл из папки `dist`

<b>Если вы пользователь</b> - скачайте последнюю собранную версию приложения в разделе <b>releases</b> на странице github репозитория

#### Как это работает?
Для создания GUI используется связка нескольких технологий: 

* <a href="https://electronjs.org/" target="_blank"><b>Electron</b></a> - для создания окон программы и для управления нативными API
* <a href="https://ru.reactjs.org/" target="_blank"><b>React</b></a> - для создания реактивного интерфейса под Frontend
* <a href="https://github.com/VKCOM/VKUI" target="_blank"><b>Библиотека компонентов VK UI</b></a> - для создания самого UI

Для создания шаблона приложения в связке React + Electron использовался репозиторий <a href="https://github.com/pastahito/electron-react-webpack" target="_blank">electron-react-webpack</a>, если тоже будете его использовать, рекомендую обновить все модули до последних версий, чтобы не возникало неожиданных багов, а так же, настроить main.js (main_process) под Dev и Production версию (electron-reload) вместе с Babel и дполнительными к нему плагинами (смотрите мой `.babelrc`)

Плюс данного модуля заключается в том, что в нем уже настроена поддержка Webpack, Babel, React и Electron, а также настроена поддержка `electron-renderer` для получения доступа к нативным API внутри React 