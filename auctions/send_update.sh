#!/bin/bash
PATH=/usr/local/bin:/usr/local/sbin:~/bin:/usr/bin:/bin:/usr/sbin:/sbin

echo "First get data"
rm -f export.csv
casperjs ./get_data.js

echo "Send update to us"
Rscript ./send_update.R
