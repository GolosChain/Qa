#!/bin/bash

image_name="goloschain/golos"

tag=$1

image="${image_name}:${tag}"

file_path="/usr/local/bin/"

file_name="cli_wallet"

contaner="golos1"

volume_name="chain_data_01"

voluem="${volume_name}:/var/lib/golosd"

docker container stop ${contaner}

docker container rm ${contaner}

docker volume rm ${volume_name}

docker pull ${image}

docker run \
           -d \
           --name ${contaner} \
           -p 8090:8090 \
           -p 8091:8091 \
           -p 2001:2001 \
           -v ${voluem} \
           -v /et/golosd:/etc/golosd \
           ${image}

rm -rf ${file_name}

docker cp ${contaner}:${file_path}${file_name} .

chmod 777 ${file_name}

chmod +x ${file_name}
