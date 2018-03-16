/* v----- Do not change anything between here
 *       (the DRIVERNAME placeholder will be automatically replaced during build) */
define('ui/components/machine/driver-hetzner/component', ['exports', 'ember', 'ui/mixins/driver', 'ui/utils/constants'], function (exports, _ember, _uiMixinsDriver, _uiUtilsConstants) {

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
        // Without the overlay storage driver, only Ubuntu works. Debian, CentOS, Fedora won't.
        engineStorageDriver: 'overlay',
        'hetznerConfig': config,
      }));
    },

    validate() {
      this._super();
      let errors = this.get('errors') || [];

      let apiToken = this.get('model.hetznerConfig.apiToken') || '';
      if (apiToken && apiToken.length !== 64) {
        errors.push('That does not look like a valid access token');
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
      onImageChange(ev) {
        this.set('model.hetznerConfig.image', ev.target.value);
        // Use the most recent version if it's Fedora. The default (recommend, 1.12) and all other won't work with Fedora.
        if (/fedora/i.test(ev.target.value)) {
          this.set('model.engineInstallUrl', 'https://get.docker.com')
        } else {
          let defaultEngineInstallURL = this.get('settings.' + _uiUtilsConstants['default'].SETTING.ENGINE_URL);
          this.set('model.engineInstallUrl', defaultEngineInstallURL)
        }
      }
    },

    apiRequest: function (path) {
      return fetch('https://api.hetzner.cloud' + path, {
        headers: {
          'Authorization': 'Bearer ' + this.get('model.hetznerConfig.apiToken'),
        },
      }).then(res => res.ok ? res.json() : Promise.reject(res.json()));
    }
  });
});
;
define("ui/components/machine/driver-hetzner/template",["exports","ember","ui/mixins/driver"],function(exports,_ember,_uiMixinsDriver){

exports["default"] = Ember.HTMLBars.template({"id":"3zSmITkO","block":"{\"symbols\":[\"choice\",\"choice\",\"choice\"],\"statements\":[[6,\"section\"],[9,\"class\",\"horizontal-form\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"needAPIToken\"]]],null,{\"statements\":[[0,\"    \"],[6,\"form\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"over-hr r-mb20\"],[7],[0,\"\\n        \"],[6,\"span\"],[7],[0,\"Account Access\"],[8],[0,\"\\n      \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row form-group\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"col-md-2\"],[7],[0,\"\\n              \"],[6,\"label\"],[9,\"class\",\"form-control-static\"],[7],[0,\"API Token*\"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"col-md-10\"],[7],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"classNames\",\"placeholder\"],[\"password\",[20,[\"model\",\"hetznerConfig\",\"apiToken\"]],\"form-control\",\"Your Hetzner Cloud API Token\"]]],false],[0,\"\\n            \"],[6,\"p\"],[9,\"class\",\"help-block\"],[7],[0,\"Create it by switching into the \"],[6,\"a\"],[9,\"target\",\"_blank\"],[9,\"href\",\"https://console.hetzner.cloud\"],[7],[0,\"Hetzner Cloud Console\"],[8],[0,\", choosing a project, go to Access → Tokens and create a new API token there.\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[1,[25,\"top-errors\",null,[[\"errors\"],[[20,[\"errors\"]]]]],false],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"footer-actions\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"gettingData\"]]],null,{\"statements\":[[0,\"            \"],[6,\"button\"],[9,\"class\",\"btn bg-primary btn-disabled\"],[7],[6,\"i\"],[9,\"class\",\"icon icon-spinner icon-spin\"],[7],[8],[0,\" \"],[1,[25,\"t\",[\"generic.loading\"],null],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[6,\"button\"],[9,\"class\",\"btn bg-primary\"],[10,\"disabled\",[25,\"not\",[[20,[\"model\",\"hetznerConfig\",\"apiToken\"]]],null],null],[3,\"action\",[[19,0,[]],\"getData\"]],[7],[0,\"Configure Server\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"          \"],[6,\"button\"],[9,\"class\",\"btn bg-transparent\"],[3,\"action\",[[19,0,[]],\"cancel\"]],[7],[1,[25,\"t\",[\"generic.cancel\"],null],false],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"     \"],[6,\"div\"],[9,\"class\",\"container-fluid\"],[7],[0,\"\\n\"],[0,\"      \"],[12,\"host/add-common\",[]],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"over-hr r-mt20 r-mb20\"],[7],[0,\"\\n          \"],[6,\"span\"],[7],[0,\"Region\"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row form-group\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-md-2\"],[7],[0,\"\\n              \"],[6,\"label\"],[9,\"class\",\"form-control-static\"],[7],[0,\"Region\"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"col-md-10\"],[7],[0,\"       \\n              \"],[6,\"select\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"model\",\"hetznerConfig\",\"serverLocation\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"regionChoices\"]]],null,{\"statements\":[[0,\"                  \"],[6,\"option\"],[10,\"value\",[19,3,[\"name\"]],null],[10,\"selected\",[25,\"eq\",[[20,[\"model\",\"hetznerConfig\",\"serverLocation\"]],[19,3,[\"name\"]]],null],null],[7],[1,[19,3,[\"city\"]],false],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"            \"],[8],[0,\"   \\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"over-hr r-mt20 r-mb20\"],[7],[0,\"\\n            \"],[6,\"span\"],[7],[0,\"Settings\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row form-group\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"col-md-2\"],[7],[0,\"\\n            \"],[6,\"label\"],[9,\"class\",\"form-control-static\"],[7],[0,\"Image\"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[0,\"\\n            \"],[6,\"select\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"onImageChange\"],null],null],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"imageChoices\"]]],null,{\"statements\":[[0,\"                \"],[6,\"option\"],[10,\"value\",[19,2,[\"name\"]],null],[10,\"selected\",[25,\"eq\",[[20,[\"model\",\"hetznerConfig\",\"image\"]],[19,2,[\"name\"]]],null],null],[7],[1,[19,2,[\"description\"]],false],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"col-md-2\"],[7],[0,\"\\n            \"],[6,\"label\"],[9,\"class\",\"form-control-static\"],[7],[0,\"Size\"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[0,\"\\n            \"],[6,\"select\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"model\",\"hetznerConfig\",\"serverType\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"sizeChoices\"]]],null,{\"statements\":[[0,\"              \"],[6,\"option\"],[10,\"value\",[19,1,[\"name\"]],null],[10,\"selected\",[25,\"eq\",[[20,[\"model\",\"hetznerConfig\",\"serverType\"]],[19,1,[\"name\"]]],null],null],[7],[1,[19,1,[\"description\"]],false],[0,\" - \"],[1,[19,1,[\"memory\"]],false],[0,\"GB Memory - \"],[1,[19,1,[\"disk\"]],false],[0,\"GB Disk space\"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[0,\"    \"],[12,\"host/add-options\",[]],[0,\"\\n\\n\"],[0,\"    \"],[1,[25,\"top-errors\",null,[[\"errors\"],[[20,[\"errors\"]]]]],false],[0,\"\\n\\n\"],[0,\"    \"],[1,[25,\"save-cancel\",null,[[\"save\",\"cancel\"],[\"save\",\"cancel\"]]],false],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[8],[0,\"\\n\"]],\"hasEval\":true}","meta":{}});;

});
