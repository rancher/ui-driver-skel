#!/bin/bash

case "$1" in

"install")
    yarn install
    yarn build
    cd ..
    git clone -b v1.6 https://github.com/mxschmitt/ui-driver-hetzner.git ui-driver-hetzner-v1
    cd ui-driver-hetzner-v1
    yarn install
    yarn global add bower
    bower install
    yarn build
    cd ../ui-driver-hetzner
    mv dist dist-v2
    cp -r ../ui-driver-hetzner-v1/dist .
	;;
"deploy")
    git config --global user.name "Max Schmitt"
    git config --global user.email max@schmitt.mx
    git checkout master
    git add .
    git commit -m "Added built Rancher UI source files"
    git remote rm origin
    git remote add origin https://mxschmitt:$GITHUB_TOKEN@github.com/mxschmitt/ui-driver-hetzner.git
    git push origin $TRAVIS_BRANCH
	;;
esac