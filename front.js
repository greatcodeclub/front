// Front - Our own frontend framework
Front = {}

Front.navigate = function(path) {
  window.history.pushState({}, "ignored", path)    
  Front.load()
}

Front.start = function() {
  $(window).on('popstate', Front.load)

  // Intercept link clicks
  $(document).on('click', 'a', function() {
    Front.navigate(this.href)
    return false
  })

  // Execute the route for the current location
  Front.load()
}

Front.routes = []

Front.route = function(path, callback, context) {
  path = path.replace(/:\w+/g, '([^/?]+)') // Replace named params (eg. :permalink)
  var regexp = new RegExp('^' + path + '$')

  this.routes.push({ regexp: regexp, callback: callback, context: context })
}

Front.load = function() {
  var url = window.location.pathname    

  for (var i = 0; i < Front.routes.length; i++) {
    var route = Front.routes[i]
    var matches = url.match(route.regexp)

    if (matches) {
      route.callback.call(route.context, matches.slice(1))
      return
    }
  }
}


// A nicer API

Front.Router = function(routes) {
  var self = this
  Object.keys(routes).forEach(function(path) {
    var callback = routes[path]
    // Bind the callback function to the current controller.
    Front.route(path, callback, self)
  })
}

Front.Router.prototype.render = function(template, data) {
  var html = $("[data-template-name='" + template + "']").html()
  // TODO cache this! We don't want to compile the template each time.
  var compiled = Handlebars.compile(html)

  $("#content").html(compiled(data))
}
