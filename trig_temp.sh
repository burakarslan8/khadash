#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <desired_temperature>"
  exit 1
fi

desired_temperature="$1"

while true; do
  temperature=$(cat /sys/class/thermal/thermal_zone0/temp)
  temperature=$((temperature/1000))

  if [ "$temperature" -gt "$desired_temperature" ]; then
	/usr/local/bin/fan.sh manual
	/usr/local/bin/fan.sh low
  else
	/usr/local/bin/fan.sh auto
  fi

  sleep 60
done
