const knex = require('knex')
const easyvk = require('easyvk');
const electron = require('electron')
const {app, BrowserWindow, session} = electron

const db = knex({
  client: 'sqlite3',
  connection: './app.db',
  useNullAsDefault: true
});

let setuppedDb = false;

async function setupDB () {
  if (setuppedDb) return true;
  return new Promise(async (resolve, reject) => {
    await db.schema.createTable('accounts', (table) => {
      table.increments('id')
      table.string('first_name', 256) /** Имя аккаунта */
      table.string('last_name', 256) /** Фамилия аккаунта */
      table.string('photo_200', 2048) /** Фамилия аккаунта */
      table.bigInteger('vk_id') /** VK ID */
      table.string('access_token', 2048) /** Токен пользователя */
      table.string('username', 256) /** Токен пользователя */
    }).catch(e => {console.log(e)});
    setuppedDb = true;
    resolve(true);
  });
}

class Listeners extends Array {
  add (channel, listener) {
    this.push({
      channel,
      listener
    });
  }
}

const listeners = new Listeners();

listeners.add("ready", async ({ win }, f) => {
  win.webContents.send("ready-ok", {
    "response": "Ok!"
  })
});

listeners.add("get-accounts", async ({ win, reply }, f) => {
  console.log('Why accounts 22!?')
  let accounts = await setupDB();
  accounts = await db('accounts').select('*');
  console.log(accounts);
  win.webContents.send("get-accounts-response", accounts);
});

async function makeAuthUser (props={}) {
  return easyvk({
    username: props.username,
    password: props.password,
    fields: ['photo_200'],
    save_session: false,
    reauth: true,
    ...props
  }).catch(e => {
    return {
      error: true,
      e
    }
  });
}

function resError (message="") {
  return {
    error: true,
    message
  }
}

async function addUser (vk, props) {
  await db('accounts').insert({
    first_name: vk.session.first_name,
    last_name: vk.session.last_name,
    photo_200: vk.session.photo_200,
    vk_id: vk.session.user_id,
    access_token: vk.session.access_token,
    username: props.username
  });
}

listeners.add("add-account", async ({win}, f={}) => {
  console.log('Auth user with ', f, ' data');

  let captchaSid = f.captcha_sid;
  let captchaKey = f.captcha_key;

  let props = {
    username: f.username,
    password: f.password
  }

  if (captchaSid) {
    props.captcha_sid = captchaSid;
  }

  if (captchaKey) {
    props.captcha_key = captchaKey;
  }

  let account = await db('accounts').select('id').where('username', props.username);

  if (account.length) {
    win.webContents.send("add-account-response", resError("Такой аккаунт уже существует!"));
    return;
  }

  if (f.two_factor.length > 1) {
    props.code = f.two_factor;
  }

  console.log(props);
  let vk = await makeAuthUser(props);

  if (vk.error) {
    let isCaptcha = false;
    let jsonify = {}
    try {
      jsonify = JSON.parse(vk.e.message);
      isCaptcha = true;
    } catch (e) {
      isCaptcha = false;
    }

    if (isCaptcha) {
      vk.e = jsonify;
    } else if (vk.e.error_code === "need_validation" && vk.e.redirect_uri) {
      let focusedWindow    = BrowserWindow.getFocusedWindow();
      focusedWindow.loadURL(vk.e.redirect_uri);
      
      focusedWindow.webContents.on('did-finish-load', () => {
        focusedWindow.webContents.insertCSS('html,body{overflow:hidden !important;}');
      });

      let checkBrowserURLInterval = setInterval(async () => {
        let currentURL = win.webContents.getURL();
        if (currentURL.match('blank.html')) {
          focusedWindow = BrowserWindow.getFocusedWindow();
          focusedWindow.loadURL(`file://${__dirname}/app/index.html`);
          focusedWindow = BrowserWindow.getFocusedWindow();

          let props = {
            access_token: currentURL.match(/access_token=([^&]+)/)[0].split('=')[1],
            authType: 'user'
          }
          console.log(props);
          vk = await makeAuthUser(props);
          console.log(vk.session);
          await addUser(vk, props);
          let accounts = await db('accounts').select('*');
          focusedWindow.webContents.send("update-accounts", accounts);
          clearInterval(checkBrowserURLInterval);
        }
      }, 250);

      return;
    }

    console.log('Erorr', vk);
    win.webContents.send("add-account-response", vk);
    return;
  } else {
    await addUser(vk, props);
    let accounts = await db('accounts').select('*');
    win.webContents.send("add-account-response", accounts);
  }
});

listeners.add("delete-account", async ({win}, data) => {
  await db('accounts').where('id', data.account_id).del();
  let accounts = await db('accounts').select('*');
  win.webContents.send("delete-account-response", accounts);
});

listeners.add("update-scheme", async ({win}, data) => {
  win.webContents.send("update-scheme", data);
});

module.exports = listeners;
