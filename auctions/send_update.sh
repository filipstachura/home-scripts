#!/bin/bash

echo "First get data"
casperjs ./get_data.js

echo "Send update to us"
Rscript ./send_update.R
