var simple = require('simple-mock')
var test = require('tape')

var connect = require('../../lib/connect')

test('connect options', function (t) {
  var syncApi = {
    on: simple.stub()
  }
  var state = {
    emitter: {
      emit: simple.stub()
    },
    remote: 'remoteDb',
    db: {
      sync: simple.stub()
    }
  }
  simple.mock(state.db, 'sync').returnWith(syncApi)

  connect(state)

  t.is(state.db.sync.callCount, 1, 'calls sync once')
  t.is(state.db.sync.lastCall.args[0], 'remoteDb', 'calls api.sync with "remoteDb"')
  t.is(state.db.sync.lastCall.args[1].live, true, 'calls api.sync with live: true')
  t.is(state.db.sync.lastCall.args[1].retry, true, 'calls api.sync with retry: true')
  t.is(state.db.sync.lastCall.args[1].create_target, true, 'calls api.sync with create_target: true')
  t.is(syncApi.on.callCount, 2, 'listens to two events')
  t.is(syncApi.on.calls[0].arg, 'error', 'listens "error" event')
  t.is(syncApi.on.calls[1].arg, 'change', 'listens "change" event')
  t.is(state.emitter.emit.callCount, 1, 'emits 1 event')
  t.is(state.emitter.emit.lastCall.arg, 'connect', 'emits "connect" event')

  t.end()
})

test('connect with ajaxOptions', function (t) {
  var syncApi = {
    on: simple.stub()
  }
  var state = {
    emitter: {
      emit: simple.stub()
    },
    remote: 'remoteDb',
    db: {
      sync: simple.stub()
    },
    ajaxOptions: {foo: 'bar'}
  }
  simple.mock(state.db, 'sync').returnWith(syncApi)

  connect(state)

  t.is(state.db.sync.lastCall.args[1].ajax.foo, 'bar', 'calls api.sync with ajaxOptions')

  t.end()
})

test('connect with ajaxOptions function', function (t) {
  var syncApi = {
    on: simple.stub()
  }
  var state = {
    emitter: {
      emit: simple.stub()
    },
    remote: 'remoteDb',
    db: {
      sync: simple.stub()
    },
    ajaxOptions: function () { return {foo: 'bar'} }
  }
  simple.mock(state.db, 'sync').returnWith(syncApi)

  connect(state)

  t.is(state.db.sync.lastCall.args[1].ajax.foo, 'bar', 'calls api.sync with ajaxOptions')

  t.end()
})
