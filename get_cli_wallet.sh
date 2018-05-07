#!/bin/bash

image_name="goloschain/golos"

tag=$0

image="${image_name}:${tag}"

file_path="/var/app/"

file_name="cli_wallet"

contaner="golos1"

docker pull ${image}

docker run --name ${contaner} -d ${image}

docker cp ${contaner}:${file_path}${file_name} .

chmod 777 ${file_name}

chmod +x ${file_name}