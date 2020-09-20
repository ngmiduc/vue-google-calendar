'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var diffMinutes = function diffMinutes(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};
var isBefore = function isBefore(d1, d2) {
  return d1.getTime() < d2.getTime();
};
var isAfter = function isAfter(d1, d2) {
  return d1.getTime() > d2.getTime();
};
var isSame = function isSame(d1, d2) {
  return d1.getTime() === d2.getTime();
};
var getMonday = function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};
var addDays = function addDays(date, amount) {
  var d = date;
  d.setDate(d.getDate() + amount);
  return d;
};//
var script = {
  name: "calendareventv2",
  props: {
    data: Object
  },
  data: function data() {
    return {
      opened: false
    };
  },
  computed: {
    getColor: function getColor() {
      var getContrastColor = function getContrastColor(color) {
        // Counting the perceptive luminance - human eye favors green color...
        var R = parseInt(color[1] + color[2], 16);
        var G = parseInt(color[3] + color[4], 16);
        var B = parseInt(color[5] + color[6], 16);
        var luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
        return luminance > 0.5 ? "#454545" : "#FFFFFF";
      };

      if (Array.isArray(this.data.color)) {
        return {
          background: this.multicolor(this.data.color)
        };
      } else return {
        backgroundColor: this.data.owner.color,
        color: getContrastColor(this.data.owner.color)
      };
    }
  },
  methods: {
    multicolor: function multicolor(c) {
      var string = "repeating-linear-gradient(45deg";
      var stripe = 50 / c.length;

      for (var i = 0; i < c.length; i++) {
        string += ",".concat(c[i], " ").concat(stripe * i, "%, ").concat(c[i], " ").concat(stripe * (i + 1), "%");
      }

      string += ")";
      return string;
    },
    timeToPercent: function timeToPercent(t) {
      //set top position of event block
      var percent = (t - 0) / (60 * 24 - 0);
      var outputX = percent * (100 - 0) + 0;
      return outputX + "%";
    },
    durationToPercent: function durationToPercent(l) {
      //set height of event block
      var percent = (l - 0) / (60 * 24 - 0);
      var outputX = percent * (100 - 0) + 0;
      return outputX + "%";
    },
    getPos: function getPos(_ref) {
      var start = _ref.start,
          end = _ref.end,
          indent = _ref.indent,
          index = _ref.index,
          indexOf = _ref.indexOf;
      //set events into position with indent index absolute position
      var offset = start.getMinutes() + start.getHours() * 60;
      var duration = diffMinutes(start, end);

      if (this.opened) {
        return {
          position: "absolute",
          right: "0px",
          left: "2.5px",
          top: this.timeToPercent(offset),
          height: this.durationToPercent(duration)
        };
      }

      var width = 90;
      if (index !== null) width = width / indexOf;
      var indentSize = 5;
      var left = indent * indentSize;

      if (index !== null) {
        left = left + width * (index - 1);
      }

      if (indent > 0 && index == null) width = width - indent * indentSize;

      if (indent > 0 && index !== null) {
        width = (95 - indent * (indentSize + 1)) / indexOf;
        left = indent * (indentSize + 1) + width * (index - 1);
      }

      var indentreset = 4;

      if (indent > indentreset && index == null) {
        left = indentSize * (indent % indentreset);
        width = 95;
      }

      if (indent > indentreset && index !== null) {
        width = (95 - indent % indentreset * (indentSize + 1)) / indexOf;
        left = indent % indentreset * (indentSize + 1) + width * (index % indentreset - 1);
      }

      return {
        position: "absolute",
        // right: right + "rem",
        width: width + "%",
        left: left + "%",
        top: this.timeToPercent(offset),
        height: this.durationToPercent(duration)
      };
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "cal-event",
    class: {
      selected: _vm.opened
    },
    style: _vm.getPos(_vm.data.grid)
  }, [_vm._ssrNode("<div class=\"cal-event-content\"" + _vm._ssrStyle(null, _vm.getColor, null) + " data-v-62af73ee>" + _vm._ssrEscape("\n    " + _vm._s(_vm.data.e.summary) + "\n  ") + "</div>")]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-62af73ee_0", {
    source: ".cal-event[data-v-62af73ee]{z-index:2;position:relative;opacity:.95;border-radius:4px;overflow:hidden;border:1px solid #dedede;transition:all 50ms}.cal-event[data-v-62af73ee]:hover{transition:all 250ms;opacity:1;cursor:pointer;transform:scale(1.025)}.cal-event.selected[data-v-62af73ee]{transition:all 250ms;z-index:100;min-height:40px;box-shadow:5px 5px 20px 0 rgba(109,126,135,.56)}.cal-event .cal-event-content[data-v-62af73ee]{width:100%;height:100%;padding:4px;box-sizing:border-box;display:flex;align-items:flex-start;justify-content:flex-start;font-size:1.5vmin;color:#454545}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-62af73ee";
/* module identifier */

var __vue_module_identifier__ = "data-v-62af73ee";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);var script$1 = {
  name: "calendarcolumn",
  components: {
    CalendarEvent: __vue_component__
  },
  props: {
    precision: Number,
    day: Date,
    data: Array
  },
  data: function data() {
    return {
      scrollPercent: 0,
      editing: false,
      active: false
    };
  },
  created: function created() {
    var now = new Date();
    var minutes = now.getMinutes() + now.getHours() * 60;
    this.scrollPercent = (minutes - 0) / (60 * 24 - 0) * (100 - 0) + 0;
  },
  computed: {
    positioning: function positioning() {
      var _this = this;

      if (!this.data) return [];
      return _toConsumableArray(this.data).sort(function (a, b) {
        return isSame(a.grid.start, b.grid.start) ? b.grid.dur - a.grid.dur : diffMinutes(a.grid.start, b.grid.start);
      }).map(function (item) {
        var block = _this.data.filter(function (i) {
          return isBefore(i.grid.start, item.grid.start) && isAfter(i.grid.end, item.grid.start);
        });

        if (block.length == 0) {
          item.grid["indent"] = 0;
        } else {
          var maxindent = 1;
          block.forEach(function (i) {
            if (i.grid.indent) if (i.grid.indent >= maxindent) maxindent = i.grid.indent + 1;
          });
          item.grid["indent"] = maxindent;
        }

        var same = _this.data.filter(function (i) {
          return isSame(i.grid.start, item.grid.start);
        });

        if (same.length <= 1) {
          item.grid["index"] = null;
          item.grid["indexOf"] = null;
        } else {
          var index = 1;
          same.forEach(function (i) {
            if (i.grid.index) {
              if (i.grid.index == index) index++;
            }
          });
          item.grid["index"] = index;
          item.grid["indexOf"] = same.length;
        }

        return item;
      });
    }
  }
};/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "cal-column",
    class: {
      selected: _vm.active
    }
  }, [_vm._ssrNode("<div class=\"cal-column-header\" data-v-df196926><span class=\"dayname\" data-v-df196926>" + _vm._ssrEscape(_vm._s(_vm.day.toLocaleString("default", {
    weekday: "long"
  }))) + "</span> <span class=\"daynum\" data-v-df196926>" + _vm._ssrEscape(_vm._s(_vm.day.getDate())) + "</span></div> "), _vm._ssrNode("<div class=\"cal-column-body\" data-v-df196926>", "</div>", [_vm._ssrNode("<div class=\"cal-column-body-slotgrid\" data-v-df196926>" + _vm._ssrList(24, function (n) {
    return "<div class=\"cal-column-body-slotgrid--lines\" data-v-df196926>" + _vm._ssrEscape("\n        " + _vm._s(n) + ":00\n      ") + "</div>";
  }) + "</div> "), _vm._ssrNode("<div class=\"cal-column-body-eventgrid\" data-v-df196926>", "</div>", [_vm._ssrNode((new Date().getDay() === _vm.day.getDay() ? "<div class=\"index\"" + _vm._ssrStyle(null, {
    top: _vm.scrollPercent + '%'
  }, null) + " data-v-df196926></div>" : "<!---->") + " "), _vm._l(_vm.positioning, function (e, index) {
    return _c('calendar-event', {
      key: index,
      attrs: {
        "data": e
      }
    });
  })], 2)], 2)], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-df196926_0", {
    source: ".cal-column[data-v-df196926]{height:inherit;z-index:3}.cal-column.border-left[data-v-df196926]{border-left:1px solid rgba(0,0,0,.1)}.cal-column .cal-column-header[data-v-df196926]{border-bottom:1px solid rgba(0,0,0,.1);padding:10px;background-color:#f0f0f0;color:#000;display:flex;align-items:center;justify-content:space-between;position:sticky;position:-webkit-sticky;top:0;z-index:200}.cal-column .cal-column-header .dayname[data-v-df196926]{font-size:16px;text-transform:uppercase}.cal-column .cal-column-header .daynum[data-v-df196926]{font-size:20px}.cal-column .cal-column-body[data-v-df196926]{position:relative;height:100%}.cal-column .cal-column-body .cal-column-body-editgrid[data-v-df196926],.cal-column .cal-column-body .cal-column-body-eventgrid[data-v-df196926],.cal-column .cal-column-body .cal-column-body-slotgrid[data-v-df196926]{position:absolute;top:0;left:0;right:0;bottom:0;height:100%}.cal-column .cal-column-body .cal-column-body-eventgrid[data-v-df196926]{right:15px}.cal-column .cal-column-body .cal-column-body-eventgrid .index[data-v-df196926]{position:absolute;background-color:rgba(255,0,0,.5);left:0;right:-5px;height:10px;z-index:10;border-radius:2px}.cal-column .cal-column-body .cal-column-body-slotgrid[data-v-df196926]{display:grid;grid-template-rows:repeat(24,1fr);z-index:1}.cal-column .cal-column-body .cal-column-body-slotgrid .cal-column-body-slotgrid--lines[data-v-df196926]{color:rgba(200,200,200,.9);padding:0 2px;text-align:right;font-size:14px;display:flex;flex-direction:column;justify-content:flex-end;user-select:none}.cal-column .cal-column-body .cal-column-body-slotgrid .cal-column-body-slotgrid--lines[data-v-df196926]:not(:first-child){border-top:1px solid rgba(170,170,170,.2)}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$1 = "data-v-df196926";
