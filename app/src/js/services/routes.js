const routes = {
	'^hash\_link': {
		story: "main",
		view: "main",
		panel: "hash_link"
	},
  'server': {
    story: "main",
    view: "main",
    panel: "fullServer"
  },
  'profile_server': {
    story: "profile",
    view: "profile",
    panel: "fullServerProfile"
  },
  'verify_main': {
    story: "main",
    view: "main",
    panel: "verify_main"
  },
  'upgrade_main': {
    story: "main",
    view: "main",
    panel: "upgrade_main"
  },
  'verify_profile': {
    story: "profile",
    view: "profile",
    panel: "verify_profile"
  }
}

let routesRegExps = {}

for (let route in routes) {
     routesRegExps[route] = {
        ...(routes[route]),
        regExp: new RegExp(route, routes[route].flags)
    }
}


export {routes, routesRegExps}