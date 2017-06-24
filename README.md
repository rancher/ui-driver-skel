# Rancher UI driver for Enterprise Cloud

This Rancher UI driver is used for [NTT Communications Enterprise Cloud](https://ecl.ntt.com/en).

## Setup

* `npm install`
* `bower install`

## Development

This package contains a small web-server that will serve up the custom driver UI at `http://localhost:3000/component.js`.  You can run this while developing and point the Rancher settings there.
* `npm start`
* The driver name can be optionally overridden: `npm start -- --name=DRIVERNAME`
* The compiled files are viewable at http://localhost:3000.
* **Note:** The development server does not currently automatically restart when files are changed.

## Building

For other users to see your driver, you need to build it and host the output on a server accessible from their browsers.

* `npm build`
* Copy the contents of the `dist` directory onto a webserver.
  * If your Rancher is configured to use HA or SSL, the server must also be available via HTTPS.

## Using

* Add a Machine Driver in Rancher (Admin tab -> Settings -> Machine Drivers)
  * Download URL: The URL for the driver binary (e.g. `https://github.com/mittz/docker-machine-driver-ecl/releases/download/v1.0.0/docker-machine-driver-ecl-v1.0.0-linux-x86_64.tar.gz`)
  * Custom UI URL: The URL you uploaded the `dist` folder to, e.g. `https://github.com/mittz/ui-driver-ecl/releases/download/v1.0.0/component.js`)
* Wait for the driver to become "Active"
* Go to Infrastructure -> Hosts -> Add Host, your driver and custom UI should show up.
