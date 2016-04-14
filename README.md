# ui-custom-driver-composer
A small utility to build custom UI for custom drivers added to the Rancher UI project


## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running/Development

When developing an addon you may run the following command. Use the generated script as your custom UI script when adding a custom driver. This will allow you to develop locally.
* `gulp server`
* Visit your app at http://localhost:3000.


## Building

The script that is generated from the following command will be your custom UI component. Please read the comments in `components/component.js` for notes while working in the component. The script will be placed into the `dist` directory.
* `gulp build --name '<driver-name>'`
  * `driver-name` should just be the dasherized name of your driver component and match the name you gave when saving a custom driver in Rancher UI.
