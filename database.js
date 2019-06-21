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

listeners.add("get-accounts", async ({ win }, f) => {
  win.webContents.send("get-accounts-response", [{
    first_name: 'Кирилл',
    last_name: 'Новак',
    photo_200: 'https://sun1-85.userapi.com/c850232/v850232545/13281c/sUEmokE8378.jpg?ava=1',
    status: 1
  }, {
    first_name: 'Кирилл',
    last_name: 'Новак',
    photo_200: 'https://sun1-85.userapi.com/c850232/v850232545/13281c/sUEmokE8378.jpg?ava=1',
    status: 1
  }, {
    first_name: 'Кирилл',
    last_name: 'Новак',
    photo_200: 'https://sun1-85.userapi.com/c850232/v850232545/13281c/sUEmokE8378.jpg?ava=1',
    status: 1
  }, {
    first_name: 'Кирилл',
    last_name: 'Новак',
    photo_200: 'https://sun1-85.userapi.com/c850232/v850232545/13281c/sUEmokE8378.jpg?ava=1',
    status: 1
  }])
})


module.exports = listeners;
