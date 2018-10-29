#!/bin/bash

node src/start.js
sleep 3
mocha --exit
# sleep 5 
node src/stop.js --exit