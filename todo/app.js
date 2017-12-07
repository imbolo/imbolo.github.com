Parse.serverURL = 'http://api.mrcoder.org:1337/parse'
Parse.initialize('Nd123dadc', 'JSx1dfcasdf')
var Todo = Parse.Object.extend('Todo')

FastClick.attach(document.body)
var isIos = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.done
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.done
    })
  }
}

var bind = function(subscription, initialStats, onChange) {
  var stats = [].concat(initialStats)
  const remove = function(value) {
    stats = stats.filter(function(target) {
      return target.id !== value.id
    })
    return onChange(stats)
  }
  const upsert = function (value) {
    var existed = false
    stats = stats.map(function(target) {
      return target.id === value.id ? ((existed = true), value) : target
    })
    if (!existed) stats = [value].concat(stats)
    return onChange(stats)
  }
  subscription.on('create', upsert)
  subscription.on('update', upsert)
  subscription.on('enter', upsert)
  subscription.on('leave', remove)
  subscription.on('delete', remove)
  return function() {
    // subscription.unsubscribe()
    Parse.LiveQuery.close()
  }
}

var defaultLoginInfos = location.search.match(/\?username=(.*)&password=(.*)/)
var username
var password
if (defaultLoginInfos) {
  username = defaultLoginInfos[1] ? decodeURIComponent(defaultLoginInfos[1]) : null
  password = defaultLoginInfos[2] ? decodeURIComponent(defaultLoginInfos[2]) : null
}
// app Vue instance
var app = new Vue({
  // app initial state
  data: {
    todos: [],
    newTodo: '',
    isIos: isIos,
    editedTodo: null,
    visibility: 'all',
    username: username || '',
    password: password || '',
    user: null
  },

  created: function() {
    var user = Parse.User.current()
    if (user) {
      // user.isAuthenticated().then(function(authenticated) {
      //   if (authenticated) {
          this.user = user.toJSON()
      //   }
      // }.bind(this))
    }
  },

  watch: {
    'user.objectId': {
      handler: function (id) {
        if (id) {
          this.fetchTodos(id)
        } else {
          this.todos = []
        }
      },
    }
  },

  // computed properties
  // https://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (done) {
        Parse.Object.saveAll(
          filters[done ? 'active' : 'completed'](this.todos).map(function(todo) {
            todo.done = done
            return Parse.Object.createWithoutData('Todo', todo.objectId).set('done', done)
          })
        )
      }
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    fetchTodos: function(id) {
      const query = new Parse.Query(Todo)
        .equalTo('user', Parse.User.current())
        .descending('createdAt')
      const updateTodos = this.updateTodos.bind(this)
      return Parse.Promise.all([query.find().then(updateTodos), query.subscribe()])
        .then(function([todos, subscription]) {
          this.subscription = subscription
          this.unbind = bind(subscription, todos, updateTodos)
        }.bind(this))
        .catch(alert)
    },

    login: function() {
      Parse.User.logIn(this.username, this.password).then(function(user) {
        this.user = user.toJSON()
        this.username = this.password = ''
      }.bind(this)).catch(alert)
    },

    signup: function() {
      Parse.User.signUp(this.username, this.password).then(function(user) {
        this.user = user.toJSON()
        this.username = this.password = ''
      }.bind(this)).catch(alert)
    },

    logout: function() {
      Parse.User.logOut()
      this.user = null
      this.subscription.unsubscribe()
      this.unbind()
    },

    updateTodos: function(todos) {
      this.todos = todos.map(function(todo) {
        return todo.toJSON()
      })
      return todos
    },

    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      var acl = new Parse.ACL()
      acl.setPublicReadAccess(false)
      acl.setPublicWriteAccess(false)
      acl.setReadAccess(Parse.User.current(), true)
      acl.setWriteAccess(Parse.User.current(), true)
      new Todo({
        content: value,
        done: false,
        user: Parse.User.current()
      }).setACL(acl).save().then(function(todo) {

      }.bind(this)).catch(alert)
      this.newTodo = ''
    },

    removeTodo: function (todo) {
      Todo.createWithoutData(todo.objectId)
        .destroy()
        .then(function() {

        }.bind(this))
        .catch(alert)
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.content
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      this.editedTodo = null
      todo.content = todo.content.trim()
      Todo.createWithoutData(todo.objectId).save({
        content: todo.content,
        done: todo.done
      }).catch(alert)
      if (!todo.content) {
        this.removeTodo(todo)
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.content = this.beforeEditCache
    },

    removeCompleted: function () {
      Parse.Object.destroyAll(filters.completed(this.todos).map(function(todo) {
        return Todo.createWithoutData(todo.objectId)
      })).then(function() {
        this.todos = filters.active(this.todos)
      }.bind(this)).catch(alert)
    },
    noop: function() {}
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // https://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, value) {
      if (value) {
        el.focus()
      }
    }
  }
})

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]) {
    app.visibility = visibility
  } else {
    window.location.hash = ''
    app.visibility = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

// mount
app.$mount('.todoapp')