/* module identifier */

var __vue_module_identifier__$1 = "data-v-df196926";
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, createInjectorSSR, undefined);//
var script$2 = {
  name: "vue-google-calendar",
  components: {
    CalendarColumn: __vue_component__$1
  },
  props: {
    precision: {
      type: Number,
      default: 30
    },
    data: Array,
    selected: {
      type: Date,
      default: function _default() {
        return new Date();
      }
    }
  },
  mounted: function mounted() {
    var now = new Date();
    var minutes = now.getMinutes() + now.getHours() * 60;
    var scrollPercent = (minutes - 0) / (60 * 24 - 0) * (100 - 0) + 0;
    this.$refs.cal.scrollTop = scrollPercent / 100 * this.$refs.cal.scrollHeight - this.$refs.cal.clientHeight / 2;
  },
  computed: {
    days: function days() {
      var result = [];

      for (var i = 0; i < 7; i++) {
        result.push(addDays(getMonday(new Date()), i));
      }

      return result;
    },
    concatenatedData: function concatenatedData() {
      var _this = this;

      var roundTime = function roundTime(t) {
        var m = t.getMinutes();
        var h = t.getHours();
        var i = 1;
        var ceil = 0;

        while (_this.precision * i < 60) {
          ceil = _this.precision * i;
          i++;
        }

        if (m > ceil) h++;
        m = ((m + _this.precision / 2) / _this.precision | 0) * _this.precision % 60;
        t.setHours(h);
        t.setMinutes(m);
        t.setSeconds(0);
        t.setMilliseconds(0);
        return t;
      };

      var tmp = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: []
      };
      if (this.data) this.data.forEach(function (person) {
        return person.dates.forEach(function (date) {
          var start = new Date(date.start.date || date.start.dateTime);
          var end = new Date(date.end.date || date.end.dateTime);
          var weekday = new Date(start).toLocaleString("default", {
            weekday: "short"
          }).toLowerCase();
          var e = {
            id: date.id,
            color: person.color,
            owner: person,
            e: date,
            grid: {
              start: roundTime(start),
              end: start.getTime() != end.getTime() ? roundTime(end) : roundTime(end.setMinutes(end.getMinutes(), _this.precision)),
              dur: start.getTime() != end.getTime() ? Math.round(diffMinutes(end, start) / _this.precision) : Math.round((diffMinutes(end, start) + _this.precision) / _this.precision)
            }
          };
          var multievent = [];
          if (date.attendees) _this.data.forEach(function (p) {
            return p.dates.forEach(function (i) {
              if (date.attendees) if (i.id === date.id) {
                multievent.push(p.color);
              }
            });
          });

          if (multievent.length > 1) {
            var existAlready = tmp[weekday].find(function (t) {
              return t.id == date.id;
            });

            if (!existAlready) {
              e.color = multievent;
              tmp[weekday].push(e);
            }
          } else tmp[weekday].push(e);
        });
      });
      return tmp;
    }
  }
};/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "cal-wrapper"
  }, [_vm._ssrNode("<div class=\"cal\" data-v-3a6b9c8a>", "</div>", _vm._l(_vm.concatenatedData, function (value, name, index) {
    return _c('calendar-column', {
      key: name,
      attrs: {
        "data": value,
        "day": _vm.days[index],
        "precision": _vm.precision
      }
    });
  }), 1)]);
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$2 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-3a6b9c8a_0", {
    source: ".cal-wrapper[data-v-3a6b9c8a]{height:100%;width:100%;position:relative;border:.1px solid rgba(164,164,164,.25);box-shadow:0 0 25px 5px rgba(135,137,182,.2);border-radius:10px;overflow:hidden}.cal-wrapper *[data-v-3a6b9c8a]{font-weight:lighter;color:#606060}.cal-wrapper .cal[data-v-3a6b9c8a]{overflow-y:scroll;background-color:#fff;height:100%;user-select:none;display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:300%}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$2 = "data-v-3a6b9c8a";
/* module identifier */

var __vue_module_identifier__$2 = "data-v-3a6b9c8a";
/* functional template */

var __vue_is_functional_template__$2 = false;
/* style inject shadow dom */

var __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, createInjectorSSR, undefined);// Import vue component

var install = function installVueGoogleCalendar(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("VueGoogleCalendar", __vue_component__$2);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== "undefined") {
    GlobalVue = window.Vue;
  } else if (typeof global !== "undefined") {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__$2.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__$2;