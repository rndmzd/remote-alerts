#!/bin/bash

DEPLOYMENT_URL="/var/www/dashboard.rndmzd.com/html/"

npm run build &&
sudo cp -fv dist/* $DEPLOYMENT_URL &&
sudo systemctl restart nginx &&
echo "Deployment successful."