# Usage: foreman start

# note you need the full path the file. otherwise errors will occur
web: phantomjs --debug=no --disk-cache=no --load-images=false --web-security=false --ssl-protocol=any pjservice.js ${PJSERVICE_PORT:=1234}

# These settings cache pages unconditionally for N time
#proxy: polipo maxAge=${PJSERVICE_PROXY_CACHE_AGE:=6h} proxyPort=${PJSERVICE_PROXY_PORT:=8080} dnsUseGethostbyname=true mindlesslyCacheVary=true cacheIsShared=false preciseExpiry=true logFile=/dev/stdout

# example .env
#PJSERVICE_PORT=1234
#PJSERVICE_PROXY_PORT=8080
#PJSERVICE_PROXY_CACHE_AGE=6h
