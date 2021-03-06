function createMouseEvent(type) {
  var event = document.createEvent('MouseEvents');
  event.initEvent(type, true, false);
  return event;
}

function click(element) {
  if(element.click) {
    return element.click();
  }
  return element.onclick(createMouseEvent('click'));
}

function assertEmptyArray(array) {
  assert.isArray(array);
  assert.equal(0, array.length, "The passed array should be empty");
}

function stubAsyncStep(context, method, clock) {
  var stub = sinon.stub(context, method);
  function tick(millis) {
    if(clock) {
      clock.tick(millis || 1)
    }
  }
  return {
    flush: function() {
      var args = arrayLikeObjToArray(arguments);
      var cb = lastArg(stub);
      cb.apply(null, args);
      tick(1);
    },
    stub: function() {
      return stub;
    }
  };

}

function isChrome() {
  return !!navigator.userAgent.match(/chrome/i);
}
function isFF() {
  return !!navigator.userAgent.match(/firefox/i);
}

function firstArg(spy) {
  return spy.lastCall.args[0];
}

function secondArg(spy) {
  return spy.lastCall.args[1];
}

function thirdArg(spy) {
  return spy.lastCall.args[2];
}

function fourthArg(spy) {
  return spy.lastCall.args[3];
}

function lastArg(spy) {
  return spy.lastCall.args[spy.lastCall.args.length - 1];
}

function namespace(namespaceString) {
  var parts = namespaceString.split('.'),
    parent = window,
    currentPart = '';

  for (var i = 0, length = parts.length; i < length; i++) {
    currentPart = parts[i];
    parent[currentPart] = parent[currentPart] || {};
    parent = parent[currentPart];
  }

  return parent;
}

function spyOn(namespaceString, method) {
  var parent = namespace(namespaceString);
  if (parent[method]) {
    sinon.spy(parent, method);
  } else {
    parent[method] = sinon.spy();
  }
  return parent[method];
}

//testDiv.querySelector('#videoEl1')
function queryById(el, id) {
  return el.querySelector('#' + id);
}


function getCompByName(comp, name) {
  return treeSearch(comp, function (comp) {
    return comp.children();
  }, function (comp) {
    return comp.name() === name;
  });
}

function getCompByFactory(comp, factory) {
  return treeSearch(comp, function (comp) {
    return comp.children();
  }, function (comp) {
    return comp instanceof factory;
  });
}

function isCompVisible(comp) {
  return window.getComputedStyle(comp.el()).display !== "none"
}

function muteVideoJSErrorLogs() {
  var patterns = muteVideoJSErrorLogs.IGNORED_PATTERNS;

  ['log', 'error', 'warn'].forEach(function (logFnName) {
    var log = console && console[logFnName];
    if (log) {
      console[logFnName] = function (msg) {
        if (canBeLogged(msg)) {
          log.apply(console, arguments);
        }
      };
    }
  });

  /*** local functions ***/
  function canBeLogged(msg) {
    var i, len, pattern;
    for (i = 0, len = patterns.length; i < len; i++) {
      pattern = patterns[i];

      if (pattern instanceof RegExp && pattern.test(msg)) {
        return false;
      } else if (isString(pattern) && pattern === msg) {
        return false;
      }
    }

    return true;
  }
}

muteVideoJSErrorLogs.IGNORED_PATTERNS = [
  'VIDEOJS:',
  'AD ERROR:',
  /^Video Player Setup Error/gm
];

muteVideoJSErrorLogs();