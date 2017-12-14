#!/bin/bash

echo "Starting hourly script"

echo "Sending food mail"
cd food; ./run.sh; cd -

echo "Sending housing mail"
cd auctions; ./send_update.sh; cd -

