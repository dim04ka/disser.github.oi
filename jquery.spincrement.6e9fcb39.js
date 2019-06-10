// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"CSbP":[function(require,module,exports) {
/**
 * jQuery Spincrement plugin
 *
 * Plugin structure based on: http://blog.jeremymartin.name/2008/02/building-your-first-jquery-plugin-that.html
 * Leveraging of jQuery animate() based on: http://www.bennadel.com/blog/2007-Using-jQuery-s-animate-Method-To-Power-Easing-Based-Iteration.htm
 * Easing function from jQuery Easing plugin: http://gsgd.co.uk/sandbox/jquery/easing/
 * Thousands separator code: http://www.webmasterworld.com/forum91/8.htm
 *
 * @author John J. Camilleri
 * @version 1.2
 */

/* global jQuery */
(function ($) {
  // Custom easing function
  $.extend($.easing, {
    // This is ripped directly from the jQuery easing plugin (easeOutExpo), from: http://gsgd.co.uk/sandbox/jquery/easing/
    spincrementEasing: function spincrementEasing(x, t, b, c, d) {
      return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }
  }); // Spincrement function

  $.fn.spincrement = function (opts) {
    // Default values
    var defaults = {
      from: 0,
      to: null,
      decimalPlaces: null,
      decimalPoint: '.',
      thousandSeparator: ',',
      duration: 1000,
      // ms; TOTAL length animation
      leeway: 50,
      // percent of duraion
      easing: 'spincrementEasing',
      fade: true,
      complete: null
    };
    var options = $.extend(defaults, opts); // Function for formatting number

    var re_thouSep = new RegExp(/^(-?[0-9]+)([0-9]{3})/);

    function format(num, dp) {
      num = num.toFixed(dp); // converts to string!
      // Non "." decimal point

      if (dp > 0 && options.decimalPoint !== '.') {
        num = num.replace('.', options.decimalPoint);
      } // Thousands separator


      if (options.thousandSeparator) {
        while (re_thouSep.test(num)) {
          num = num.replace(re_thouSep, '$1' + options.thousandSeparator + '$2');
        }
      }

      return num;
    } // Apply to each matching item


    return this.each(function () {
      // Get handle on current obj
      var obj = $(this); // Set params FOR THIS ELEM

      var from = options.from;

      if (obj.attr('data-from')) {
        from = parseFloat(obj.attr('data-from'));
      }

      var to;

      if (obj.attr('data-to')) {
        to = parseFloat(obj.attr('data-to'));
      } else if (options.to !== null) {
        to = options.to;
      } else {
        var ts = $.inArray(options.thousandSeparator, ['\\', '^', '$', '*', '+', '?', '.']) > -1 ? '\\' + options.thousandSeparator : options.thousandSeparator;
        var re = new RegExp(ts, 'g');
        to = parseFloat(obj.text().replace(re, ''));
      }

      var duration = options.duration;

      if (options.leeway) {
        // If leeway is set, randomise duration a little
        duration += Math.round(options.duration * (Math.random() * 2 - 1) * options.leeway / 100);
      }

      var dp;

      if (obj.attr('data-dp')) {
        dp = parseInt(obj.attr('data-dp'), 10);
      } else if (options.decimalPlaces !== null) {
        dp = options.decimalPlaces;
      } else {
        var ix = obj.text().indexOf(options.decimalPoint);
        dp = ix > -1 ? obj.text().length - (ix + 1) : 0;
      } // Start


      obj.css('counter', from);
      if (options.fade) obj.css('opacity', 0);
      obj.animate({
        counter: to,
        opacity: 1
      }, {
        easing: options.easing,
        duration: duration,
        // Invoke the callback for each step.
        step: function step(progress) {
          obj.html(format(progress * to, dp));
        },
        complete: function complete() {
          // Cleanup
          obj.css('counter', null);
          obj.html(format(to, dp)); // user's callback

          if (options.complete) {
            options.complete(obj);
          }
        }
      });
    });
  };
})(jQuery);
},{}]},{},["CSbP"], null)