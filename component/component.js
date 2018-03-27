/* v----- Do not change anything between here
 *       (the DRIVERNAME placeholder will be automatically replaced during build) */
define('ui/components/node-driver/driver-%%DRIVERNAME%%/component', ['exports', 'ember', 'shared/components/node-driver/driver-%%DRIVERNAME%%/component'], function (exports, _ember, _component) {
  exports['default'] = _component['default'];
});

define('shared/components/node-driver/driver-%%DRIVERNAME%%/component', ['exports', 'ember', 'shared/mixins/node-driver', 'shared/components/node-driver/driver-%%DRIVERNAME%%/template', 'ui/utils/constants'], function (exports, _ember, _uiMixinsDriver, _template, _uiUtilsConstants) {
  /* ^--- And here */

  // You can put embmer object here
  var computed = Ember.computed;
  var get = Ember.get;
  var set = Ember.set;
  var alias = Ember.computed.alias;

  /* v----- Do not change anything between here
   *       (the DRIVERNAME placeholder will be automatically replaced during build) */
  exports['default'] = _ember['default'].Component.extend(_uiMixinsDriver['default'], {
    layout: _template.default,
    driverName: '%%DRIVERNAME%%',
    needAPIToken: true,
    config: alias('model.%%DRIVERNAME%%Config'),
    /* ^--- And here */

    // Write your component here, starting with setting 'model' to a machine with your config populated
    bootstrap: function () {
      let config = get(this, 'globalStore').createRecord({
        type: '%%DRIVERNAME%%Config',
        serverType: 'cx21', // 4 GB Ram
        serverLocation: 'nbg1', // Nuremberg
        image: 'ubuntu-16.04',
        userData: ''
      });

      set(this, 'model.%%DRIVERNAME%%Config', config);
    },

    // Add custom validation beyond what can be done from the config API schema
    validate() {
      // Get generic API validation errors
      this._super();
      var errors = get(this, 'errors') || [];
      if (!get(this, 'model.name')) {
        errors.push('Name is required');
      }

      // Add more specific errors

      // Check something and add an error entry if it fails:
      if (parseInt(get(this, 'config.memorySize'), 10) < 1024) {
        errors.push('Memory Size must be at least 1024 MB');
      }

      // Set the array of errors for display,
      // and return true if saving should continue.
      if (get(errors, 'length')) {
        set(this, 'errors', errors);
        return false;
      }
      else {
        set(this, 'errors', null);
        return true;
      }
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
        // if (/fedora/i.test(ev.target.value)) {
        //   this.set('model.engineInstallUrl', 'https://get.docker.com')
        // } else {
        //   let defaultEngineInstallURL = this.get('settings.' + _uiUtilsConstants['default'].SETTING.ENGINE_URL);
        //   this.set('model.engineInstallUrl', defaultEngineInstallURL)
        // }
      }
    },

    apiRequest: function (path) {
      return fetch('https://api.hetzner.cloud' + path, {
        headers: {
          'Authorization': 'Bearer ' + this.get('model.hetznerConfig.apiToken'),
        },
      }).then(res => res.ok ? res.json() : Promise.reject(res.json()));
    }
    // Any computed properties or custom logic can go here
  });
});