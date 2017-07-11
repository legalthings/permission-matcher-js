"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof2(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.PermissionMatcher = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (require, module, exports) {
      var pSlice = Array.prototype.slice;
      var objectKeys = require('./lib/keys.js');
      var isArguments = require('./lib/is_arguments.js');

      var deepEqual = module.exports = function (actual, expected, opts) {
        if (!opts) opts = {};
        // 7.1. All identical values are equivalent, as determined by ===.
        if (actual === expected) {
          return true;
        } else if (actual instanceof Date && expected instanceof Date) {
          return actual.getTime() === expected.getTime();

          // 7.3. Other pairs that do not both pass typeof value == 'object',
          // equivalence is determined by ==.
        } else if (!actual || !expected || (typeof actual === "undefined" ? "undefined" : _typeof2(actual)) != 'object' && (typeof expected === "undefined" ? "undefined" : _typeof2(expected)) != 'object') {
          return opts.strict ? actual === expected : actual == expected;

          // 7.4. For all other Object pairs, including Array objects, equivalence is
          // determined by having the same number of owned properties (as verified
          // with Object.prototype.hasOwnProperty.call), the same set of keys
          // (although not necessarily the same order), equivalent values for every
          // corresponding key, and an identical 'prototype' property. Note: this
          // accounts for both named and indexed properties on Arrays.
        } else {
          return objEquiv(actual, expected, opts);
        }
      };

      function isUndefinedOrNull(value) {
        return value === null || value === undefined;
      }

      function isBuffer(x) {
        if (!x || (typeof x === "undefined" ? "undefined" : _typeof2(x)) !== 'object' || typeof x.length !== 'number') return false;
        if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
          return false;
        }
        if (x.length > 0 && typeof x[0] !== 'number') return false;
        return true;
      }

      function objEquiv(a, b, opts) {
        var i, key;
        if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
        // an identical 'prototype' property.
        if (a.prototype !== b.prototype) return false;
        //~~~I've managed to break Object.keys through screwy arguments passing.
        //   Converting to array solves the problem.
        if (isArguments(a)) {
          if (!isArguments(b)) {
            return false;
          }
          a = pSlice.call(a);
          b = pSlice.call(b);
          return deepEqual(a, b, opts);
        }
        if (isBuffer(a)) {
          if (!isBuffer(b)) {
            return false;
          }
          if (a.length !== b.length) return false;
          for (i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
          }
          return true;
        }
        try {
          var ka = objectKeys(a),
              kb = objectKeys(b);
        } catch (e) {
          //happens when one is a string literal and the other isn't
          return false;
        }
        // having the same number of owned properties (keys incorporates
        // hasOwnProperty)
        if (ka.length != kb.length) return false;
        //the same set of keys (although not necessarily the same order),
        ka.sort();
        kb.sort();
        //~~~cheap key test
        for (i = ka.length - 1; i >= 0; i--) {
          if (ka[i] != kb[i]) return false;
        }
        //equivalent values for every corresponding key, and
        //~~~possibly expensive deep test
        for (i = ka.length - 1; i >= 0; i--) {
          key = ka[i];
          if (!deepEqual(a[key], b[key], opts)) return false;
        }
        return (typeof a === "undefined" ? "undefined" : _typeof2(a)) === (typeof b === "undefined" ? "undefined" : _typeof2(b));
      }
    }, { "./lib/is_arguments.js": 2, "./lib/keys.js": 3 }], 2: [function (require, module, exports) {
      var supportsArgumentsClass = function () {
        return Object.prototype.toString.call(arguments);
      }() == '[object Arguments]';

      exports = module.exports = supportsArgumentsClass ? supported : unsupported;

      exports.supported = supported;
      function supported(object) {
        return Object.prototype.toString.call(object) == '[object Arguments]';
      };

      exports.unsupported = unsupported;
      function unsupported(object) {
        return object && (typeof object === "undefined" ? "undefined" : _typeof2(object)) == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
      };
    }, {}], 3: [function (require, module, exports) {
      exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

      exports.shim = shim;
      function shim(obj) {
        var keys = [];
        for (var key in obj) {
          keys.push(key);
        }return keys;
      }
    }, {}], 4: [function (require, module, exports) {
      'use strict';

      var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
        return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      };

      module.exports = function _phpCastString(value) {
        // original by: Rafał Kukawski
        //   example 1: _phpCastString(true)
        //   returns 1: '1'
        //   example 2: _phpCastString(false)
        //   returns 2: ''
        //   example 3: _phpCastString('foo')
        //   returns 3: 'foo'
        //   example 4: _phpCastString(0/0)
        //   returns 4: 'NAN'
        //   example 5: _phpCastString(1/0)
        //   returns 5: 'INF'
        //   example 6: _phpCastString(-1/0)
        //   returns 6: '-INF'
        //   example 7: _phpCastString(null)
        //   returns 7: ''
        //   example 8: _phpCastString(undefined)
        //   returns 8: ''
        //   example 9: _phpCastString([])
        //   returns 9: 'Array'
        //   example 10: _phpCastString({})
        //   returns 10: 'Object'
        //   example 11: _phpCastString(0)
        //   returns 11: '0'
        //   example 12: _phpCastString(1)
        //   returns 12: '1'
        //   example 13: _phpCastString(3.14)
        //   returns 13: '3.14'

        var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

        switch (type) {
          case 'boolean':
            return value ? '1' : '';
          case 'string':
            return value;
          case 'number':
            if (isNaN(value)) {
              return 'NAN';
            }

            if (!isFinite(value)) {
              return (value < 0 ? '-' : '') + 'INF';
            }

            return value + '';
          case 'undefined':
            return '';
          case 'object':
            if (Array.isArray(value)) {
              return 'Array';
            }

            if (value !== null) {
              return 'Object';
            }

            return '';
          case 'function':
          // fall through
          default:
            throw new Error('Unsupported value type');
        }
      };
    }, {}], 5: [function (require, module, exports) {
      'use strict';

      module.exports = function array_merge() {
        // eslint-disable-line camelcase
        //  discuss at: http://locutus.io/php/array_merge/
        // original by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: Nate
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //    input by: josh
        //   example 1: var $arr1 = {"color": "red", 0: 2, 1: 4}
        //   example 1: var $arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
        //   example 1: array_merge($arr1, $arr2)
        //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
        //   example 2: var $arr1 = []
        //   example 2: var $arr2 = {1: "data"}
        //   example 2: array_merge($arr1, $arr2)
        //   returns 2: {0: "data"}

        var args = Array.prototype.slice.call(arguments);
        var argl = args.length;
        var arg;
        var retObj = {};
        var k = '';
        var argil = 0;
        var j = 0;
        var i = 0;
        var ct = 0;
        var toStr = Object.prototype.toString;
        var retArr = true;

        for (i = 0; i < argl; i++) {
          if (toStr.call(args[i]) !== '[object Array]') {
            retArr = false;
            break;
          }
        }

        if (retArr) {
          retArr = [];
          for (i = 0; i < argl; i++) {
            retArr = retArr.concat(args[i]);
          }
          return retArr;
        }

        for (i = 0, ct = 0; i < argl; i++) {
          arg = args[i];
          if (toStr.call(arg) === '[object Array]') {
            for (j = 0, argil = arg.length; j < argil; j++) {
              retObj[ct++] = arg[j];
            }
          } else {
            for (k in arg) {
              if (arg.hasOwnProperty(k)) {
                if (parseInt(k, 10) + '' === k) {
                  retObj[ct++] = arg[k];
                } else {
                  retObj[k] = arg[k];
                }
              }
            }
          }
        }

        return retObj;
      };
    }, {}], 6: [function (require, module, exports) {
      (function (global) {
        'use strict';

        module.exports = function ksort(inputArr, sortFlags) {
          //  discuss at: http://locutus.io/php/ksort/
          // original by: GeekFG (http://geekfg.blogspot.com)
          // improved by: Kevin van Zonneveld (http://kvz.io)
          // improved by: Brett Zamir (http://brett-zamir.me)
          //      note 1: This function deviates from PHP in returning a copy of the array instead
          //      note 1: of acting by reference and returning true; this was necessary because
          //      note 1: IE does not allow deleting and re-adding of properties without caching
          //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
          //      note 1: get the PHP behavior, but use this only if you are in an environment
          //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
          //      note 1: property deletion is supported. Note that we intend to implement the PHP
          //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
          //      note 1: is by reference in PHP anyways
          //      note 1: Since JS objects' keys are always strings, and (the
          //      note 1: default) SORT_REGULAR flag distinguishes by key type,
          //      note 1: if the content is a numeric string, we treat the
          //      note 1: "original type" as numeric.
          //   example 1: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
          //   example 1: ksort($data)
          //   example 1: var $result = $data
          //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}
          //   example 2: ini_set('locutus.sortByReference', true)
          //   example 2: var $data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'}
          //   example 2: ksort($data)
          //   example 2: var $result = $data
          //   returns 2: {1: 'Kevin', 2: 'van', 3: 'Zonneveld'}

          var i18nlgd = require('../i18n/i18n_loc_get_default');
          var strnatcmp = require('../strings/strnatcmp');

          var tmpArr = {};
          var keys = [];
          var sorter;
          var i;
          var k;
          var sortByReference = false;
          var populateArr = {};

          var $global = typeof window !== 'undefined' ? window : global;
          $global.$locutus = $global.$locutus || {};
          var $locutus = $global.$locutus;
          $locutus.php = $locutus.php || {};
          $locutus.php.locales = $locutus.php.locales || {};

          switch (sortFlags) {
            case 'SORT_STRING':
              // compare items as strings
              sorter = function sorter(a, b) {
                return strnatcmp(b, a);
              };
              break;
            case 'SORT_LOCALE_STRING':
              // compare items as strings, based on the current locale
              // (set with i18n_loc_set_default() as of PHP6)
              var loc = i18nlgd();
              sorter = $locutus.locales[loc].sorting;
              break;
            case 'SORT_NUMERIC':
              // compare items numerically
              sorter = function sorter(a, b) {
                return a + 0 - (b + 0);
              };
              break;
            default:
              // case 'SORT_REGULAR': // compare items normally (don't change types)
              sorter = function sorter(a, b) {
                var aFloat = parseFloat(a);
                var bFloat = parseFloat(b);
                var aNumeric = aFloat + '' === a;
                var bNumeric = bFloat + '' === b;
                if (aNumeric && bNumeric) {
                  return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                  return 1;
                } else if (!aNumeric && bNumeric) {
                  return -1;
                }
                return a > b ? 1 : a < b ? -1 : 0;
              };
              break;
          }

          // Make a list of key names
          for (k in inputArr) {
            if (inputArr.hasOwnProperty(k)) {
              keys.push(k);
            }
          }
          keys.sort(sorter);

          var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on';
          sortByReference = iniVal === 'on';
          populateArr = sortByReference ? inputArr : populateArr;

          // Rebuild array with sorted key names
          for (i = 0; i < keys.length; i++) {
            k = keys[i];
            tmpArr[k] = inputArr[k];
            if (sortByReference) {
              delete inputArr[k];
            }
          }
          for (i in tmpArr) {
            if (tmpArr.hasOwnProperty(i)) {
              populateArr[i] = tmpArr[i];
            }
          }

          return sortByReference || populateArr;
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../i18n/i18n_loc_get_default": 7, "../info/ini_get": 8, "../strings/strnatcmp": 13 }], 7: [function (require, module, exports) {
      (function (global) {
        'use strict';

        module.exports = function i18n_loc_get_default() {
          // eslint-disable-line camelcase
          //  discuss at: http://locutus.io/php/i18n_loc_get_default/
          // original by: Brett Zamir (http://brett-zamir.me)
          //      note 1: Renamed in PHP6 from locale_get_default(). Not listed yet at php.net.
          //      note 1: List of locales at <http://demo.icu-project.org/icu-bin/locexp>
          //      note 1: To be usable with sort() if it is passed the `SORT_LOCALE_STRING`
          //      note 1: sorting flag: http://php.net/manual/en/function.sort.php
          //   example 1: i18n_loc_get_default()
          //   returns 1: 'en_US_POSIX'
          //   example 2: i18n_loc_set_default('pt_PT')
          //   example 2: i18n_loc_get_default()
          //   returns 2: 'pt_PT'

          var $global = typeof window !== 'undefined' ? window : global;
          $global.$locutus = $global.$locutus || {};
          var $locutus = $global.$locutus;
          $locutus.php = $locutus.php || {};
          $locutus.php.locales = $locutus.php.locales || {};

          return $locutus.php.locale_default || 'en_US_POSIX';
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 8: [function (require, module, exports) {
      (function (global) {
        'use strict';

        module.exports = function ini_get(varname) {
          // eslint-disable-line camelcase
          //  discuss at: http://locutus.io/php/ini_get/
          // original by: Brett Zamir (http://brett-zamir.me)
          //      note 1: The ini values must be set by ini_set or manually within an ini file
          //   example 1: ini_set('date.timezone', 'Asia/Hong_Kong')
          //   example 1: ini_get('date.timezone')
          //   returns 1: 'Asia/Hong_Kong'

          var $global = typeof window !== 'undefined' ? window : global;
          $global.$locutus = $global.$locutus || {};
          var $locutus = $global.$locutus;
          $locutus.php = $locutus.php || {};
          $locutus.php.ini = $locutus.php.ini || {};

          if ($locutus.php.ini[varname] && $locutus.php.ini[varname].local_value !== undefined) {
            if ($locutus.php.ini[varname].local_value === null) {
              return '';
            }
            return $locutus.php.ini[varname].local_value;
          }

          return '';
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 9: [function (require, module, exports) {
      'use strict';

      module.exports = function preg_quote(str, delimiter) {
        // eslint-disable-line camelcase
        //  discuss at: http://locutus.io/php/preg_quote/
        // original by: booeyOH
        // improved by: Ates Goral (http://magnetiq.com)
        // improved by: Kevin van Zonneveld (http://kvz.io)
        // improved by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
        //   example 1: preg_quote("$40")
        //   returns 1: '\\$40'
        //   example 2: preg_quote("*RRRING* Hello?")
        //   returns 2: '\\*RRRING\\* Hello\\?'
        //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:")
        //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

        return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
      };
    }, {}], 10: [function (require, module, exports) {
      (function (global) {
        'use strict';

        module.exports = function parse_str(str, array) {
          // eslint-disable-line camelcase
          //       discuss at: http://locutus.io/php/parse_str/
          //      original by: Cagri Ekin
          //      improved by: Michael White (http://getsprink.com)
          //      improved by: Jack
          //      improved by: Brett Zamir (http://brett-zamir.me)
          //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
          //      bugfixed by: Brett Zamir (http://brett-zamir.me)
          //      bugfixed by: stag019
          //      bugfixed by: Brett Zamir (http://brett-zamir.me)
          //      bugfixed by: MIO_KODUKI (http://mio-koduki.blogspot.com/)
          // reimplemented by: stag019
          //         input by: Dreamer
          //         input by: Zaide (http://zaidesthings.com/)
          //         input by: David Pesta (http://davidpesta.com/)
          //         input by: jeicquest
          //           note 1: When no argument is specified, will put variables in global scope.
          //           note 1: When a particular argument has been passed, and the
          //           note 1: returned value is different parse_str of PHP.
          //           note 1: For example, a=b=c&d====c
          //        example 1: var $arr = {}
          //        example 1: parse_str('first=foo&second=bar', $arr)
          //        example 1: var $result = $arr
          //        returns 1: { first: 'foo', second: 'bar' }
          //        example 2: var $arr = {}
          //        example 2: parse_str('str_a=Jack+and+Jill+didn%27t+see+the+well.', $arr)
          //        example 2: var $result = $arr
          //        returns 2: { str_a: "Jack and Jill didn't see the well." }
          //        example 3: var $abc = {3:'a'}
          //        example 3: parse_str('a[b]["c"]=def&a[q]=t+5', $abc)
          //        example 3: var $result = $abc
          //        returns 3: {"3":"a","a":{"b":{"c":"def"},"q":"t 5"}}

          var strArr = String(str).replace(/^&/, '').replace(/&$/, '').split('&');
          var sal = strArr.length;
          var i;
          var j;
          var ct;
          var p;
          var lastObj;
          var obj;
          var undef;
          var chr;
          var tmp;
          var key;
          var value;
          var postLeftBracketPos;
          var keys;
          var keysLen;

          var _fixStr = function _fixStr(str) {
            return decodeURIComponent(str.replace(/\+/g, '%20'));
          };

          var $global = typeof window !== 'undefined' ? window : global;
          $global.$locutus = $global.$locutus || {};
          var $locutus = $global.$locutus;
          $locutus.php = $locutus.php || {};

          if (!array) {
            array = $global;
          }

          for (i = 0; i < sal; i++) {
            tmp = strArr[i].split('=');
            key = _fixStr(tmp[0]);
            value = tmp.length < 2 ? '' : _fixStr(tmp[1]);

            while (key.charAt(0) === ' ') {
              key = key.slice(1);
            }
            if (key.indexOf('\x00') > -1) {
              key = key.slice(0, key.indexOf('\x00'));
            }
            if (key && key.charAt(0) !== '[') {
              keys = [];
              postLeftBracketPos = 0;
              for (j = 0; j < key.length; j++) {
                if (key.charAt(j) === '[' && !postLeftBracketPos) {
                  postLeftBracketPos = j + 1;
                } else if (key.charAt(j) === ']') {
                  if (postLeftBracketPos) {
                    if (!keys.length) {
                      keys.push(key.slice(0, postLeftBracketPos - 1));
                    }
                    keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
                    postLeftBracketPos = 0;
                    if (key.charAt(j + 1) !== '[') {
                      break;
                    }
                  }
                }
              }
              if (!keys.length) {
                keys = [key];
              }
              for (j = 0; j < keys[0].length; j++) {
                chr = keys[0].charAt(j);
                if (chr === ' ' || chr === '.' || chr === '[') {
                  keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
                }
                if (chr === '[') {
                  break;
                }
              }

              obj = array;
              for (j = 0, keysLen = keys.length; j < keysLen; j++) {
                key = keys[j].replace(/^['"]/, '').replace(/['"]$/, '');
                lastObj = obj;
                if (key !== '' && key !== ' ' || j === 0) {
                  if (obj[key] === undef) {
                    obj[key] = {};
                  }
                  obj = obj[key];
                } else {
                  // To insert new dimension
                  ct = -1;
                  for (p in obj) {
                    if (obj.hasOwnProperty(p)) {
                      if (+p > ct && p.match(/^\d+$/g)) {
                        ct = +p;
                      }
                    }
                  }
                  key = ct + 1;
                }
              }
              lastObj[key] = value;
            }
          }
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 11: [function (require, module, exports) {
      'use strict';

      module.exports = function rtrim(str, charlist) {
        //  discuss at: http://locutus.io/php/rtrim/
        // original by: Kevin van Zonneveld (http://kvz.io)
        //    input by: Erkekjetter
        //    input by: rem
        // improved by: Kevin van Zonneveld (http://kvz.io)
        // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //   example 1: rtrim('    Kevin van Zonneveld    ')
        //   returns 1: '    Kevin van Zonneveld'

        charlist = !charlist ? ' \\s\xA0' : (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '\\$1');

        var re = new RegExp('[' + charlist + ']+$', 'g');

        return (str + '').replace(re, '');
      };
    }, {}], 12: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
          return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
        } : function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
        };

        module.exports = function str_replace(search, replace, subject, countObj) {
          // eslint-disable-line camelcase
          //  discuss at: http://locutus.io/php/str_replace/
          // original by: Kevin van Zonneveld (http://kvz.io)
          // improved by: Gabriel Paderni
          // improved by: Philip Peterson
          // improved by: Simon Willison (http://simonwillison.net)
          // improved by: Kevin van Zonneveld (http://kvz.io)
          // improved by: Onno Marsman (https://twitter.com/onnomarsman)
          // improved by: Brett Zamir (http://brett-zamir.me)
          //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
          // bugfixed by: Anton Ongson
          // bugfixed by: Kevin van Zonneveld (http://kvz.io)
          // bugfixed by: Oleg Eremeev
          // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
          // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
          //    input by: Onno Marsman (https://twitter.com/onnomarsman)
          //    input by: Brett Zamir (http://brett-zamir.me)
          //    input by: Oleg Eremeev
          //      note 1: The countObj parameter (optional) if used must be passed in as a
          //      note 1: object. The count will then be written by reference into it's `value` property
          //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld')
          //   returns 1: 'Kevin.van.Zonneveld'
          //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars')
          //   returns 2: 'hemmo, mars'
          //   example 3: str_replace(Array('S','F'),'x','ASDFASDF')
          //   returns 3: 'AxDxAxDx'
          //   example 4: var countObj = {}
          //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , countObj)
          //   example 4: var $result = countObj.value
          //   returns 4: 4

          var i = 0;
          var j = 0;
          var temp = '';
          var repl = '';
          var sl = 0;
          var fl = 0;
          var f = [].concat(search);
          var r = [].concat(replace);
          var s = subject;
          var ra = Object.prototype.toString.call(r) === '[object Array]';
          var sa = Object.prototype.toString.call(s) === '[object Array]';
          s = [].concat(s);

          var $global = typeof window !== 'undefined' ? window : global;
          $global.$locutus = $global.$locutus || {};
          var $locutus = $global.$locutus;
          $locutus.php = $locutus.php || {};

          if ((typeof search === 'undefined' ? 'undefined' : _typeof(search)) === 'object' && typeof replace === 'string') {
            temp = replace;
            replace = [];
            for (i = 0; i < search.length; i += 1) {
              replace[i] = temp;
            }
            temp = '';
            r = [].concat(replace);
            ra = Object.prototype.toString.call(r) === '[object Array]';
          }

          if (typeof countObj !== 'undefined') {
            countObj.value = 0;
          }

          for (i = 0, sl = s.length; i < sl; i++) {
            if (s[i] === '') {
              continue;
            }
            for (j = 0, fl = f.length; j < fl; j++) {
              temp = s[i] + '';
              repl = ra ? r[j] !== undefined ? r[j] : '' : r[0];
              s[i] = temp.split(f[j]).join(repl);
              if (typeof countObj !== 'undefined') {
                countObj.value += temp.split(f[j]).length - 1;
              }
            }
          }
          return sa ? s : s[0];
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 13: [function (require, module, exports) {
      'use strict';

      module.exports = function strnatcmp(a, b) {
        //       discuss at: http://locutus.io/php/strnatcmp/
        //      original by: Martijn Wieringa
        //      improved by: Michael White (http://getsprink.com)
        //      improved by: Jack
        //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
        // reimplemented by: Rafał Kukawski
        //        example 1: strnatcmp('abc', 'abc')
        //        returns 1: 0
        //        example 2: strnatcmp('a', 'b')
        //        returns 2: -1
        //        example 3: strnatcmp('10', '1')
        //        returns 3: 1
        //        example 4: strnatcmp('0000abc', '0abc')
        //        returns 4: 0
        //        example 5: strnatcmp('1239', '12345')
        //        returns 5: -1
        //        example 6: strnatcmp('t01239', 't012345')
        //        returns 6: 1
        //        example 7: strnatcmp('0A', '5N')
        //        returns 7: -1

        var _phpCastString = require('../_helpers/_phpCastString');

        var leadingZeros = /^0+(?=\d)/;
        var whitespace = /^\s/;
        var digit = /^\d/;

        if (arguments.length !== 2) {
          return null;
        }

        a = _phpCastString(a);
        b = _phpCastString(b);

        if (!a.length || !b.length) {
          return a.length - b.length;
        }

        var i = 0;
        var j = 0;

        a = a.replace(leadingZeros, '');
        b = b.replace(leadingZeros, '');

        while (i < a.length && j < b.length) {
          // skip consecutive whitespace
          while (whitespace.test(a.charAt(i))) {
            i++;
          }while (whitespace.test(b.charAt(j))) {
            j++;
          }var ac = a.charAt(i);
          var bc = b.charAt(j);
          var aIsDigit = digit.test(ac);
          var bIsDigit = digit.test(bc);

          if (aIsDigit && bIsDigit) {
            var bias = 0;
            var fractional = ac === '0' || bc === '0';

            do {
              if (!aIsDigit) {
                return -1;
              } else if (!bIsDigit) {
                return 1;
              } else if (ac < bc) {
                if (!bias) {
                  bias = -1;
                }

                if (fractional) {
                  return -1;
                }
              } else if (ac > bc) {
                if (!bias) {
                  bias = 1;
                }

                if (fractional) {
                  return 1;
                }
              }

              ac = a.charAt(++i);
              bc = b.charAt(++j);

              aIsDigit = digit.test(ac);
              bIsDigit = digit.test(bc);
            } while (aIsDigit || bIsDigit);

            if (!fractional && bias) {
              return bias;
            }

            continue;
          }

          if (!ac || !bc) {
            continue;
          } else if (ac < bc) {
            return -1;
          } else if (ac > bc) {
            return 1;
          }

          i++;
          j++;
        }

        var iBeforeStrEnd = i < a.length;
        var jBeforeStrEnd = j < b.length;

        // Check which string ended first
        // return -1 if a, 1 if b, 0 otherwise
        return (iBeforeStrEnd > jBeforeStrEnd) - (iBeforeStrEnd < jBeforeStrEnd);
      };
    }, { "../_helpers/_phpCastString": 4 }], 14: [function (require, module, exports) {
      (function (global) {
        'use strict';

        module.exports = function strtok(str, tokens) {
          //  discuss at: http://locutus.io/php/strtok/
          // original by: Brett Zamir (http://brett-zamir.me)
          //      note 1: Use tab and newline as tokenizing characters as well
          //   example 1: var $string = "\t\t\t\nThis is\tan example\nstring\n"
          //   example 1: var $tok = strtok($string, " \n\t")
          //   example 1: var $b = ''
          //   example 1: while ($tok !== false) {$b += "Word="+$tok+"\n"; $tok = strtok(" \n\t");}
          //   example 1: var $result = $b
          //   returns 1: "Word=This\nWord=is\nWord=an\nWord=example\nWord=string\n"

          var $global = typeof window !== 'undefined' ? window : global;
          $global.$locutus = $global.$locutus || {};
          var $locutus = $global.$locutus;
          $locutus.php = $locutus.php || {};

          if (tokens === undefined) {
            tokens = str;
            str = $locutus.php.strtokleftOver;
          }
          if (str.length === 0) {
            return false;
          }
          if (tokens.indexOf(str.charAt(0)) !== -1) {
            return strtok(str.substr(1), tokens);
          }
          for (var i = 0; i < str.length; i++) {
            if (tokens.indexOf(str.charAt(i)) !== -1) {
              break;
            }
          }
          $locutus.php.strtokleftOver = str.substr(i + 1);

          return str.substring(0, i);
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 15: [function (require, module, exports) {
      'use strict';

      module.exports = function parse_url(str, component) {
        // eslint-disable-line camelcase
        //       discuss at: http://locutus.io/php/parse_url/
        //      original by: Steven Levithan (http://blog.stevenlevithan.com)
        // reimplemented by: Brett Zamir (http://brett-zamir.me)
        //         input by: Lorenzo Pisani
        //         input by: Tony
        //      improved by: Brett Zamir (http://brett-zamir.me)
        //           note 1: original by http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
        //           note 1: blog post at http://blog.stevenlevithan.com/archives/parseuri
        //           note 1: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
        //           note 1: Does not replace invalid characters with '_' as in PHP,
        //           note 1: nor does it return false with
        //           note 1: a seriously malformed URL.
        //           note 1: Besides function name, is essentially the same as parseUri as
        //           note 1: well as our allowing
        //           note 1: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
        //        example 1: parse_url('http://user:pass@host/path?a=v#a')
        //        returns 1: {scheme: 'http', host: 'host', user: 'user', pass: 'pass', path: '/path', query: 'a=v', fragment: 'a'}
        //        example 2: parse_url('http://en.wikipedia.org/wiki/%22@%22_%28album%29')
        //        returns 2: {scheme: 'http', host: 'en.wikipedia.org', path: '/wiki/%22@%22_%28album%29'}
        //        example 3: parse_url('https://host.domain.tld/a@b.c/folder')
        //        returns 3: {scheme: 'https', host: 'host.domain.tld', path: '/a@b.c/folder'}
        //        example 4: parse_url('https://gooduser:secretpassword@www.example.com/a@b.c/folder?foo=bar')
        //        returns 4: { scheme: 'https', host: 'www.example.com', path: '/a@b.c/folder', query: 'foo=bar', user: 'gooduser', pass: 'secretpassword' }

        var query;

        var mode = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.parse_url.mode') : undefined) || 'php';

        var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'];

        // For loose we added one optional slash to post-scheme to catch file:/// (should restrict this)
        var parser = {
          php: new RegExp(['(?:([^:\\/?#]+):)?', '(?:\\/\\/()(?:(?:()(?:([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?', '()', '(?:(()(?:(?:[^?#\\/]*\\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'].join('')),
          strict: new RegExp(['(?:([^:\\/?#]+):)?', '(?:\\/\\/((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?', '((((?:[^?#\\/]*\\/)*)([^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'].join('')),
          loose: new RegExp(['(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?', '(?:\\/\\/\\/?)?', '((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?)', '(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*\\/?)?([^?#\\/]*))', '(?:\\?([^#]*))?(?:#(.*))?)'].join(''))
        };

        var m = parser[mode].exec(str);
        var uri = {};
        var i = 14;

        while (i--) {
          if (m[i]) {
            uri[key[i]] = m[i];
          }
        }

        if (component) {
          return uri[component.replace('PHP_URL_', '').toLowerCase()];
        }

        if (mode !== 'php') {
          var name = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.parse_url.queryKey') : undefined) || 'queryKey';
          parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
          uri[name] = {};
          query = uri[key[12]] || '';
          query.replace(parser, function ($0, $1, $2) {
            if ($1) {
              uri[name][$1] = $2;
            }
          });
        }

        delete uri.source;
        return uri;
      };
    }, { "../info/ini_get": 8 }], 16: [function (require, module, exports) {
      'use strict';

      var equal = require('deep-equal');
      var strtok = require('locutus/php/strings/strtok');
      var rtrim = require('locutus/php/strings/rtrim');
      var preg_quote = require('locutus/php/pcre/preg_quote');
      var str_replace = require('locutus/php/strings/str_replace');
      var ksort = require('locutus/php/array/ksort');
      var parse_url = require('locutus/php/url/parse_url');
      var parse_str = require('locutus/php/strings/parse_str');
      var array_merge = require('locutus/php/array/array_merge');

      var PermissionMatcher = function () {
        function PermissionMatcher() {
          _classCallCheck(this, PermissionMatcher);
        }

        /**
         * Get a flat list of privileges for matching authz groups
         *
         * @public
         * @param  {object} permissions
         * @param  {array}  authzGroups
         * @return {array}
         */


        _createClass(PermissionMatcher, [{
          key: "match",
          value: function match(permissions, authzGroups) {
            var privileges = [];

            for (var permissionAuthzGroup in permissions) {
              var permissionPrivileges = permissions[permissionAuthzGroup];
              var matchingAuthzGroup = this.getMatchingAuthzGroup(permissionAuthzGroup, authzGroups);

              if (!matchingAuthzGroup) {
                continue;
              }

              privileges.push(permissionPrivileges);
            };

            return this.flatten(privileges);
          }

          /**
           * Get a list of privileges for matching authz groups containing more information
           * Returns an array of objects where the privilege is the key and authzgroups the value
           *
           * @public
           * @param  {object} permissions
           * @param  {array}  authzGroups
           * @return {array}
           */

        }, {
          key: "matchFull",
          value: function matchFull(permissions, authzGroups) {
            var privileges = [];

            for (var permissionAuthzGroup in permissions) {
              var permissionPrivileges = permissions[permissionAuthzGroup];
              var matchingAuthzGroup = this.getMatchingAuthzGroup(permissionAuthzGroup, authzGroups);

              if (!matchingAuthzGroup) {
                continue;
              }

              privileges = this.addAuthzGroupsToPrivileges(privileges, permissionPrivileges, [permissionAuthzGroup, matchingAuthzGroup]);
            };

            return privileges;
          }

          /**
           * Check if one of the authz groups match
           *
           * @protected
           * @param  {string}      permissionAuthzGroup
           * @param  {array}       authzGroups
           * @return {string|null}
           */

        }, {
          key: "getMatchingAuthzGroup",
          value: function getMatchingAuthzGroup(permissionAuthzGroup, authzGroups) {
            var invert = this.stringStartsWith(permissionAuthzGroup, '!');

            if (invert) {
              permissionAuthzGroup = permissionAuthzGroup.substr(1);
            }

            var matches = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = authzGroups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var authzGroup = _step.value;

                var match = this.authzGroupsAreEqual(permissionAuthzGroup, authzGroup);

                if (match && invert) {
                  return null;
                }

                if (match && !invert || !match && invert) {
                  matches.push(authzGroup);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            ;

            return matches.length ? matches[0] : null;
          }

          /**
           * Check if authz groups match
           *
           * @protected
           * @param  {string}  permissionAuthzGroup
           * @param  {string}  authzGroup
           * @return {boolean}
           */

        }, {
          key: "authzGroupsAreEqual",
          value: function authzGroupsAreEqual(permissionAuthzGroup, authzGroup) {
            return this.pathsAreEqual(permissionAuthzGroup, authzGroup) && this.queryParamsAreEqual(permissionAuthzGroup, authzGroup);
          }

          /**
           * Compare the paths of two authz groups
           *
           * @protected
           * @param  {string}  permissionAuthzGroup
           * @param  {string}  authzGroup
           * @return {boolean}
           */

        }, {
          key: "pathsAreEqual",
          value: function pathsAreEqual(permissionAuthzGroup, authzGroup) {
            var permissionAuthzGroupPath = rtrim(strtok(permissionAuthzGroup, '?'), '/');
            var authzGroupPath = rtrim(strtok(authzGroup, '?'), '/');
            return this.matchAuthzGroupPaths(permissionAuthzGroupPath, authzGroupPath) || this.matchAuthzGroupPaths(authzGroupPath, permissionAuthzGroupPath);
          }

          /**
           * Check if one paths mathes the other
           *
           * @protected
           * @param  {string}  pattern
           * @param  {string}  subject
           * @return {boolean}
           */

        }, {
          key: "matchAuthzGroupPaths",
          value: function matchAuthzGroupPaths(pattern, subject) {
            var regex = '^' + str_replace('[^/]+', '\\*', preg_quote(pattern, '~')) + '$';
            regex = str_replace('\\*', '(.*)', regex);
            regex = new RegExp(regex, 'i');

            var match = subject.match(regex);

            return match;
          }

          /**
           * Compare the query parameters of two authz groups
           *
           * @protected
           * @param  {string}  permissionAuthzGroup
           * @param  {string}  authzGroup
           * @return {boolean}
           */

        }, {
          key: "queryParamsAreEqual",
          value: function queryParamsAreEqual(permissionAuthzGroup, authzGroup) {
            var authzGroupQueryParams = this.lowerCaseObjectKeys(this.getStringQueryParameters(authzGroup), 'CASE_LOWER');
            var permissionAuthzGroupQueryParams = this.lowerCaseObjectKeys(this.getStringQueryParameters(permissionAuthzGroup), 'CASE_LOWER');
            ksort(authzGroupQueryParams);
            ksort(permissionAuthzGroupQueryParams);
            return equal(permissionAuthzGroupQueryParams, authzGroupQueryParams);
          }

          /**
           * Get the query parameters used in a string
           *
           * @protected
           * @param  {string} string
           * @return {array}
           */

        }, {
          key: "getStringQueryParameters",
          value: function getStringQueryParameters(string) {
            var query = parse_url(string, 'PHP_URL_QUERY');
            var params = [];
            if (query) parse_str(query, params);
            return params;
          }

          /**
           * Turn a 2 dimensional privilege array into a list of privileges
           *
           * @protected
           * @param  {array} input
           * @return {array}
           */

        }, {
          key: "flatten",
          value: function flatten(input) {
            var list = [];

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var item = _step2.value;

                list = array_merge(list, [].concat(item));
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            return [].concat(_toConsumableArray(new Set(list)));
          }

          /**
           * Populate an array of privileges with their corresponding authz groups
           *
           * @protected
           * @param  {array}        privileges
           * @param  {string|array} authzGroupsPrivileges
           * @param  {array}        authzGroups
           * @return {array}
           */

        }, {
          key: "addAuthzGroupsToPrivileges",
          value: function addAuthzGroupsToPrivileges(privileges, authzGroupsPrivileges, authzGroups) {
            var authzPrivileges = typeof authzGroupsPrivileges !== 'string' ? authzGroupsPrivileges : [authzGroupsPrivileges];

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = authzPrivileges[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var privilege = _step3.value;

                var current = privileges[privilege] ? privileges[privilege] : [];
                privileges[privilege] = [].concat(_toConsumableArray(new Set(array_merge(current, authzGroups))));
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            ;

            return privileges;
          }

          /**
           * Check if a string starts with given substring
           *
           * @param  {string}  haystack
           * @param  {string}  needle
           * @return {boolean}
           */

        }, {
          key: "stringStartsWith",
          value: function stringStartsWith(haystack, needle) {
            return haystack.substring(0, needle.length) === needle;
          }

          /**
           * Lowercases the keys of an object
           *
           * @protected
           * @param  {object} object
           * @return {array}
           */

        }, {
          key: "lowerCaseObjectKeys",
          value: function lowerCaseObjectKeys(object) {
            var key = void 0,
                keys = Object.keys(object);
            var n = keys.length;
            var newObject = {};

            while (n--) {
              key = keys[n];
              newObject[key.toLowerCase()] = object[key];
            }

            return newObject;
          }
        }]);

        return PermissionMatcher;
      }();

      module.exports = PermissionMatcher;
    }, { "deep-equal": 1, "locutus/php/array/array_merge": 5, "locutus/php/array/ksort": 6, "locutus/php/pcre/preg_quote": 9, "locutus/php/strings/parse_str": 10, "locutus/php/strings/rtrim": 11, "locutus/php/strings/str_replace": 12, "locutus/php/strings/strtok": 14, "locutus/php/url/parse_url": 15 }] }, {}, [16])(16);
});
