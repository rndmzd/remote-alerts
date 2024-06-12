#!/bin/bash

cd packages/client
npm i --save-dev
npm run build
sudo rm * /var/www/dashboard.rndmzd.com/html/*
sudo cp dist/* /var/www/dashboard.rndmzd.com/html/

cd ../server
npm i --save-dev
npm run build
screen -x
exit
screen -dmS server npm run dev