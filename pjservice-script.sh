#!/bin/bash

cmd="phantomjs --debug=yes --disk-cache=no --ssl-protocol=any pjservice.js ${PJSERVICE_PORT:=1234}"
until $cmd; do
    echo "Server 'myserver' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
