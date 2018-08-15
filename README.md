# ui-driver-skel
Skeleton Rancher UI driver for custom docker-machine drivers

**Note: The Master branch works with Rancher 2.x+, if you are building a custom driver for Rancher 1.x use the 1.x branch**

## Setup

* Fork this repository into your own account as `ui-driver-DRIVERNAME`
  * DRIVERNAME should be the name of the driver that you would give to `docker-machine create --driver`, e.g. "mycompany", "digitalocean", "vultr", etc.
* Update the "name" in package.json to match
  * You should also update description, URLs, etc, but these aren't strictly required.
* `npm install`

## Development

This package contains a small web-server that will serve up the custom driver UI at `http://localhost:3000/component.js`.  You can run this while developing and point the Rancher settings there.
* `npm start`
* The driver name can be optionally overridden: `npm start -- --name=DRIVERNAME`
* The compiled files are viewable at http://localhost:3000.
* **Note:** The development server does not currently automatically restart when files are changed.
* Do not use the `model.<drivername>Confg` signature to access your driver config in the template file, use the `config` alias that is already setup in the component

## Building

For other users to see your driver, you need to build it and host the output on a server accessible from their browsers.

* `npm run build`
* Copy the contents of the `dist` directory onto a webserver.
  * If your Rancher is configured to use HA or SSL, the server must also be available via HTTPS.

## Using

* Add a Machine Driver in Rancher 2.0 (Global -> Node Drivers)
  * Name: Your `DRIVERNAME` (see above).
  * Download URL: The URL for the driver binary (e.g. `https://github.com/mycompany/docker-machine-mycompany/releases/download/v1.0.0/docker-machine-driver-mycompany-v1.0.0-linux-amd64.tar.gz`)
  * Custom UI URL: The URL you uploaded the `dist` folder to, e.g. `https://github.com/mycompany/ui-driver-mycompany/releases/download/v1.0.0/component.js`)
* Wait for the driver to become "Active"
* Go to Clusters -> Add Cluster, your driver and custom UI should show up.
