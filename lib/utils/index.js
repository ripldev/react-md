'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setOverflow = setOverflow;
exports.numberBetween = numberBetween;
exports.smoothScroll = smoothScroll;
exports.isObject = isObject;
exports.getOffset = getOffset;
exports.getTouchOffset = getTouchOffset;
exports.isPointInCircle = isPointInCircle;
exports.easeInOut = easeInOut;
exports.animate = animate;
exports.fuzzyFilter = fuzzyFilter;

var _dates = require('./dates');

var _loop = function _loop(_key2) {
  if (_key2 === "default") return 'continue';
  Object.defineProperty(exports, _key2, {
    enumerable: true,
    get: function get() {
      return _dates[_key2];
    }
  });
};

for (var _key2 in _dates) {
  var _ret = _loop(_key2);

  if (_ret === 'continue') continue;
}

function setOverflow(enabled, selector) {
  var el = selector ? document.querySelector(selector) : document.body;
  if (enabled) {
    el.classList.add('hide-overflow');
  } else {
    el.classList.remove('hide-overflow');
  }
}

function numberBetween(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

function smoothScroll(el, duration) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var callback = options.callback;
  var toEl = options.toEl;
  var stepAmt = options.stepAmt;

  if (!stepAmt) {
    stepAmt = 15;
  }

  if (toEl) {
    // TODO: Implement smooth scroll to element
    var toPos = toEl.getBoundingClientRect().top + document.body.scrollTop;
    el.scrollTo(el.scrollX, toPos - 65 - 15); // 65 is app bar height
    return;
  }

  var scrollHeight = el.scrollY || el.scrollTop;
  var scrollStep = Math.PI / (duration / stepAmt);
  var cosParam = scrollHeight / 2;

  var scrollCounter = 0;
  var scrollMargin = undefined;

  function step() {
    setTimeout(function () {
      var h = el.scrollY || el.scrollTop;
      if (h || h > 0) {
        requestAnimationFrame(step);

        scrollCounter++;
        scrollMargin = cosParam - cosParam * Math.cos(scrollCounter * scrollStep);

        var scroll = scrollHeight - scrollMargin;
        if (scroll <= 10) {
          scroll = 0;
        }

        if (el.scrollY) {
          el.scrollTo(el.scrollX, scroll);
        } else {
          el.scrollTop = scroll;
        }
      } else {
        callback && callback();
      }
    }, stepAmt);
  }

  requestAnimationFrame(step);
}

/**
 * Checkis of the given thing is an object
 * @param thing the thing to check
 * @return true if the thing is an object
 */
function isObject(thing) {
  return Object.prototype.toString.call(thing) === '[object Object]';
}

function getScrollProp(key) {
  // document.body is deprecated for some browsers
  return Math.max(document.body[key], document.documentElement[key]);
}

function getOffset(el) {
  var rect = el.getBoundingClientRect();
  return {
    left: rect.left + getScrollProp('scrollLeft'),
    top: rect.top + getScrollProp('scrollTop')
  };
}

function getTouchOffset(event) {
  var el = event.target;
  var rect = el.getBoundingClientRect();
  return {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top
  };
}

function isPointInCircle(cx, cy, r, x, y) {
  var distance = Math.pow(cx - x, 2) + Math.pow(cy - y, 2);
  return distance <= Math.pow(r, 2);
}

/**
 * Amzing media query to check if mobile..
 * @return true if device width is between 0 and 599px
 */
var isMobile = exports.isMobile = function () {
  return window.matchMedia('only screen and (min-width: 0px) and (max-width: 599px)').matches;
}();

var isTouchDevice = exports.isTouchDevice = function () {
  var msTouch = window.navigator.msMaxTouchPoints;
  var touch = 'ontouchstart' in document.createElement('div');
  return msTouch || touch;
}();

function easeInOut(currentTime, start, change, duration) {
  currentTime /= duration / 2;
  if (currentTime < 1) {
    return change / 2 * currentTime * currentTime + start;
  }
  currentTime -= 1;
  return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
}

/**
 *
 * @param el
 * @param increment
 * @param elapsedTime
 * @param transitionTime
 * @param styleName
 * @param currentValue
 * @param finalValue
 * @param next
 */
function animate(el, increment, elapsedTime, transitionTime, styleName, startValue, currentValue, finalValue, next) {
  elapsedTime += increment;
  el.style[styleName] = easeInOut(elapsedTime, startValue, finalValue, transitionTime) + 'px';

  if (elapsedTime < transitionTime) {
    setTimeout(function () {
      animate(el, increment, elapsedTime, transitionTime, styleName, startValue, currentValue, finalValue, next);
    }, increment);
  } else {
    next(elapsedTime);
  }
}

function fuzzyFilter(items, word) {
  var key = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  if (!items || !items.length || !word) {
    return items;
  }

  var lv = word.toLowerCase();
  return items.filter(function (item) {
    var li = (key ? item[key] : item).toLowerCase();
    var lastFound = -1;
    for (var i = 0; i < lv.length; i++) {
      lastFound = li.indexOf(lv[i], lastFound + i);
      if (lastFound === -1) {
        return false;
      }
    }
    return true;
  });
}

var focusableQueryStr = exports.focusableQueryStr = ['input', 'select', 'textarea', 'button'].map(function (e) {
  return e + ':not([disabled])';
}).concat(['a[href]', 'area[href]', 'iframe', '[tabindex]', '[contentEditable=true]']).map(function (el) {
  return el + ':not([tabindex=\'-1\'])';
}).join(',');
var getFirstFocusable = exports.getFirstFocusable = function getFirstFocusable(el) {
  return el.querySelector(focusableQueryStr);
};