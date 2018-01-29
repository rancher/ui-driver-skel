/* v----- Do not change anything between here
 *       (the DRIVERNAME placeholder will be automatically replaced during build) */
define('ui/components/machine/driver-hetzner/component', ['exports', 'ember', 'ui/mixins/driver'], function (exports, _ember, _uiMixinsDriver) {

  exports['default'] = _ember['default'].Component.extend(_uiMixinsDriver['default'], {
    driverName: 'hetzner',
    needAPIToken: true,

    bootstrap: function () {
      let config = this.get('store').createRecord({
        type: 'hetznerConfig',
        apiToken: '',
        serverType: 'cx21', // 4 GB Ram
        serverLocation: 'fsn1', // Nuremberg
        image: 'ubuntu-16.04'
      });

      let type = 'host';

      if (!this.get('useHost')) {
        type = 'machine';
      }

      this.set('model', this.get('store').createRecord({
        type: type,
        'hetznerConfig': config,
      }));
    },

    validate() {
      // Get generic API validation errors
      this._super();
      var errors = this.get('errors') || [];

      let apiToken = this.get('model.hetznerConfig.apiToken') || '';
      if (apiToken && apiToken.length !== 64) {
        errors.push("That doesn't look like a valid access token");
      }
      if (errors.get('length')) {
        this.set('errors', errors);
        return false;
      }

      return true;
    },

    actions: {
      getData() {
        this.set('gettingData', true);
        let that = this;
        Promise.all([this.apiRequest('/v1/locations'), this.apiRequest('/v1/images'), this.apiRequest('/v1/server_types')]).then(function (responses) {
          that.setProperties({
            errors: [],
            needAPIToken: false,
            gettingData: false,
            regionChoices: responses[0].locations,
            imageChoices: responses[1].images,
            sizeChoices: responses[2].server_types
          });
        }).catch(function (err) {
          err.then(function (msg) {
            that.setProperties({
              errors: ['Error received from Hetzner Cloud: ' + msg.error.message],
              gettingData: false
            })
          })
        })
      },
    },

    apiRequest: function (path) {
      return fetch("https://api.hetzner.cloud" + path, {
        headers: {
          'Authorization': 'Bearer ' + this.get('model.hetznerConfig.apiToken'),
        },
      }).then(res => res.ok ? res.json() : Promise.reject(res.json()));
    }
  });
});
;
define("ui/components/machine/driver-hetzner/template",["exports","ember","ui/mixins/driver"],function(exports,_ember,_uiMixinsDriver){

exports["default"] = Ember.HTMLBars.template((function() {
  var child0 = (function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 10
            },
            "end": {
              "line": 20,
              "column": 10
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn bg-primary btn-disabled");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","icon icon-spinner icon-spin");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),2,2);
          return morphs;
        },
        statements: [
          ["inline","t",["generic.loading"],[],["loc",[null,[19,100],[19,123]]],0,0]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 10
            },
            "end": {
              "line": 22,
              "column": 10
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn bg-primary");
          var el2 = dom.createTextNode("Configure Server");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element8 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element8, 'disabled');
          morphs[1] = dom.createElementMorph(element8);
          return morphs;
        },
        statements: [
          ["attribute","disabled",["subexpr","not",[["get","model.hetznerConfig.apiToken",["loc",[null,[21,80],[21,108]]],0,0,0,0]],[],["loc",[null,[null,null],[21,110]]],0,0],0,0,0,0],
          ["element","action",["getData"],[],["loc",[null,[21,20],[21,41]]],0,0]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 2,
            "column": 2
          },
          "end": {
            "line": 26,
            "column": 5
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("    ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("form");
        var el2 = dom.createTextNode("\n      ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","over-hr r-mb20");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        var el4 = dom.createTextNode("Account Access");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row form-group");
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-2");
        var el4 = dom.createTextNode("\n              ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","form-control-static");
        var el5 = dom.createTextNode("Access Token*");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-10");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        dom.setAttribute(el4,"class","help-block");
        var el5 = dom.createTextNode("Personal Access Token from one of your Hetzner Cloud Projects.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","footer-actions");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"class","btn bg-transparent");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n      ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element9 = dom.childAt(fragment, [1]);
        var element10 = dom.childAt(element9, [7]);
        var element11 = dom.childAt(element10, [3]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element9, [3, 3]),1,1);
        morphs[1] = dom.createMorphAt(element9,5,5);
        morphs[2] = dom.createMorphAt(element10,1,1);
        morphs[3] = dom.createElementMorph(element11);
        morphs[4] = dom.createMorphAt(element11,0,0);
        return morphs;
      },
      statements: [
        ["inline","input",[],["type","password","value",["subexpr","@mut",[["get","model.hetznerConfig.apiToken",["loc",[null,[12,42],[12,70]]],0,0,0,0]],[],[],0,0],"classNames","form-control","placeholder","Your Hetzner Cloud API access token"],["loc",[null,[12,12],[12,148]]],0,0],
        ["inline","top-errors",[],["errors",["subexpr","@mut",[["get","errors",["loc",[null,[16,28],[16,34]]],0,0,0,0]],[],[],0,0]],["loc",[null,[16,8],[16,36]]],0,0],
        ["block","if",[["get","gettingData",["loc",[null,[18,16],[18,27]]],0,0,0,0]],[],0,1,["loc",[null,[18,10],[22,17]]]],
        ["element","action",["cancel"],[],["loc",[null,[23,18],[23,37]]],0,0],
        ["inline","t",["generic.cancel"],[],["loc",[null,[23,65],[23,87]]],0,0]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }());
  var child1 = (function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 39,
              "column": 16
            },
            "end": {
              "line": 41,
              "column": 16
            }
          }
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element2, 'value');
          morphs[1] = dom.createAttrMorph(element2, 'selected');
          morphs[2] = dom.createMorphAt(element2,0,0);
          return morphs;
        },
        statements: [
          ["attribute","value",["get","choice.name",["loc",[null,[40,34],[40,45]]],0,0,0,0],0,0,0,0],
          ["attribute","selected",["subexpr","eq",[["get","model.hetznerConfig.serverLocation",["loc",[null,[40,62],[40,96]]],0,0,0,0],["get","choice.name",["loc",[null,[40,97],[40,108]]],0,0,0,0]],[],["loc",[null,[null,null],[40,110]]],0,0],0,0,0,0],
          ["content","choice.city",["loc",[null,[40,111],[40,126]]],0,0,0,0]
        ],
        locals: ["choice"],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 54,
              "column": 14
            },
            "end": {
              "line": 56,
              "column": 14
            }
          }
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element1, 'value');
          morphs[1] = dom.createAttrMorph(element1, 'selected');
          morphs[2] = dom.createMorphAt(element1,0,0);
          return morphs;
        },
        statements: [
          ["attribute","value",["get","choice.name",["loc",[null,[55,32],[55,43]]],0,0,0,0],0,0,0,0],
          ["attribute","selected",["subexpr","eq",[["get","model.hetznerConfig.image",["loc",[null,[55,60],[55,85]]],0,0,0,0],["get","choice.name",["loc",[null,[55,86],[55,97]]],0,0,0,0]],[],["loc",[null,[null,null],[55,99]]],0,0],0,0,0,0],
          ["content","choice.description",["loc",[null,[55,100],[55,122]]],0,0,0,0]
        ],
        locals: ["choice"],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 64,
              "column": 12
            },
            "end": {
              "line": 66,
              "column": 12
            }
          }
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" - ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("GB Memory - ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("GB Disk space");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(5);
          morphs[0] = dom.createAttrMorph(element0, 'value');
          morphs[1] = dom.createAttrMorph(element0, 'selected');
          morphs[2] = dom.createMorphAt(element0,0,0);
          morphs[3] = dom.createMorphAt(element0,2,2);
          morphs[4] = dom.createMorphAt(element0,4,4);
          return morphs;
        },
        statements: [
          ["attribute","value",["get","choice.name",["loc",[null,[65,30],[65,41]]],0,0,0,0],0,0,0,0],
          ["attribute","selected",["subexpr","eq",[["get","model.hetznerConfig.serverType",["loc",[null,[65,58],[65,88]]],0,0,0,0],["get","choice.name",["loc",[null,[65,89],[65,100]]],0,0,0,0]],[],["loc",[null,[null,null],[65,102]]],0,0],0,0,0,0],
          ["content","choice.description",["loc",[null,[65,103],[65,125]]],0,0,0,0],
          ["content","choice.memory",["loc",[null,[65,128],[65,145]]],0,0,0,0],
          ["content","choice.disk",["loc",[null,[65,157],[65,172]]],0,0,0,0]
        ],
        locals: ["choice"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 26,
            "column": 5
          },
          "end": {
            "line": 79,
            "column": 2
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("     ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container-fluid");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("      ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","over-hr r-mt20 r-mb20");
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        var el4 = dom.createTextNode("Region");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row form-group");
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-2");
        var el4 = dom.createTextNode("\n              ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","form-control-static");
        var el5 = dom.createTextNode("Region");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-10");
        var el4 = dom.createTextNode("       \n              ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("select");
        dom.setAttribute(el4,"class","form-control");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("   \n          ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","over-hr r-mt20 r-mb20");
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        var el4 = dom.createTextNode("Settings");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row form-group");
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-2");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","form-control-static");
        var el5 = dom.createTextNode("Image");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-4");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("select");
        dom.setAttribute(el4,"class","form-control");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-2");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","form-control-static");
        var el5 = dom.createTextNode("Size");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-4");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("select");
        dom.setAttribute(el4,"class","form-control");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("          ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [1]);
        var element4 = dom.childAt(element3, [6, 3, 1]);
        var element5 = dom.childAt(element3, [10]);
        var element6 = dom.childAt(element5, [3, 1]);
        var element7 = dom.childAt(element5, [7, 1]);
        var morphs = new Array(10);
        morphs[0] = dom.createMorphAt(element3,2,2);
        morphs[1] = dom.createAttrMorph(element4, 'onchange');
        morphs[2] = dom.createMorphAt(element4,1,1);
        morphs[3] = dom.createAttrMorph(element6, 'onchange');
        morphs[4] = dom.createMorphAt(element6,1,1);
        morphs[5] = dom.createAttrMorph(element7, 'onchange');
        morphs[6] = dom.createMorphAt(element7,1,1);
        morphs[7] = dom.createMorphAt(element3,13,13);
        morphs[8] = dom.createMorphAt(element3,16,16);
        morphs[9] = dom.createMorphAt(element3,19,19);
        return morphs;
      },
      statements: [
        ["inline","partial",["host/add-common"],[],["loc",[null,[29,6],[29,35]]],0,0],
        ["attribute","onchange",["subexpr","action",[["subexpr","mut",[["get","model.hetznerConfig.serverLocation",["loc",[null,[38,66],[38,100]]],0,0,0,0]],[],["loc",[null,[38,61],[38,101]]],0,0]],["value","target.value"],["loc",[null,[null,null],[38,124]]],0,0],0,0,0,0],
        ["block","each",[["get","regionChoices",["loc",[null,[39,24],[39,37]]],0,0,0,0]],[],0,null,["loc",[null,[39,16],[41,25]]]],
        ["attribute","onchange",["subexpr","action",[["subexpr","mut",[["get","model.hetznerConfig.image",["loc",[null,[53,64],[53,89]]],0,0,0,0]],[],["loc",[null,[53,59],[53,90]]],0,0]],["value","target.value"],["loc",[null,[null,null],[53,113]]],0,0],0,0,0,0],
        ["block","each",[["get","imageChoices",["loc",[null,[54,22],[54,34]]],0,0,0,0]],[],1,null,["loc",[null,[54,14],[56,23]]]],
        ["attribute","onchange",["subexpr","action",[["subexpr","mut",[["get","model.hetznerConfig.serverType",["loc",[null,[63,64],[63,94]]],0,0,0,0]],[],["loc",[null,[63,59],[63,95]]],0,0]],["value","target.value"],["loc",[null,[null,null],[63,118]]],0,0],0,0,0,0],
        ["block","each",[["get","sizeChoices",["loc",[null,[64,20],[64,31]]],0,0,0,0]],[],2,null,["loc",[null,[64,12],[66,21]]]],
        ["inline","partial",["host/add-options"],[],["loc",[null,[71,4],[71,34]]],0,0],
        ["inline","top-errors",[],["errors",["subexpr","@mut",[["get","errors",["loc",[null,[74,24],[74,30]]],0,0,0,0]],[],[],0,0]],["loc",[null,[74,4],[74,32]]],0,0],
        ["inline","save-cancel",[],["save","save","cancel","cancel"],["loc",[null,[77,4],[77,47]]],0,0]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }());
  return {
    meta: {
      "revision": "Ember@2.9.1",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 81,
          "column": 0
        }
      }
    },
    isEmpty: false,
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("section");
      dom.setAttribute(el1,"class","horizontal-form");
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var morphs = new Array(1);
      morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
      return morphs;
    },
    statements: [
      ["block","if",[["get","needAPIToken",["loc",[null,[2,8],[2,20]]],0,0,0,0]],[],0,1,["loc",[null,[2,2],[79,9]]]]
    ],
    locals: [],
    templates: [child0, child1]
  };
}()));;

});
