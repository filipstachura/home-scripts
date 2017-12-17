#!/bin/bash

set -e
DEBUG="false"
STAMP_FILE=.stamp

function day_since_last_run {
  NOW=$(date +%s)
  if [ ! -f $STAMP_FILE ]; then
    return 0 # Stamp file does not exists: run!
  fi

  STAMP=$(head -n 1 $STAMP_FILE)
  DELTA=$(($NOW-$STAMP))
  INTERVAL=$((60*60*12)) # 12 hours interval
  if (( $DELTA > $INTERVAL ));
  then
      return 0
  else
      return 1
  fi;
}

function save_stamp {
  echo "Saving stamp"
  NOW=$(date +%s)
  echo $NOW > $STAMP_FILE
}

function send_update_with_data {
  casperjs ./get_data.js $DEBUG
  Rscript ./mail_plan.R
}

if day_since_last_run;
then
   echo "Long time since last run: running.";
   send_update_with_data
   save_stamp
else
   echo "Not long time since last run: not running.";
fi
