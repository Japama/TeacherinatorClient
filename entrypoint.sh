#!/bin/sh

echo "Reemplazando REACT_APP_API_BASE_URL: $REACT_APP_API_BASE_URL"
echo "window._env_ = { REACT_APP_API_BASE_URL: '$REACT_APP_API_BASE_URL' };" > /usr/share/nginx/html/env-config.js

exec nginx -g 'daemon off;'
