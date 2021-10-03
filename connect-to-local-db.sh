#!/bin/sh
set -e
if [[ $(id -u) -ne 0 ]] ; then echo "Please run as root" ; exit 1 ; fi

dbDir=".db/data"

if [ -d "$dbDir"  ]; then
  echo "==> Found db directory"
  echo ""
  echo "==> Configuring the local db, please Wait..."
  sudo mongod --dbpath `pwd`/"$dbDir" --port 27017
else
  echo "==> There is no local db directory found :)"
  echo ""
  echo "==> Create db directory and give it the right access"

  echo "==> [1] Create a local db ware, please wait..."
  mkdir -p "$dbDir"

  echo "==> [2] Give the db directory the right access."
  sudo chmod 777 "$dbDir"

  echo "==> [3] Configuring the local db, please Wait..."
  sudo mongod --dbpath `pwd`/"$dbDir" --port 27017
fi
