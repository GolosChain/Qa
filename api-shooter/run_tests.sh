#!/bin/bash

node src/start.js
sleep 3
mocha --exit 
node src/stop.js --exit