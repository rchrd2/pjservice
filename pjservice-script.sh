#!/bin/bash

cmd="phantomjs --debug=no --disk-cache=no pjservice.js ${PJSERVICE_PORT:=1234}"
until $cmd; do
    echo "Server 'myserver' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
