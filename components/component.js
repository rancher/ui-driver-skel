 /*Do not change anything below (dont worry we'll swap the component name via the cli)*/
define('ui/components/drivers/<driver-name>/component', ['exports', 'ember', 'ui/mixins/driver'], function (exports, _ember, _uiMixinsDriver) {

  exports['default'] = _ember['default'].Component.extend(_uiMixinsDriver['default'], {
 /*Do not change anything above*/

     //Normal ember component hooks and methods apply below
     //Write your componet here
    driverName: '<your-driver-name>',
    bootstrap: (function () {
       /*do stuff on init if you want*/
    }).on('init')
    // Normal ember component hooks and methods apply above
  });
});
