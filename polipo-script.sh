#!/bin/bash

cmd="polipo maxAge=${PJSERVICE_PROXY_CACHE_AGE:=6h} proxyPort=${PJSERVICE_PROXY_PORT:=8080} dnsUseGethostbyname=true mindlesslyCacheVary=true cacheIsShared=false preciseExpiry=true"
until $cmd; do
    echo "Server 'myserver' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
