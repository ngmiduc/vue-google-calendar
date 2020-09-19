(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['v-google-calendar'] = global['v-google-calendar'] || {}));
}(this, (function (exports) { 'use strict';

  var diffMinutes = function (dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff))
  };

  var isBefore = function (d1, d2) {
    return d1.getTime() < d2.getTime()
  };
  var isAfter = function (d1, d2) {
    return d1.getTime() > d2.getTime()
  };

  var isSame = function (d1, d2) {
    return d1.getTime() === d2.getTime()
  };

  var getMonday = function (d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff))
  };

  var addDays = function (date, amount) {
    var d = date;
    d.setDate(d.getDate() + amount);
    return d
  };

  //

  var script = {
    name: "calendareventv2",
    props: {
      data: Object
    },
    data: function data() {
      return {
        opened: false
      }
    },
    computed: {
      getColor: function getColor() {
        var getContrastColor = function (color) {
          // Counting the perceptive luminance - human eye favors green color...
          var R = parseInt(color[1] + color[2], 16);
          var G = parseInt(color[3] + color[4], 16);
          var B = parseInt(color[5] + color[6], 16);

          var luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255;

          return luminance > 0.5 ? "#454545" : "#FFFFFF"
        };

        if (Array.isArray(this.data.color)) {
          return { background: this.multicolor(this.data.color) }
        } else
          { return {
            backgroundColor: this.data.owner.color,
            color: getContrastColor(this.data.owner.color)
          } }
      }
    },
    methods: {
      multicolor: function multicolor(c) {
        var string = "repeating-linear-gradient(45deg";
        var stripe = 50 / c.length;
        for (var i = 0; i < c.length; i++) {
          string += "," + (c[i]) + " " + (stripe * i) + "%, " + (c[i]) + " " + (stripe * (i + 1)) + "%";
        }
        string += ")";
        return string
      },

      timeToPercent: function timeToPercent(t) {
        //set top position of event block
        var percent = (t - 0) / (60 * 24 - 0);
        var outputX = percent * (100 - 0) + 0;
        return outputX + "%"
      },
      durationToPercent: function durationToPercent(l) {
        //set height of event block
        var percent = (l - 0) / (60 * 24 - 0);
        var outputX = percent * (100 - 0) + 0;
        return outputX + "%"
      },

      getPos: function getPos(ref) {
        var start = ref.start;
        var end = ref.end;
        var indent = ref.indent;
        var index = ref.index;
        var indexOf = ref.indexOf;

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
          }
        }
        var width = 90;

        if (index !== null) { width = width / indexOf; }
        var indentSize = 5;

        var left = indent * indentSize;
        if (index !== null) {
          left = left + width * (index - 1);
        }
        if (indent > 0 && index == null) { width = width - indent * indentSize; }
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
          width = (95 - (indent % indentreset) * (indentSize + 1)) / indexOf;
          left =
            (indent % indentreset) * (indentSize + 1) +
            width * ((index % indentreset) - 1);
        }

        return {
          position: "absolute",
          // right: right + "rem",
          width: width + "%",
          left: left + "%",
          top: this.timeToPercent(offset),
          height: this.durationToPercent(duration)
        }
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
      var options = typeof script === 'function' ? script.options : script;
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
      var hook;
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
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
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
                  { style.element.setAttribute('media', css.media); }
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
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        staticClass: "cal-event",
        class: { selected: _vm.opened },
        style: _vm.getPos(_vm.data.grid)
      },
      [
        _c(
          "div",
          {
            staticClass: "cal-event-content",
            style: _vm.getColor,
            on: {
              click: function($event) {
                _vm.opened = !_vm.opened;
              }
            }
          },
          [_vm._v("\n    " + _vm._s(_vm.data.e.summary) + "\n  ")]
        )
      ]
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-2a4f62d0_0", { source: ".cal-event[data-v-2a4f62d0] {\n  z-index: 2;\n  position: relative;\n  opacity: 0.95;\n  border-radius: 4px;\n  overflow: hidden;\n  border: 1px solid #dedede;\n  transition: all 50ms;\n}\n.cal-event[data-v-2a4f62d0]:hover {\n  transition: all 250ms;\n  opacity: 1;\n  cursor: pointer;\n  transform: scale(1.025);\n}\n.cal-event.selected[data-v-2a4f62d0] {\n  transition: all 250ms;\n  z-index: 100;\n  min-height: 40px;\n  box-shadow: 5px 5px 20px 0px rgba(109, 126, 135, 0.56);\n}\n.cal-event .cal-event-content[data-v-2a4f62d0] {\n  width: 100%;\n  height: 100%;\n  padding: 4px;\n  box-sizing: border-box;\n  display: flex;\n  align-items: flex-start;\n  justify-content: flex-start;\n  font-size: 1.5vmin;\n  color: #454545;\n}\n\n/*# sourceMappingURL=CalendarEvent.vue.map */", map: {"version":3,"sources":["/Users/nguyenminhduc/dev/vue-google-calendar/src/calendar/CalendarEvent.vue","CalendarEvent.vue"],"names":[],"mappings":"AAkIA;EACA,UAAA;EACA,kBAAA;EACA,aAAA;EACA,kBAAA;EACA,gBAAA;EACA,yBAAA;EAEA,oBAAA;AClIA;ADoIA;EACA,qBAAA;EACA,UAAA;EACA,eAAA;EACA,uBAAA;AClIA;ADqIA;EACA,qBAAA;EACA,YAAA;EACA,gBAAA;EACA,sDAAA;ACnIA;ADsIA;EACA,WAAA;EACA,YAAA;EACA,YAAA;EAEA,sBAAA;EAEA,aAAA;EACA,uBAAA;EACA,2BAAA;EACA,kBAAA;EAEA,cAAA;ACvIA;;AAEA,4CAA4C","file":"CalendarEvent.vue","sourcesContent":["<template>\n  <div\n    class=\"cal-event\"\n    :style=\"getPos(data.grid)\"\n    :class=\"{ selected: opened }\"\n  >\n    <div class=\"cal-event-content\" :style=\"getColor\" @click=\"opened = !opened\">\n      {{ data.e.summary }}\n    </div>\n  </div>\n</template>\n\n<script>\nimport * as fn from \"../utils/functions\"\n\nexport default {\n  name: \"calendareventv2\",\n  props: {\n    data: Object\n  },\n  data() {\n    return {\n      opened: false\n    }\n  },\n  computed: {\n    getColor() {\n      const getContrastColor = color => {\n        // Counting the perceptive luminance - human eye favors green color...\n        const R = parseInt(color[1] + color[2], 16)\n        const G = parseInt(color[3] + color[4], 16)\n        const B = parseInt(color[5] + color[6], 16)\n\n        const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255\n\n        return luminance > 0.5 ? \"#454545\" : \"#FFFFFF\"\n      }\n\n      if (Array.isArray(this.data.color)) {\n        return { background: this.multicolor(this.data.color) }\n      } else\n        return {\n          backgroundColor: this.data.owner.color,\n          color: getContrastColor(this.data.owner.color)\n        }\n    }\n  },\n  methods: {\n    multicolor(c) {\n      let string = \"repeating-linear-gradient(45deg\"\n      let stripe = 50 / c.length\n      for (var i = 0; i < c.length; i++) {\n        string += `,${c[i]} ${stripe * i}%, ${c[i]} ${stripe * (i + 1)}%`\n      }\n      string += \")\"\n      return string\n    },\n\n    timeToPercent(t) {\n      //set top position of event block\n      let percent = (t - 0) / (60 * 24 - 0)\n      let outputX = percent * (100 - 0) + 0\n      return outputX + \"%\"\n    },\n    durationToPercent(l) {\n      //set height of event block\n      let percent = (l - 0) / (60 * 24 - 0)\n      let outputX = percent * (100 - 0) + 0\n      return outputX + \"%\"\n    },\n\n    getPos({ start, end, indent, index, indexOf }) {\n      //set events into position with indent index absolute position\n\n      let offset = start.getMinutes() + start.getHours() * 60\n      let duration = fn.diffMinutes(start, end)\n\n      if (this.opened) {\n        return {\n          position: \"absolute\",\n          right: \"0px\",\n          left: \"2.5px\",\n          top: this.timeToPercent(offset),\n          height: this.durationToPercent(duration)\n        }\n      }\n      let width = 90\n\n      if (index !== null) width = width / indexOf\n      let indentSize = 5\n\n      let left = indent * indentSize\n      if (index !== null) {\n        left = left + width * (index - 1)\n      }\n      if (indent > 0 && index == null) width = width - indent * indentSize\n      if (indent > 0 && index !== null) {\n        width = (95 - indent * (indentSize + 1)) / indexOf\n\n        left = indent * (indentSize + 1) + width * (index - 1)\n      }\n\n      let indentreset = 4\n\n      if (indent > indentreset && index == null) {\n        left = indentSize * (indent % indentreset)\n        width = 95\n      }\n\n      if (indent > indentreset && index !== null) {\n        width = (95 - (indent % indentreset) * (indentSize + 1)) / indexOf\n        left =\n          (indent % indentreset) * (indentSize + 1) +\n          width * ((index % indentreset) - 1)\n      }\n\n      return {\n        position: \"absolute\",\n        // right: right + \"rem\",\n        width: width + \"%\",\n        left: left + \"%\",\n        top: this.timeToPercent(offset),\n        height: this.durationToPercent(duration)\n      }\n    }\n  }\n}\n</script>\n\n<style lang=\"scss\" scoped>\n.cal-event {\n  z-index: 2;\n  position: relative;\n  opacity: 0.95;\n  border-radius: 4px;\n  overflow: hidden;\n  border: 1px solid rgb(222, 222, 222);\n\n  transition: all 50ms;\n\n  &:hover {\n    transition: all 250ms;\n    opacity: 1;\n    cursor: pointer;\n    transform: scale(1.025);\n  }\n\n  &.selected {\n    transition: all 250ms;\n    z-index: 100;\n    min-height: 40px;\n    box-shadow: 5px 5px 20px 0px rgba(109, 126, 135, 0.56);\n  }\n\n  .cal-event-content {\n    width: 100%;\n    height: 100%;\n    padding: 4px;\n\n    box-sizing: border-box;\n\n    display: flex;\n    align-items: flex-start;\n    justify-content: flex-start;\n    font-size: 1.5vmin;\n\n    color: #454545;\n  }\n}\n</style>\n",".cal-event {\n  z-index: 2;\n  position: relative;\n  opacity: 0.95;\n  border-radius: 4px;\n  overflow: hidden;\n  border: 1px solid #dedede;\n  transition: all 50ms;\n}\n.cal-event:hover {\n  transition: all 250ms;\n  opacity: 1;\n  cursor: pointer;\n  transform: scale(1.025);\n}\n.cal-event.selected {\n  transition: all 250ms;\n  z-index: 100;\n  min-height: 40px;\n  box-shadow: 5px 5px 20px 0px rgba(109, 126, 135, 0.56);\n}\n.cal-event .cal-event-content {\n  width: 100%;\n  height: 100%;\n  padding: 4px;\n  box-sizing: border-box;\n  display: flex;\n  align-items: flex-start;\n  justify-content: flex-start;\n  font-size: 1.5vmin;\n  color: #454545;\n}\n\n/*# sourceMappingURL=CalendarEvent.vue.map */"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-2a4f62d0";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

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
    data: function data() {
      return {
        scrollPercent: 0,
        editing: false,
        active: false
      }
    },

    created: function created() {
      var now = new Date();
      var minutes = now.getMinutes() + now.getHours() * 60;

      this.scrollPercent = ((minutes - 0) / (60 * 24 - 0)) * (100 - 0) + 0;
    },
    computed: {
      positioning: function positioning() {
        var this$1 = this;

        if (!this.data) { return [] }
        return [].concat( this.data )
          .sort(function (a, b) { return isSame(a.grid.start, b.grid.start)
              ? b.grid.dur - a.grid.dur
              : diffMinutes(a.grid.start, b.grid.start); }
          )
          .map(function (item) {
            var block = this$1.data.filter(
              function (i) { return isBefore(i.grid.start, item.grid.start) &&
                isAfter(i.grid.end, item.grid.start); }
            );
            if (block.length == 0) {
              item.grid["indent"] = 0;
            } else {
              var maxindent = 1;

              block.forEach(function (i) {
                if (i.grid.indent)
                  { if (i.grid.indent >= maxindent) { maxindent = i.grid.indent + 1; } }
              });

              item.grid["indent"] = maxindent;
            }

            var same = this$1.data.filter(function (i) { return isSame(i.grid.start, item.grid.start); }
            );

            if (same.length <= 1) {
              item.grid["index"] = null;
              item.grid["indexOf"] = null;
            } else {
              var index = 1;

              same.forEach(function (i) {
                if (i.grid.index) {
                  if (i.grid.index == index) { index++; }
                }
              });

              item.grid["index"] = index;
              item.grid["indexOf"] = same.length;
            }

            return item
          })
      }
    }
  };

  /* script */
  var __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "cal-column", class: { selected: _vm.active } },
      [
        _c("div", { staticClass: "cal-column-header" }, [
          _c("span", { staticClass: "dayname" }, [
            _vm._v(_vm._s(_vm.day.toLocaleString("default", { weekday: "long" })))
          ]),
          _vm._v(" "),
          _c("span", { staticClass: "daynum" }, [
            _vm._v(_vm._s(_vm.day.getDate()))
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cal-column-body" }, [
          _c(
            "div",
            { staticClass: "cal-column-body-slotgrid" },
            _vm._l(24, function(n) {
              return _c(
                "div",
                { key: "" + n, staticClass: "cal-column-body-slotgrid--lines" },
                [_vm._v("\n        " + _vm._s(n) + ":00\n      ")]
              )
            }),
            0
          ),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "cal-column-body-eventgrid" },
            [
              new Date().getDay() === _vm.day.getDay()
                ? _c("div", {
                    staticClass: "index",
                    style: { top: _vm.scrollPercent + "%" }
                  })
                : _vm._e(),
              _vm._v(" "),
              _vm._l(_vm.positioning, function(e, index) {
                return _c("calendar-event", { key: index, attrs: { data: e } })
              })
            ],
            2
          )
        ])
      ]
    )
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    var __vue_inject_styles__$1 = function (inject) {
      if (!inject) { return }
      inject("data-v-f6aac418_0", { source: ".cal-column[data-v-f6aac418] {\n  height: inherit;\n  z-index: 3;\n}\n.cal-column.border-left[data-v-f6aac418] {\n  border-left: 1px solid rgba(0, 0, 0, 0.1);\n}\n.cal-column .cal-column-header[data-v-f6aac418] {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  padding: 10px;\n  background-color: #f0f0f0;\n  color: black;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  position: sticky;\n  position: -webkit-sticky;\n  top: 0;\n  z-index: 200;\n}\n.cal-column .cal-column-header .dayname[data-v-f6aac418] {\n  font-size: 16px;\n  text-transform: uppercase;\n}\n.cal-column .cal-column-header .daynum[data-v-f6aac418] {\n  font-size: 20px;\n}\n.cal-column .cal-column-body[data-v-f6aac418] {\n  position: relative;\n  height: 100%;\n}\n.cal-column .cal-column-body .cal-column-body-slotgrid[data-v-f6aac418],\n.cal-column .cal-column-body .cal-column-body-eventgrid[data-v-f6aac418],\n.cal-column .cal-column-body .cal-column-body-editgrid[data-v-f6aac418] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 100%;\n}\n.cal-column .cal-column-body .cal-column-body-eventgrid[data-v-f6aac418] {\n  right: 15px;\n}\n.cal-column .cal-column-body .cal-column-body-eventgrid .index[data-v-f6aac418] {\n  position: absolute;\n  background-color: rgba(255, 0, 0, 0.5);\n  left: 0px;\n  right: -5px;\n  height: 10px;\n  z-index: 10;\n  border-radius: 2px;\n}\n.cal-column .cal-column-body .cal-column-body-slotgrid[data-v-f6aac418] {\n  display: grid;\n  grid-template-rows: repeat(24, 1fr);\n  z-index: 1;\n}\n.cal-column .cal-column-body .cal-column-body-slotgrid .cal-column-body-slotgrid--lines[data-v-f6aac418] {\n  color: rgba(200, 200, 200, 0.9);\n  padding: 0 2px;\n  text-align: right;\n  font-size: 14px;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  user-select: none;\n}\n.cal-column .cal-column-body .cal-column-body-slotgrid .cal-column-body-slotgrid--lines[data-v-f6aac418]:not(:first-child) {\n  border-top: 1px solid rgba(170, 170, 170, 0.2);\n}\n\n/*# sourceMappingURL=CalendarColumn.vue.map */", map: {"version":3,"sources":["/Users/nguyenminhduc/dev/vue-google-calendar/src/calendar/CalendarColumn.vue","CalendarColumn.vue"],"names":[],"mappings":"AAyHA;EACA,eAAA;EACA,UAAA;ACxHA;AD0HA;EACA,yCAAA;ACxHA;AD2HA;EACA,2CAAA;EACA,aAAA;EACA,yBAAA;EACA,YAAA;EACA,aAAA;EACA,mBAAA;EACA,8BAAA;EAEA,gBAAA;EACA,wBAAA;EACA,MAAA;EACA,YAAA;AC1HA;AD4HA;EACA,eAAA;EACA,yBAAA;AC1HA;AD4HA;EACA,eAAA;AC1HA;AD8HA;EACA,kBAAA;EACA,YAAA;AC5HA;AD8HA;;;EAGA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,YAAA;AC5HA;AD+HA;EACA,WAAA;AC7HA;AD+HA;EACA,kBAAA;EACA,sCAAA;EACA,SAAA;EACA,WAAA;EACA,YAAA;EACA,WAAA;EACA,kBAAA;AC7HA;ADiIA;EACA,aAAA;EACA,mCAAA;EACA,UAAA;AC/HA;ADiIA;EACA,+BAAA;EACA,cAAA;EACA,iBAAA;EACA,eAAA;EACA,aAAA;EACA,sBAAA;EACA,yBAAA;EACA,iBAAA;AC/HA;ADiIA;EACA,8CAAA;AC/HA;;AAEA,6CAA6C","file":"CalendarColumn.vue","sourcesContent":["<template>\n  <div class=\"cal-column\" :class=\"{ selected: active }\">\n    <div class=\"cal-column-header\">\n      <span class=\"dayname\">{{\n        day.toLocaleString(\"default\", { weekday: \"long\" })\n      }}</span>\n      <span class=\"daynum\">{{ day.getDate() }}</span>\n    </div>\n\n    <div class=\"cal-column-body\">\n      <div class=\"cal-column-body-slotgrid\">\n        <div\n          class=\"cal-column-body-slotgrid--lines\"\n          v-for=\"n in 24\"\n          :key=\"`${n}`\"\n        >\n          {{ n }}:00\n        </div>\n      </div>\n      <div class=\"cal-column-body-eventgrid\">\n        <div\n          class=\"index\"\n          v-if=\"new Date().getDay() === day.getDay()\"\n          :style=\"{ top: scrollPercent + '%' }\"\n        ></div>\n\n        <calendar-event\n          v-for=\"(e, index) in positioning\"\n          :key=\"index\"\n          :data=\"e\"\n        ></calendar-event>\n      </div>\n    </div>\n  </div>\n</template>\n\n<script>\nimport CalendarEvent from \"./CalendarEvent.vue\"\n\nimport * as fn from \"../utils/functions\"\n\nexport default {\n  name: \"calendarcolumn\",\n  components: {\n    CalendarEvent\n  },\n  props: {\n    precision: Number,\n    day: Date,\n    data: Array\n  },\n  data() {\n    return {\n      scrollPercent: 0,\n      editing: false,\n      active: false\n    }\n  },\n\n  created() {\n    let now = new Date()\n    let minutes = now.getMinutes() + now.getHours() * 60\n\n    this.scrollPercent = ((minutes - 0) / (60 * 24 - 0)) * (100 - 0) + 0\n  },\n  computed: {\n    positioning() {\n      if (!this.data) return []\n      return [...this.data]\n        .sort((a, b) =>\n          fn.isSame(a.grid.start, b.grid.start)\n            ? b.grid.dur - a.grid.dur\n            : fn.diffMinutes(a.grid.start, b.grid.start)\n        )\n        .map(item => {\n          let block = this.data.filter(\n            i =>\n              fn.isBefore(i.grid.start, item.grid.start) &&\n              fn.isAfter(i.grid.end, item.grid.start)\n          )\n          if (block.length == 0) {\n            item.grid[\"indent\"] = 0\n          } else {\n            let maxindent = 1\n\n            block.forEach(i => {\n              if (i.grid.indent)\n                if (i.grid.indent >= maxindent) maxindent = i.grid.indent + 1\n            })\n\n            item.grid[\"indent\"] = maxindent\n          }\n\n          let same = this.data.filter(i =>\n            fn.isSame(i.grid.start, item.grid.start)\n          )\n\n          if (same.length <= 1) {\n            item.grid[\"index\"] = null\n            item.grid[\"indexOf\"] = null\n          } else {\n            let index = 1\n\n            same.forEach(i => {\n              if (i.grid.index) {\n                if (i.grid.index == index) index++\n              }\n            })\n\n            item.grid[\"index\"] = index\n            item.grid[\"indexOf\"] = same.length\n          }\n\n          return item\n        })\n    }\n  }\n}\n</script>\n\n<style scoped lang=\"scss\">\n.cal-column {\n  height: inherit;\n  z-index: 3;\n\n  &.border-left {\n    border-left: 1px solid rgba(0, 0, 0, 0.1);\n  }\n\n  .cal-column-header {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n    padding: 10px;\n    background-color: rgba(240, 240, 240, 1);\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n\n    position: sticky;\n    position: -webkit-sticky;\n    top: 0;\n    z-index: 200;\n\n    .dayname {\n      font-size: 16px;\n      text-transform: uppercase;\n    }\n    .daynum {\n      font-size: 20px;\n    }\n  }\n\n  .cal-column-body {\n    position: relative;\n    height: 100%;\n\n    .cal-column-body-slotgrid,\n    .cal-column-body-eventgrid,\n    .cal-column-body-editgrid {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      height: 100%;\n    }\n\n    .cal-column-body-eventgrid {\n      right: 15px;\n\n      .index {\n        position: absolute;\n        background-color: rgba(255, 0, 0, 0.5);\n        left: 0px;\n        right: -5px;\n        height: 10px;\n        z-index: 10;\n        border-radius: 2px;\n      }\n    }\n\n    .cal-column-body-slotgrid {\n      display: grid;\n      grid-template-rows: repeat(24, 1fr);\n      z-index: 1;\n\n      .cal-column-body-slotgrid--lines {\n        color: rgba(200, 200, 200, 0.9);\n        padding: 0 2px;\n        text-align: right;\n        font-size: 14px;\n        display: flex;\n        flex-direction: column;\n        justify-content: flex-end;\n        user-select: none;\n\n        &:not(:first-child) {\n          border-top: 1px solid rgba(170, 170, 170, 0.2);\n        }\n      }\n    }\n  }\n}\n</style>\n",".cal-column {\n  height: inherit;\n  z-index: 3;\n}\n.cal-column.border-left {\n  border-left: 1px solid rgba(0, 0, 0, 0.1);\n}\n.cal-column .cal-column-header {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  padding: 10px;\n  background-color: #f0f0f0;\n  color: black;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  position: sticky;\n  position: -webkit-sticky;\n  top: 0;\n  z-index: 200;\n}\n.cal-column .cal-column-header .dayname {\n  font-size: 16px;\n  text-transform: uppercase;\n}\n.cal-column .cal-column-header .daynum {\n  font-size: 20px;\n}\n.cal-column .cal-column-body {\n  position: relative;\n  height: 100%;\n}\n.cal-column .cal-column-body .cal-column-body-slotgrid,\n.cal-column .cal-column-body .cal-column-body-eventgrid,\n.cal-column .cal-column-body .cal-column-body-editgrid {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 100%;\n}\n.cal-column .cal-column-body .cal-column-body-eventgrid {\n  right: 15px;\n}\n.cal-column .cal-column-body .cal-column-body-eventgrid .index {\n  position: absolute;\n  background-color: rgba(255, 0, 0, 0.5);\n  left: 0px;\n  right: -5px;\n  height: 10px;\n  z-index: 10;\n  border-radius: 2px;\n}\n.cal-column .cal-column-body .cal-column-body-slotgrid {\n  display: grid;\n  grid-template-rows: repeat(24, 1fr);\n  z-index: 1;\n}\n.cal-column .cal-column-body .cal-column-body-slotgrid .cal-column-body-slotgrid--lines {\n  color: rgba(200, 200, 200, 0.9);\n  padding: 0 2px;\n  text-align: right;\n  font-size: 14px;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  user-select: none;\n}\n.cal-column .cal-column-body .cal-column-body-slotgrid .cal-column-body-slotgrid--lines:not(:first-child) {\n  border-top: 1px solid rgba(170, 170, 170, 0.2);\n}\n\n/*# sourceMappingURL=CalendarColumn.vue.map */"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__$1 = "data-v-f6aac418";
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      createInjector,
      undefined,
      undefined
    );

  //

  var script$2 = {
    name: "calendar",
    components: { CalendarColumn: __vue_component__$1 },
    props: {
      precision: { type: Number, default: 30 },

      data: Array,
      selected: { type: Date, default: function () { return new Date(); } }
    },

    mounted: function mounted() {
      var now = new Date();
      var minutes = now.getMinutes() + now.getHours() * 60;

      var scrollPercent = ((minutes - 0) / (60 * 24 - 0)) * (100 - 0) + 0;
      this.$refs.cal.scrollTop =
        (scrollPercent / 100) * this.$refs.cal.scrollHeight -
        this.$refs.cal.clientHeight / 2;
    },

    computed: {
      days: function days() {
        var result = [];

        for (var i = 0; i < 7; i++) {
          result.push(addDays(getMonday(new Date()), i));
        }
        return result
      },
      concatenatedData: function concatenatedData() {
        var this$1 = this;

        var roundTime = function (t) {
          var m = t.getMinutes();
          var h = t.getHours();

          var i = 1;
          var ceil = 0;
          while (this$1.precision * i < 60) {
            ceil = this$1.precision * i;
            i++;
          }

          if (m > ceil) { h++; }
          m =
            ((((m + this$1.precision / 2) / this$1.precision) | 0) * this$1.precision) %
            60;

          t.setHours(h);
          t.setMinutes(m);
          t.setSeconds(0);
          t.setMilliseconds(0);
          return t
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

        if (this.data)
          { this.data.forEach(function (person) { return person.dates.forEach(function (date) {
              var start = new Date(date.start.date || date.start.dateTime);
              var end = new Date(date.end.date || date.end.dateTime);
              var weekday = new Date(start)
                .toLocaleString("default", { weekday: "short" })
                .toLowerCase();

              var e = {
                id: date.id,
                color: person.color,

                owner: person,
                e: date,

                grid: {
                  start: roundTime(start),
                  end:
                    start.getTime() != end.getTime()
                      ? roundTime(end)
                      : roundTime(
                          end.setMinutes(end.getMinutes(), this$1.precision)
                        ),
                  dur:
                    start.getTime() != end.getTime()
                      ? Math.round(diffMinutes(end, start) / this$1.precision)
                      : Math.round(
                          (diffMinutes(end, start) + this$1.precision) /
                            this$1.precision
                        )
                }
              };

              var multievent = [];
              if (date.attendees)
                { this$1.data.forEach(function (p) { return p.dates.forEach(function (i) {
                    if (date.attendees)
                      { if (i.id === date.id) {
                        multievent.push(p.color);
                      } }
                  }); }
                ); }
              if (multievent.length > 1) {
                var existAlready = tmp[weekday].find(function (t) { return t.id == date.id; });
                if (!existAlready) {
                  e.color = multievent;
                  tmp[weekday].push(e);
                }
              } else { tmp[weekday].push(e); }
            }); }
          ); }

        return tmp
      }
    }
  };

  /* script */
  var __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "cal-wrapper" }, [
      _c(
        "div",
        { ref: "cal", staticClass: "cal" },
        _vm._l(_vm.concatenatedData, function(value, name, index) {
          return _c("calendar-column", {
            key: name,
            attrs: { data: value, day: _vm.days[index], precision: _vm.precision }
          })
        }),
        1
      )
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    var __vue_inject_styles__$2 = function (inject) {
      if (!inject) { return }
      inject("data-v-5e6a8eab_0", { source: ".cal-wrapper[data-v-5e6a8eab] {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  border: 0.1px solid rgba(164, 164, 164, 0.25);\n  box-shadow: 0 0 25px 5px rgba(135, 137, 182, 0.2);\n  border-radius: 10px;\n  overflow: hidden;\n}\n.cal-wrapper *[data-v-5e6a8eab] {\n  font-weight: lighter;\n  color: #606060;\n}\n.cal-wrapper .cal[data-v-5e6a8eab] {\n  overflow-y: scroll;\n  background-color: white;\n  height: 100%;\n  user-select: none;\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  grid-template-rows: 300%;\n}\n\n/*# sourceMappingURL=Calendar.vue.map */", map: {"version":3,"sources":["/Users/nguyenminhduc/dev/vue-google-calendar/src/calendar/Calendar.vue","Calendar.vue"],"names":[],"mappings":"AA+IA;EACA,YAAA;EACA,WAAA;EACA,kBAAA;EACA,6CAAA;EACA,iDAAA;EACA,mBAAA;EACA,gBAAA;AC9IA;ADgJA;EACA,oBAAA;EACA,cAAA;AC9IA;ADiJA;EACA,kBAAA;EACA,uBAAA;EAEA,YAAA;EACA,iBAAA;EAEA,aAAA;EACA,qCAAA;EACA,wBAAA;ACjJA;;AAEA,uCAAuC","file":"Calendar.vue","sourcesContent":["<template>\n  <div class=\"cal-wrapper\">\n    <div class=\"cal\" ref=\"cal\">\n      <calendar-column\n        v-for=\"(value, name, index) in concatenatedData\"\n        :key=\"name\"\n        :data=\"value\"\n        :day=\"days[index]\"\n        :precision=\"precision\"\n      ></calendar-column>\n    </div>\n  </div>\n</template>\n\n<script>\nimport CalendarColumn from \"./CalendarColumn.vue\"\n\nimport * as fn from \"../utils/functions\"\n\nexport default {\n  name: \"calendar\",\n  components: { CalendarColumn },\n  props: {\n    precision: { type: Number, default: 30 },\n\n    data: Array,\n    selected: { type: Date, default: () => new Date() }\n  },\n\n  mounted() {\n    let now = new Date()\n    let minutes = now.getMinutes() + now.getHours() * 60\n\n    let scrollPercent = ((minutes - 0) / (60 * 24 - 0)) * (100 - 0) + 0\n    this.$refs.cal.scrollTop =\n      (scrollPercent / 100) * this.$refs.cal.scrollHeight -\n      this.$refs.cal.clientHeight / 2\n  },\n\n  computed: {\n    days() {\n      let result = []\n\n      for (var i = 0; i < 7; i++) {\n        result.push(fn.addDays(fn.getMonday(new Date()), i))\n      }\n      return result\n    },\n    concatenatedData() {\n      const roundTime = t => {\n        let m = t.getMinutes()\n        let h = t.getHours()\n\n        let i = 1\n        let ceil = 0\n        while (this.precision * i < 60) {\n          ceil = this.precision * i\n          i++\n        }\n\n        if (m > ceil) h++\n        m =\n          ((((m + this.precision / 2) / this.precision) | 0) * this.precision) %\n          60\n\n        t.setHours(h)\n        t.setMinutes(m)\n        t.setSeconds(0)\n        t.setMilliseconds(0)\n        return t\n      }\n\n      let tmp = {\n        mon: [],\n        tue: [],\n        wed: [],\n        thu: [],\n        fri: [],\n        sat: [],\n        sun: []\n      }\n\n      if (this.data)\n        this.data.forEach(person =>\n          person.dates.forEach(date => {\n            let start = new Date(date.start.date || date.start.dateTime)\n            let end = new Date(date.end.date || date.end.dateTime)\n            let weekday = new Date(start)\n              .toLocaleString(\"default\", { weekday: \"short\" })\n              .toLowerCase()\n\n            let e = {\n              id: date.id,\n              color: person.color,\n\n              owner: person,\n              e: date,\n\n              grid: {\n                start: roundTime(start),\n                end:\n                  start.getTime() != end.getTime()\n                    ? roundTime(end)\n                    : roundTime(\n                        end.setMinutes(end.getMinutes(), this.precision)\n                      ),\n                dur:\n                  start.getTime() != end.getTime()\n                    ? Math.round(fn.diffMinutes(end, start) / this.precision)\n                    : Math.round(\n                        (fn.diffMinutes(end, start) + this.precision) /\n                          this.precision\n                      )\n              }\n            }\n\n            let multievent = []\n            if (date.attendees)\n              this.data.forEach(p =>\n                p.dates.forEach(i => {\n                  if (date.attendees)\n                    if (i.id === date.id) {\n                      multievent.push(p.color)\n                    }\n                })\n              )\n            if (multievent.length > 1) {\n              let existAlready = tmp[weekday].find(t => t.id == date.id)\n              if (!existAlready) {\n                e.color = multievent\n                tmp[weekday].push(e)\n              }\n            } else tmp[weekday].push(e)\n          })\n        )\n\n      return tmp\n    }\n  }\n}\n</script>\n\n<style scoped lang=\"scss\">\n.cal-wrapper {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  border: 0.1px solid rgba(164, 164, 164, 0.25);\n  box-shadow: 0 0 25px 5px rgba(135, 137, 182, 0.2);\n  border-radius: 10px;\n  overflow: hidden;\n\n  * {\n    font-weight: lighter;\n    color: rgb(96, 96, 96);\n  }\n\n  .cal {\n    overflow-y: scroll;\n    background-color: white;\n\n    height: 100%;\n    user-select: none;\n\n    display: grid;\n    grid-template-columns: repeat(7, 1fr);\n    grid-template-rows: 300%;\n  }\n}\n</style>\n",".cal-wrapper {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  border: 0.1px solid rgba(164, 164, 164, 0.25);\n  box-shadow: 0 0 25px 5px rgba(135, 137, 182, 0.2);\n  border-radius: 10px;\n  overflow: hidden;\n}\n.cal-wrapper * {\n  font-weight: lighter;\n  color: #606060;\n}\n.cal-wrapper .cal {\n  overflow-y: scroll;\n  background-color: white;\n  height: 100%;\n  user-select: none;\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  grid-template-rows: 300%;\n}\n\n/*# sourceMappingURL=Calendar.vue.map */"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__$2 = "data-v-5e6a8eab";
    /* module identifier */
    var __vue_module_identifier__$2 = undefined;
    /* functional template */
    var __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      createInjector,
      undefined,
      undefined
    );

  // Declare install function executed by Vue.use()
  function install(Vue) {
    if (install.installed) { return }
    install.installed = true;
    Vue.component("vue-google-calendar", __vue_component__$2);
  }

  // Create module definition for Vue.use()
  var plugin = {
    install: install
  };

  // Auto-install when vue is found (eg. in browser via <script> tag)
  var GlobalVue = null;
  if (typeof window !== "undefined") {
    GlobalVue = window.Vue;
  } else if (typeof global !== "undefined") {
    GlobalVue = global.Vue;
  }
  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  exports.default = __vue_component__$2;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
