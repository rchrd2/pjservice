#foreman start
# note you need the full path the file. otherwise errors will occur
web: phantomjs --debug=no --proxy=127.0.0.1:${PJSERVICE_PROXY_PORT} --disk-cache=no pjservice.js ${PJSERVICE_PORT}

# These settings cache pages unconditionally for N time
proxy: polipo maxAge=${PJSERVICE_PROXY_CACHE_AGE} proxyPort=${PJSERVICE_PROXY_PORT} dnsUseGethostbyname=true mindlesslyCacheVary=true cacheIsShared=false preciseExpiry=true

# example .env
#PJSERVICE_PORT=1234
#PJSERVICE_PROXY_PORT=8080
#PJSERVICE_PROXY_CACHE_AGE=6h
