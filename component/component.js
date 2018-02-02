/* v----- Do not change anything between here
 *       (the DRIVERNAME placeholder will be automatically replaced during build) */
define('ui/components/machine/driver-%%DRIVERNAME%%/component', ['exports', 'ember', 'ui/mixins/driver', 'ui/utils/constants'], function (exports, _ember, _uiMixinsDriver, _uiUtilsConstants) {

  exports['default'] = _ember['default'].Component.extend(_uiMixinsDriver['default'], {
    driverName: '%%DRIVERNAME%%',
    needAPIToken: true,

    bootstrap: function () {
      let config = this.get('store').createRecord({
        type: '%%DRIVERNAME%%Config',
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
        '%%DRIVERNAME%%Config': config,
      }));
    },

    validate() {
      this._super();
      var errors = this.get('errors') || [];

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
          console.log("ye")
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
