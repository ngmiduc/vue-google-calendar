const diffMinutes = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};
const isBefore = (d1, d2) => {
  return d1.getTime() < d2.getTime();
};
const isAfter = (d1, d2) => {
  return d1.getTime() > d2.getTime();
};
const isSame = (d1, d2) => {
  return d1.getTime() === d2.getTime();
};
const getMonday = d => {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};
const addDays = (date, amount) => {
  const d = date;
  d.setDate(d.getDate() + amount);
  return d;
};

//
var script = {
  name: "calendareventv2",
  props: {
    data: Object
  },

  data() {
    return {
      opened: false
    };
  },

  computed: {
    getColor() {
      const getContrastColor = color => {
        // Counting the perceptive luminance - human eye favors green color...
        const R = parseInt(color[1] + color[2], 16);
        const G = parseInt(color[3] + color[4], 16);
        const B = parseInt(color[5] + color[6], 16);
        const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
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
    multicolor(c) {
      let string = "repeating-linear-gradient(45deg";
      let stripe = 50 / c.length;

      for (var i = 0; i < c.length; i++) {
        string += `,${c[i]} ${stripe * i}%, ${c[i]} ${stripe * (i + 1)}%`;
      }

      string += ")";
      return string;
    },

    timeToPercent(t) {
      //set top position of event block
      let percent = (t - 0) / (60 * 24 - 0);
      let outputX = percent * (100 - 0) + 0;
      return outputX + "%";
    },

    durationToPercent(l) {
      //set height of event block
      let percent = (l - 0) / (60 * 24 - 0);
      let outputX = percent * (100 - 0) + 0;
      return outputX + "%";
    },

    getPos({
      start,
      end,
      indent,
      index,
      indexOf
    }) {
      //set events into position with indent index absolute position
      let offset = start.getMinutes() + start.getHours() * 60;
      let duration = diffMinutes(start, end);

      if (this.opened) {
        return {
          position: "absolute",
          right: "0px",
          left: "2.5px",
          top: this.timeToPercent(offset),
          height: this.durationToPercent(duration)
        };
      }

      let width = 90;
      if (index !== null) width = width / indexOf;
      let indentSize = 5;
      let left = indent * indentSize;

      if (index !== null) {
        left = left + width * (index - 1);
      }

      if (indent > 0 && index == null) width = width - indent * indentSize;

      if (indent > 0 && index !== null) {
        width = (95 - indent * (indentSize + 1)) / indexOf;
        left = indent * (indentSize + 1) + width * (index - 1);
      }

      let indentreset = 4;

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
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "cal-event",
    class: {
      selected: _vm.opened
    },
    style: _vm.getPos(_vm.data.grid)
  }, [_c('div', {
    staticClass: "cal-event-content",
    style: _vm.getColor,
    on: {
      "click": function ($event) {
        _vm.opened = !_vm.opened;
      }
    }
  }, [_vm._v("\n    " + _vm._s(_vm.data.e.summary) + "\n  ")])]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-0ad3d1d5_0", {
    source: ".cal-event[data-v-0ad3d1d5]{z-index:2;position:relative;opacity:.95;border-radius:4px;overflow:hidden;border:1px solid #dedede;transition:all 50ms}.cal-event[data-v-0ad3d1d5]:hover{transition:all 250ms;opacity:1;cursor:pointer;transform:scale(1.025)}.cal-event.selected[data-v-0ad3d1d5]{transition:all 250ms;z-index:100;min-height:40px;box-shadow:5px 5px 20px 0 rgba(109,126,135,.56)}.cal-event .cal-event-content[data-v-0ad3d1d5]{width:100%;height:100%;padding:4px;box-sizing:border-box;display:flex;align-items:flex-start;justify-content:flex-start;font-size:1.5vmin;color:#454545}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-0ad3d1d5";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

//
var script$1 = {
  name: "calendarcolumn",
  components: {
    CalendarEvent: __vue_component__
  },
  props: {
    precision: Number,
    day: Date,
    data: Array
  },

  data() {
    return {
      scrollPercent: 0,
      editing: false,
      active: false
    };
  },

  created() {
    let now = new Date();
    let minutes = now.getMinutes() + now.getHours() * 60;
    this.scrollPercent = (minutes - 0) / (60 * 24 - 0) * (100 - 0) + 0;
  },

  computed: {
    positioning() {
      if (!this.data) return [];
      return [...this.data].sort((a, b) => isSame(a.grid.start, b.grid.start) ? b.grid.dur - a.grid.dur : diffMinutes(a.grid.start, b.grid.start)).map(item => {
        let block = this.data.filter(i => isBefore(i.grid.start, item.grid.start) && isAfter(i.grid.end, item.grid.start));

        if (block.length == 0) {
          item.grid["indent"] = 0;
        } else {
          let maxindent = 1;
          block.forEach(i => {
            if (i.grid.indent) if (i.grid.indent >= maxindent) maxindent = i.grid.indent + 1;
          });
          item.grid["indent"] = maxindent;
        }

        let same = this.data.filter(i => isSame(i.grid.start, item.grid.start));

        if (same.length <= 1) {
          item.grid["index"] = null;
          item.grid["indexOf"] = null;
        } else {
          let index = 1;
          same.forEach(i => {
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
};

/* script */
const __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "cal-column",
    class: {
      selected: _vm.active
    }
  }, [_c('div', {
    staticClass: "cal-column-header"
  }, [_c('span', {
    staticClass: "dayname"
  }, [_vm._v(_vm._s(_vm.day.toLocaleString("default", {
    weekday: "long"
  })))]), _vm._v(" "), _c('span', {
    staticClass: "daynum"
  }, [_vm._v(_vm._s(_vm.day.getDate()))])]), _vm._v(" "), _c('div', {
    staticClass: "cal-column-body"
  }, [_c('div', {
    staticClass: "cal-column-body-slotgrid"
  }, _vm._l(24, function (n) {
    return _c('div', {
      key: "" + n,
      staticClass: "cal-column-body-slotgrid--lines"
    }, [_vm._v("\n        " + _vm._s(n) + ":00\n      ")]);
  }), 0), _vm._v(" "), _c('div', {
    staticClass: "cal-column-body-eventgrid"
  }, [new Date().getDay() === _vm.day.getDay() ? _c('div', {
    staticClass: "index",
    style: {
      top: _vm.scrollPercent + '%'
    }
  }) : _vm._e(), _vm._v(" "), _vm._l(_vm.positioning, function (e, index) {
    return _c('calendar-event', {
      key: index,
      attrs: {
        "data": e
      }
    });
  })], 2)])]);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = function (inject) {
  if (!inject) return;
  inject("data-v-17672579_0", {
    source: ".cal-column[data-v-17672579]{height:inherit;z-index:3}.cal-column.border-left[data-v-17672579]{border-left:1px solid rgba(0,0,0,.1)}.cal-column .cal-column-header[data-v-17672579]{border-bottom:1px solid rgba(0,0,0,.1);padding:10px;background-color:#f0f0f0;color:#000;display:flex;align-items:center;justify-content:space-between;position:sticky;position:-webkit-sticky;top:0;z-index:200}.cal-column .cal-column-header .dayname[data-v-17672579]{font-size:16px;text-transform:uppercase}.cal-column .cal-column-header .daynum[data-v-17672579]{font-size:20px}.cal-column .cal-column-body[data-v-17672579]{position:relative;height:100%}.cal-column .cal-column-body .cal-column-body-editgrid[data-v-17672579],.cal-column .cal-column-body .cal-column-body-eventgrid[data-v-17672579],.cal-column .cal-column-body .cal-column-body-slotgrid[data-v-17672579]{position:absolute;top:0;left:0;right:0;bottom:0;height:100%}.cal-column .cal-column-body .cal-column-body-eventgrid[data-v-17672579]{right:15px}.cal-column .cal-column-body .cal-column-body-eventgrid .index[data-v-17672579]{position:absolute;background-color:rgba(255,0,0,.5);left:0;right:-5px;height:10px;z-index:10;border-radius:2px}.cal-column .cal-column-body .cal-column-body-slotgrid[data-v-17672579]{display:grid;grid-template-rows:repeat(24,1fr);z-index:1}.cal-column .cal-column-body .cal-column-body-slotgrid .cal-column-body-slotgrid--lines[data-v-17672579]{color:rgba(200,200,200,.9);padding:0 2px;text-align:right;font-size:14px;display:flex;flex-direction:column;justify-content:flex-end;user-select:none}.cal-column .cal-column-body .cal-column-body-slotgrid .cal-column-body-slotgrid--lines[data-v-17672579]:not(:first-child){border-top:1px solid rgba(170,170,170,.2)}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$1 = "data-v-17672579";
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, createInjector, undefined, undefined);

//
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
      default: () => new Date()
    }
  },

  mounted() {
    let now = new Date();
    let minutes = now.getMinutes() + now.getHours() * 60;
    let scrollPercent = (minutes - 0) / (60 * 24 - 0) * (100 - 0) + 0;
    this.$refs.cal.scrollTop = scrollPercent / 100 * this.$refs.cal.scrollHeight - this.$refs.cal.clientHeight / 2;
  },

  computed: {
    days() {
      let result = [];

      for (var i = 0; i < 7; i++) {
        result.push(addDays(getMonday(new Date()), i));
      }

      return result;
    },

    concatenatedData() {
      const roundTime = t => {
        let m = t.getMinutes();
        let h = t.getHours();
        let i = 1;
        let ceil = 0;

        while (this.precision * i < 60) {
          ceil = this.precision * i;
          i++;
        }

        if (m > ceil) h++;
        m = ((m + this.precision / 2) / this.precision | 0) * this.precision % 60;
        t.setHours(h);
        t.setMinutes(m);
        t.setSeconds(0);
        t.setMilliseconds(0);
        return t;
      };

      let tmp = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: []
      };
      if (this.data) this.data.forEach(person => person.dates.forEach(date => {
        let start = new Date(date.start.date || date.start.dateTime);
        let end = new Date(date.end.date || date.end.dateTime);
        let weekday = new Date(start).toLocaleString("default", {
          weekday: "short"
        }).toLowerCase();
        let e = {
          id: date.id,
          color: person.color,
          owner: person,
          e: date,
          grid: {
            start: roundTime(start),
            end: start.getTime() != end.getTime() ? roundTime(end) : roundTime(end.setMinutes(end.getMinutes(), this.precision)),
            dur: start.getTime() != end.getTime() ? Math.round(diffMinutes(end, start) / this.precision) : Math.round((diffMinutes(end, start) + this.precision) / this.precision)
          }
        };
        let multievent = [];
        if (date.attendees) this.data.forEach(p => p.dates.forEach(i => {
          if (date.attendees) if (i.id === date.id) {
            multievent.push(p.color);
          }
        }));

        if (multievent.length > 1) {
          let existAlready = tmp[weekday].find(t => t.id == date.id);

          if (!existAlready) {
            e.color = multievent;
            tmp[weekday].push(e);
          }
        } else tmp[weekday].push(e);
      }));
      return tmp;
    }

  }
};

/* script */
const __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "cal-wrapper"
  }, [_c('div', {
    ref: "cal",
    staticClass: "cal"
  }, _vm._l(_vm.concatenatedData, function (value, name, index) {
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

const __vue_inject_styles__$2 = function (inject) {
  if (!inject) return;
  inject("data-v-42a98087_0", {
    source: ".cal-wrapper[data-v-42a98087]{height:100%;width:100%;position:relative;border:.1px solid rgba(164,164,164,.25);box-shadow:0 0 25px 5px rgba(135,137,182,.2);border-radius:10px;overflow:hidden}.cal-wrapper *[data-v-42a98087]{font-weight:lighter;color:#606060}.cal-wrapper .cal[data-v-42a98087]{overflow-y:scroll;background-color:#fff;height:100%;user-select:none;display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:300%}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$2 = "data-v-42a98087";
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, createInjector, undefined, undefined);

// Import vue component

const install = function installVueGoogleCalendar(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("VueGoogleCalendar", __vue_component__$2);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__$2.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__$2;
