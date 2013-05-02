#foreman start
# note you need the full path the file. otherwise errors will occur
web: phantomjs --debug=no --proxy=127.0.0.1:8123 --disk-cache=no pjservice.js ${PJSERVICE_PORT}

# These settings cache pages unconditionally for N time
proxy: polipo maxAge=6h dnsUseGethostbyname=true mindlesslyCacheVary=true cacheIsShared=false preciseExpiry=true


