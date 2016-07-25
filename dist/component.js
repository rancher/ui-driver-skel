define('ui/components/machine/driver-cloudstack/component', ['exports', 'ember', 'ui/mixins/driver'],
	function(exports, _ember, _uiMixinsDriver) {
		exports['default'] = _ember['default'].Component.extend(_uiMixinsDriver['default'], {
		driverName: 'cloudstack',

		// Write your component here, starting with setting 'model' to a machine with your config populated
		bootstrap: function() {
			let config = this.get("store").createRecord({
				type: 'cloudstackConfig',
				endpoint		 : 'https://myservices.interoute.com/myservices/api/vdc',
				apiKey: '',
				secretKey: '',
				zone: null,
                                region: null,
				template: null,
				serviceOffering: null,
				ssl: true,
			});

			this.set('model', this.get('store').createRecord({
				type: 'machine',
				'cloudstackConfig': config,
			}));
		},
                validate() {
      			this._super();
			var errors = this.get('errors')||[];

	      		if ( this.get('model.cloudstackConfig.apiKey').length == 0 )
		        {
		    		errors.push('API Key must be set');
		        }

		        if ( errors.get('length') )
		        {
		      		this.set('errors', errors);
			        return false;
		        }
		        else
		        {
			        this.set('errors', null);
		        	return true;
		        }
	        },
		actions: {
		    cloudAuth: function() {
		        this.set('step', 2);
		        this.apiRequest('listZones').then((res) => {
		            let zones = [];
		            res.listzonesresponse.zone.forEach((zone) => {
		                let obj = {
		                    id: zone.id,
		                    name: zone.name,
		                };
		                zones.push(obj);
		            });
		            this.set('avzones', zones);
		            this.set('step', 3);
		        }, (err) => {
		            let errors = this.get('errors') || [];
		            errors.pushObject(this.apiErrorMessage(err, '', '', 'Authentication failure'));
		            this.set('errors', errors);
		            this.set('step', 1);
		        });
		    },

			selectZone: function() {
			    this.set('step', 4);
			    this.apiRequest('listProjects').then((res) => {
			        let projects = [];
			        (res.listprojectsresponse.project || []).forEach((proj) => {
			            let obj = {
			                id: proj.id,
			                name: proj.name,
			            };
			            projects.push(obj);
			        });
			        this.set('projects', projects);
			        this.set('step', 5);

			    }, (err) => {
			        let errors = this.get('errors') || [];
			        errors.pushObject(this.apiErrorMessage(err, '', '', 'WARNING!'));
			        this.set('errors', errors);
			        this.set('step', 3);
			    });
			},

			setProject: function() {
				this.set('step', 6);
              // TO BE COMPLETED
				this.set('step', 7);
	  	}
	  },

		apiRequest: function(command, params) {
			let url					= this.get('app.proxyEndpoint') + '/' + this.get('model.cloudstackConfig.endpoint');
			params					= params || {};
			params.command	= command;
			params.apiKey		= this.get('model.cloudstackConfig.apiKey');
                        params.region	= this.get('model.cloudstackConfig.region');
			params.response = 'json';

			return this.ajaxPromise({url: url,
													method: 'POST',
													dataType: 'json',
													headers: {
														'Accept': 'application/json',
														'X-API-Headers-Restrict': 'Content-Length'
													},
													beforeSend: (xhr, settings) => {
														// Append 'rancher:' to Content-Type
														xhr.setRequestHeader('Content-Type',
																								 'rancher:' + settings.contentType);

														// Compute the signature
														let qs = settings.data.split('&')
																	.map((q) => q.replace(/\+/g, '%20'))
																	.map(Function.prototype.call, String.prototype.toLowerCase)
																	.sort()
																	.join('&');
														settings.data += '&signature=' + encodeURIComponent(AWS.util.crypto.hmac(
															this.get('model.cloudstackConfig.secretKey'), qs, 'base64', 'sha1'));
														return true;
													},
													data: params}, true);
		},

		ajaxPromise: function(opt, justBody) {
			var promise = new Ember.RSVP.Promise(function(resolve,reject) {
				Ember.$.ajax(opt).then(success,fail);
				function success(body, textStatus, xhr) {
					if ( justBody === true ){
						resolve(body, 'AJAX Response: '+ opt.url + '(' + xhr.status + ')');
					}
					else{
						resolve({xhr: xhr, textStatus: textStatus},'AJAX Response: '+ opt.url + '(' + xhr.status + ')');
				}}
				function fail(xhr, textStatus, err) {
					reject({xhr: xhr, textStatus: textStatus, err: err}, 'AJAX Error:' + opt.url + '(' + xhr.status + ')');
				}
			},'Raw AJAX Request: '+ opt.url);
			return promise;
		},

		apiErrorMessage: function(err, kind, prefix, def) {
			let answer = (err.xhr || {}).responseJSON || {};
			let text	 = (answer[kind] || {}).errortext;
			if (text) {
				return prefix + ": " + text;
			} else {
				return def;
			}
		},

		// Any computed properties or custom logic can go here
		step: 1,
		isStep1: Ember.computed.equal('step', 1),
		isStep2: Ember.computed.equal('step', 2),
		isStep3: Ember.computed.equal('step', 3),
		isStep4: Ember.computed.equal('step', 4),
		isStep5: Ember.computed.equal('step', 5),
		isStep6: Ember.computed.equal('step', 6),
		isStep7: Ember.computed.equal('step', 7),
		isGteStep3: Ember.computed.gte('step', 3),
		isGteStep4: Ember.computed.gte('step', 4),
		isGteStep5: Ember.computed.gte('step', 5),
		isGteStep6: Ember.computed.gte('step', 6),
		isGteStep7: Ember.computed.gte('step', 7),
	});
});
;
define("ui/components/machine/driver-cloudstack/template",["exports","ember","ui/mixins/driver"],function(exports,_ember,_uiMixinsDriver){

exports["default"] = Ember.HTMLBars.template((function() {
  var child0 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 12,
            "column": 5
          },
          "end": {
            "line": 12,
            "column": 145
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        return morphs;
      },
      statements: [
        ["inline","input",[],["type","text","value",["subexpr","@mut",[["get","model.cloudstackConfig.endpoint",["loc",[null,[12,47],[12,78]]]]],[],[]],"classNames","form-control","placeholder",["subexpr","@mut",[["get","cloudstackConfig.endpoint",["loc",[null,[12,117],[12,142]]]]],[],[]]],["loc",[null,[12,21],[12,144]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child1 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 12,
            "column": 145
          },
          "end": {
            "line": 16,
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
        var el1 = dom.createTextNode("\n					");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form-control-static");
        var el2 = dom.createTextNode("\n						");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n					");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        return morphs;
      },
      statements: [
        ["content","model.cloudstackConfig.endpoint",["loc",[null,[14,6],[14,41]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child2 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 24,
            "column": 5
          },
          "end": {
            "line": 24,
            "column": 158
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        return morphs;
      },
      statements: [
        ["inline","input",[],["type","text","autofocus","autofocus","value",["subexpr","@mut",[["get","model.cloudstackConfig.apiKey",["loc",[null,[24,69],[24,98]]]]],[],[]],"classNames","form-control","placeholder","Your VDC API Key"],["loc",[null,[24,21],[24,157]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child3 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 24,
            "column": 158
          },
          "end": {
            "line": 28,
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
        var el1 = dom.createTextNode("\n					");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form-control-static");
        var el2 = dom.createTextNode("\n						");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n					");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        return morphs;
      },
      statements: [
        ["content","model.cloudstackConfig.apiKey",["loc",[null,[26,6],[26,39]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child4 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 36,
            "column": 5
          },
          "end": {
            "line": 36,
            "column": 142
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        return morphs;
      },
      statements: [
        ["inline","input",[],["type","text","value",["subexpr","@mut",[["get","model.cloudstackConfig.secretKey",["loc",[null,[36,47],[36,79]]]]],[],[]],"classNames","form-control","placeholder","Your VDC Secret Key"],["loc",[null,[36,21],[36,141]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child5 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 36,
            "column": 142
          },
          "end": {
            "line": 40,
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
        var el1 = dom.createTextNode("\n					");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form-control-static");
        var el2 = dom.createTextNode("\n						**************************************************************************************\n					");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }());
  var child6 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 48,
            "column": 40
          },
          "end": {
            "line": 48,
            "column": 195
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        return morphs;
      },
      statements: [
        ["inline","input",[],["type","text","autofocus","autofocus","value",["subexpr","@mut",[["get","model.cloudstackConfig.region",["loc",[null,[48,104],[48,133]]]]],[],[]],"classNames","form-control","placeholder","Desired VDC Region"],["loc",[null,[48,56],[48,194]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child7 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 48,
            "column": 195
          },
          "end": {
            "line": 52,
            "column": 40
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n                                        ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form-control-static");
        var el2 = dom.createTextNode("\n                                                ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n                                        ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        return morphs;
      },
      statements: [
        ["content","model.cloudstackConfig.region",["loc",[null,[50,48],[50,81]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child8 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 57,
            "column": 1
          },
          "end": {
            "line": 61,
            "column": 1
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","footer-actions");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"name","submit");
        dom.setAttribute(el2,"class","btn btn-primary");
        var el3 = dom.createTextNode("Authenticate");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-link");
        var el3 = dom.createTextNode("Cancel");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element6 = dom.childAt(fragment, [3]);
        var element7 = dom.childAt(element6, [1]);
        var element8 = dom.childAt(element6, [3]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        morphs[1] = dom.createElementMorph(element7);
        morphs[2] = dom.createElementMorph(element8);
        return morphs;
      },
      statements: [
        ["inline","top-errors",[],["errors",["subexpr","@mut",[["get","errors",["loc",[null,[57,37],[57,43]]]]],[],[]]],["loc",[null,[57,17],[57,45]]]],
        ["element","action",["cloudAuth"],[],["loc",[null,[59,10],[59,32]]]],
        ["element","action",["cancel"],[],["loc",[null,[59,101],[59,120]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child9 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 82,
            "column": 8
          },
          "end": {
            "line": 82,
            "column": 160
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        return morphs;
      },
      statements: [
        ["inline","new-select",[],["classNames","form-control","content",["subexpr","@mut",[["get","avzones",["loc",[null,[82,71],[82,78]]]]],[],[]],"optionLabelPath","name","optionValuePath","id","value",["subexpr","@mut",[["get","model.cloudstackConfig.zone",["loc",[null,[82,129],[82,156]]]]],[],[]]],["loc",[null,[82,24],[82,159]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child10 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 82,
            "column": 160
          },
          "end": {
            "line": 86,
            "column": 8
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n        ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form-control-static");
        var el2 = dom.createTextNode("\n          ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        return morphs;
      },
      statements: [
        ["content","model.cloudstackConfig.zone",["loc",[null,[84,10],[84,41]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child11 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 90,
            "column": 1
          },
          "end": {
            "line": 94,
            "column": 1
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","footer-actions");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-primary");
        var el3 = dom.createTextNode("Continue");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-link");
        var el3 = dom.createTextNode("Cancel");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [3]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element3, [3]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        morphs[1] = dom.createElementMorph(element4);
        morphs[2] = dom.createElementMorph(element5);
        return morphs;
      },
      statements: [
        ["inline","top-errors",[],["errors",["subexpr","@mut",[["get","errors",["loc",[null,[90,37],[90,43]]]]],[],[]]],["loc",[null,[90,17],[90,45]]]],
        ["element","action",["selectZone"],[],["loc",[null,[92,10],[92,33]]]],
        ["element","action",["cancel"],[],["loc",[null,[92,84],[92,103]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  var child12 = (function() {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.6.2",
        "loc": {
          "source": null,
          "start": {
            "line": 119,
            "column": 1
          },
          "end": {
            "line": 123,
            "column": 1
          }
        }
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","footer-actions");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-primary");
        var el3 = dom.createTextNode("Continue");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-link");
        var el3 = dom.createTextNode("Cancel");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [3]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        morphs[1] = dom.createElementMorph(element1);
        morphs[2] = dom.createElementMorph(element2);
        return morphs;
      },
      statements: [
        ["inline","top-errors",[],["errors",["subexpr","@mut",[["get","errors",["loc",[null,[119,37],[119,43]]]]],[],[]]],["loc",[null,[119,17],[119,45]]]],
        ["element","action",["setProject"],[],["loc",[null,[121,10],[121,33]]]],
        ["element","action",["cancel"],[],["loc",[null,[121,84],[121,103]]]]
      ],
      locals: [],
      templates: []
    };
  }());
  return {
    meta: {
      "fragmentReason": {
        "name": "missing-wrapper",
        "problems": [
          "multiple-nodes",
          "wrong-type"
        ]
      },
      "revision": "Ember@2.6.2",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 143,
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
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("form");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","container-fluid");
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","over-hr r-mt20 r-mb20");
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("span");
      var el6 = dom.createTextNode("ACCOUNT ACCESS");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n			");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","col-sm-12 col-md-2 form-label");
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("label");
      dom.setAttribute(el6,"class","form-control-static");
      var el7 = dom.createTextNode("Endpoint");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n				");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","col-sm-12 col-md-4");
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createComment("");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("				");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n			");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","col-sm-12 col-md-2 form-label");
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("label");
      dom.setAttribute(el6,"class","form-control-static");
      var el7 = dom.createTextNode("API Key");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n				");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","col-sm-12 col-md-10");
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createComment("");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("				");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n			");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","col-sm-12 col-md-2 form-label");
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("label");
      dom.setAttribute(el6,"class","form-control-static");
      var el7 = dom.createTextNode("Secret Key");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n				");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","col-sm-12 col-md-10");
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createComment("");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("				");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n			");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n                        ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      var el5 = dom.createTextNode("\n                                ");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","col-sm-12 col-md-2 form-label");
      var el6 = dom.createTextNode("\n                                        ");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("label");
      dom.setAttribute(el6,"class","form-control-static");
      var el7 = dom.createTextNode("VDC Region");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n                                ");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n                                ");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","col-sm-12 col-md-10");
      var el6 = dom.createTextNode("\n                                        ");
      dom.appendChild(el5, el6);
      var el6 = dom.createComment("");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("                                ");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n                        ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n		");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createComment(" Step 2 ");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("section");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","text-center");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("i");
      dom.setAttribute(el3,"class","icon icon-spinner icon-spin");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("i");
      var el4 = dom.createTextNode("  Authenticating...");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createComment(" Step 3 ");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("section");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","container-fluid");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","over-hr r-mt20 r-mb20");
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("span");
      var el5 = dom.createTextNode("AVAILABILITY ZONE");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n		");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","col-sm-12 col-md-2 form-label");
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("label");
      dom.setAttribute(el5,"class","form-control-static");
      var el6 = dom.createTextNode("Availability Zone");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n			");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","col-sm-12 col-md-8");
      var el5 = dom.createTextNode("\n        ");
      dom.appendChild(el4, el5);
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("      ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n		");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createComment(" Step 4 ");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("section");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","text-center");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("i");
      dom.setAttribute(el3,"class","icon icon-spinner icon-spin");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("i");
      var el4 = dom.createTextNode("  Please wait...");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createComment(" Step 5 ");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("section");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","container-fluid");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","over-hr r-mt20 r-mb20");
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("span");
      var el5 = dom.createTextNode("PROJECT");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n		");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","col-sm-12 col-md-2 form-label");
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("label");
      dom.setAttribute(el5,"class","form-control-static");
      var el6 = dom.createTextNode("Project");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n			");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","col-sm-12 col-md-8");
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n			");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n		");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createComment(" Step 6 ");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("section");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","text-center");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("i");
      dom.setAttribute(el3,"class","icon icon-spinner icon-spin");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("i");
      var el4 = dom.createTextNode("  Please wait...");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createComment(" Step 7 ");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("section");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","container-fluid");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","over-hr r-mt20 r-mb20");
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("span");
      var el5 = dom.createTextNode("INSTANCE");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n		");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode(" ");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode(" ");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var element9 = dom.childAt(fragment, [0]);
      var element10 = dom.childAt(element9, [1, 1]);
      var element11 = dom.childAt(element10, [3]);
      var element12 = dom.childAt(element10, [5]);
      var element13 = dom.childAt(element10, [7]);
      var element14 = dom.childAt(element10, [9]);
      var element15 = dom.childAt(fragment, [4]);
      var element16 = dom.childAt(fragment, [8]);
      var element17 = dom.childAt(element16, [1, 3]);
      var element18 = dom.childAt(fragment, [12]);
      var element19 = dom.childAt(fragment, [16]);
      var element20 = dom.childAt(element19, [1, 3]);
      var element21 = dom.childAt(fragment, [20]);
      var element22 = dom.childAt(fragment, [24]);
      var element23 = dom.childAt(element22, [1]);
      var morphs = new Array(25);
      morphs[0] = dom.createAttrMorph(element11, 'class');
      morphs[1] = dom.createMorphAt(dom.childAt(element11, [3]),1,1);
      morphs[2] = dom.createAttrMorph(element12, 'class');
      morphs[3] = dom.createMorphAt(dom.childAt(element12, [3]),1,1);
      morphs[4] = dom.createAttrMorph(element13, 'class');
      morphs[5] = dom.createMorphAt(dom.childAt(element13, [3]),1,1);
      morphs[6] = dom.createAttrMorph(element14, 'class');
      morphs[7] = dom.createMorphAt(dom.childAt(element14, [3]),1,1);
      morphs[8] = dom.createMorphAt(element9,3,3);
      morphs[9] = dom.createAttrMorph(element15, 'class');
      morphs[10] = dom.createAttrMorph(element16, 'class');
      morphs[11] = dom.createAttrMorph(element17, 'class');
      morphs[12] = dom.createMorphAt(dom.childAt(element17, [3]),1,1);
      morphs[13] = dom.createMorphAt(element16,3,3);
      morphs[14] = dom.createAttrMorph(element18, 'class');
      morphs[15] = dom.createAttrMorph(element19, 'class');
      morphs[16] = dom.createAttrMorph(element20, 'class');
      morphs[17] = dom.createMorphAt(dom.childAt(element20, [3]),1,1);
      morphs[18] = dom.createMorphAt(element19,3,3);
      morphs[19] = dom.createAttrMorph(element21, 'class');
      morphs[20] = dom.createAttrMorph(element22, 'class');
      morphs[21] = dom.createMorphAt(element23,3,3);
      morphs[22] = dom.createMorphAt(element23,5,5);
      morphs[23] = dom.createMorphAt(element22,3,3);
      morphs[24] = dom.createMorphAt(element22,5,5);
      return morphs;
    },
    statements: [
      ["attribute","class",["concat",["row ",["subexpr","if",[["get","isStep1",["loc",[null,[7,24],[7,31]]]],"form-group"],[],["loc",[null,[7,19],[7,46]]]]]]],
      ["block","if",[["get","isStep1",["loc",[null,[12,11],[12,18]]]]],[],0,1,["loc",[null,[12,5],[16,12]]]],
      ["attribute","class",["concat",["row ",["subexpr","if",[["get","isStep1",["loc",[null,[19,24],[19,31]]]],"form-group"],[],["loc",[null,[19,19],[19,46]]]]]]],
      ["block","if",[["get","isStep1",["loc",[null,[24,11],[24,18]]]]],[],2,3,["loc",[null,[24,5],[28,12]]]],
      ["attribute","class",["concat",["row ",["subexpr","if",[["get","isStep1",["loc",[null,[31,24],[31,31]]]],"form-group"],[],["loc",[null,[31,19],[31,46]]]]]]],
      ["block","if",[["get","isStep1",["loc",[null,[36,11],[36,18]]]]],[],4,5,["loc",[null,[36,5],[40,12]]]],
      ["attribute","class",["concat",["row ",["subexpr","if",[["get","isStep1",["loc",[null,[43,45],[43,52]]]],"form-group"],[],["loc",[null,[43,40],[43,67]]]]]]],
      ["block","if",[["get","isStep1",["loc",[null,[48,46],[48,53]]]]],[],6,7,["loc",[null,[48,40],[52,47]]]],
      ["block","if",[["get","isStep1",["loc",[null,[57,7],[57,14]]]]],[],8,null,["loc",[null,[57,1],[61,8]]]],
      ["attribute","class",["concat",["horizontal-form r-pt0 ",["subexpr","unless",[["get","isStep2",["loc",[null,[65,47],[65,54]]]],"hide"],[],["loc",[null,[65,38],[65,63]]]]]]],
      ["attribute","class",["concat",["horizontal-form r-pt0 ",["subexpr","unless",[["get","isGteStep3",["loc",[null,[72,47],[72,57]]]],"hide"],[],["loc",[null,[72,38],[72,66]]]]]]],
      ["attribute","class",["concat",["row ",["subexpr","if",[["get","isStep3",["loc",[null,[77,23],[77,30]]]],"form-group"],[],["loc",[null,[77,18],[77,45]]]]]]],
      ["block","if",[["get","isStep3",["loc",[null,[82,14],[82,21]]]]],[],9,10,["loc",[null,[82,8],[86,15]]]],
      ["block","if",[["get","isStep3",["loc",[null,[90,7],[90,14]]]]],[],11,null,["loc",[null,[90,1],[94,8]]]],
      ["attribute","class",["concat",["horizontal-form r-pt0 ",["subexpr","unless",[["get","isStep4",["loc",[null,[98,47],[98,54]]]],"hide"],[],["loc",[null,[98,38],[98,63]]]]]]],
      ["attribute","class",["concat",["horizontal-form r-pt0 ",["subexpr","unless",[["get","isGteStep5",["loc",[null,[105,47],[105,57]]]],"hide"],[],["loc",[null,[105,38],[105,66]]]]]]],
      ["attribute","class",["concat",["row ",["subexpr","if",[["get","isStep5",["loc",[null,[110,23],[110,30]]]],"form-group"],[],["loc",[null,[110,18],[110,45]]]]]]],
      ["inline","new-select",[],["classNames","form-control","content",["subexpr","@mut",[["get","projects",["loc",[null,[115,51],[115,59]]]]],[],[]],"optionLabelPath","name","optionValuePath","id","value",["subexpr","@mut",[["get","model.cloudstackConfig.project",["loc",[null,[115,110],[115,140]]]]],[],[]]],["loc",[null,[115,4],[115,143]]]],
      ["block","if",[["get","isStep5",["loc",[null,[119,7],[119,14]]]]],[],12,null,["loc",[null,[119,1],[123,8]]]],
      ["attribute","class",["concat",["horizontal-form r-pt0 ",["subexpr","unless",[["get","isStep6",["loc",[null,[127,47],[127,54]]]],"hide"],[],["loc",[null,[127,38],[127,63]]]]]]],
      ["attribute","class",["concat",["horizontal-form r-pt0 ",["subexpr","unless",[["get","isGteStep7",["loc",[null,[134,47],[134,57]]]],"hide"],[],["loc",[null,[134,38],[134,66]]]]]]],
      ["inline","partial",["host/add-common"],[],["loc",[null,[139,2],[139,31]]]],
      ["inline","partial",["host/add-options"],[],["loc",[null,[139,32],[139,62]]]],
      ["inline","top-errors",[],["errors",["subexpr","@mut",[["get","errors",["loc",[null,[141,21],[141,27]]]]],[],[]]],["loc",[null,[141,1],[141,29]]]],
      ["inline","save-cancel",[],["save","save","cancel","cancel"],["loc",[null,[141,30],[141,73]]]]
    ],
    locals: [],
    templates: [child0, child1, child2, child3, child4, child5, child6, child7, child8, child9, child10, child11, child12]
  };
}()));;

});
