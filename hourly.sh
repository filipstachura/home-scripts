#!/bin/bash

echo "Starting hourly script"

cd auctions; ./send_update.sh; cd -
cd food; ./run.sh; cd -

