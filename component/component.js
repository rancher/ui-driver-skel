/* v----- Do not change anything between here
 *       (the DRIVERNAME placeholder will be automatically replaced during build) */
define('ui/components/machine/driver-%%DRIVERNAME%%/component', ['exports', 'ember', 'ui/mixins/driver'], function (exports, _ember, _uiMixinsDriver) {

  exports['default'] = _ember['default'].Component.extend(_uiMixinsDriver['default'], {
    driverName: '%%DRIVERNAME%%',
    needAPIToken: true,
    /* ^--- And here */

    // Write your component here, starting with setting 'model' to a machine with your config populated
    bootstrap: function () {
      let config = this.get('store').createRecord({
        type: '%%DRIVERNAME%%Config',
        apiToken: '',
        serverType: "",
        serverLocation: ""
      });

      let type = 'host';

      if (!this.get('useHost')) {
        type = 'machine';
      }

      this.set('model', this.get('store').createRecord({
        type: type,
        '%%DRIVERNAME%%Config': config,
      }));
    },

    // Add custom validation beyond what can be done from the config API schema
    validate() {
      debugger;
      // Get generic API validation errors
      // this._super();
      var errors = this.get('errors') || [];

      // Add more specific errors

      // // Check something and add an error entry if it fails:
      // if (parseInt(this.get('model.%%DRIVERNAME%%Config.size'), 10) < 1024) {
      //   errors.push('Size must be at least 1024 MB');
      // }

      // // Set the array of errors for display,
      // // and return true if saving should continue.
      // if (errors.get('length')) {
      //   this.set('errors', errors);
      //   return false;
      // } else {
      //   this.set('errors', null);
      //   return true;
      // }
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
        Promise.all([this.apiRequest('/v1/locations').then(r => r.json()), this.apiRequest('/v1/images').then(r => r.json()), this.apiRequest('/v1/server_types').then(r => r.json())]).then(function (responses) {
          that.setProperties({
            needAPIToken: false,
            gettingData: false,
            regionChoices: responses[0].locations,
            imageChoices: responses[1].images,
            sizeChoices: responses[2].server_types
          });
          console.log(responses)
        })
      },
    },

    apiRequest: function (path) {
      return fetch("https://api.hetzner.cloud" + path, {
        headers: {
          'Authorization': 'Bearer ' + this.get('model.hetznerConfig.apiToken'),
        },
      });
    }
    // Any computed properties or custom logic can go here
  });
});
