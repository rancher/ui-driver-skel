#!/bin/bash

case "$1" in

"install")
    yarn install
    yarn build
    git clone -b v1.6 https://github.com/mxschmitt/ui-driver-hetzner.git
    cd ui-driver-hetzner
    yarn install
    yarn build
    cd ..
    mv ui-driver-hetzner/dist dist-v2
    rm -rf ui-driver-hetzner
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