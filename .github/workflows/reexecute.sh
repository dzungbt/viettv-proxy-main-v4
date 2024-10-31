#!/bin/bash

ports=(
  6010
  6020
  6030
  7010
  7020
  7030
)

processes=(
  "proxy_main_1"
  "proxy_main_2"
  "proxy_main_3"

)

for port in "${ports[@]}"
do
  echo "Finding processes running on port $port..."
  pids=$(lsof -i :$port | awk '$1 == "node" {print $2}')

  if [ -n "$pids" ]; then
    echo "Stopping processes with PIDs: $pids"
    echo "$pids" | xargs kill -9
    echo "All processes on port $port have been stopped"
  else
    echo "No processes found running on port $port"
  fi
done

for process in "${processes[@]}"
do
  pid_file="/www/server/nodejs/vhost/pids/${process}.pid"
  script_file="/www/server/nodejs/vhost/scripts/${process}.sh"

  echo "Starting process $process..."
  bash "$script_file"
  if [ $? -eq 0 ]; then
    echo "Process $process has been started successfully"
  else
    echo "Failed to start process $process"
  fi

  echo "---"
done

echo "All processes have been started"
exit 0