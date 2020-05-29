#!/bin/bash
set -e -u -o pipefail
IFS=$'\n\t'

# https://github.com/docker-library/php/blob/master/8.3/bookworm/fpm/docker-php-entrypoint
# https://github.com/docker-library/wordpress/blob/master/latest/php8.3/fpm/docker-entrypoint.sh

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- php-fpm "$@"
fi

exec "$@"
