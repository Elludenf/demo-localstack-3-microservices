#!/usr/bin/env bash
#healthcheck-localstack.sh

set -e
FILE=/root/ready.txt

if [ -f $FILE ]
then
  echo "Localstack is ready"
  exit 0
else
  echo "Localstack is unavailable - sleeping"
  exit 1
fi