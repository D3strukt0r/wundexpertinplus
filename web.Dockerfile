# -----------------------------------------------------------------------------
# Improved wordpress image with all my extra needs & unprivileged user
# https://github.com/docker-library/wordpress/blob/master/latest/php8.3/fpm/Dockerfile
# https://github.com/krallin/tini
# https://make.wordpress.org/hosting/handbook/handbook/server-environment/#php-extensions
# -----------------------------------------------------------------------------
# bookworm
FROM wordpress:6.5-php8.3-fpm AS phpfpm

# Switch shell to bash for better support
SHELL ["/bin/bash", "-e", "-u", "-x", "-o", "pipefail", "-c"]

# Fix apt warning "TERM is not set" (https://stackoverflow.com/a/35976127/4156752)
ARG DEBIAN_FRONTEND=noninteractive

# Download and cache apt packages
RUN rm -f /etc/apt/apt.conf.d/docker-clean \
    && echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' >/etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    # Update system first
    apt-get update -qq \
    && apt-get dist-upgrade -qq >/dev/null \
    \
    # apt-utils to fix "debconf: delaying package configuration, since apt-utils is not installed" but also needs "DEBIAN_FRONTEND=noninteractive"
    && apt-get -qq install \
        apt-utils >/dev/null \
    \
    # Install additional packages (curl already installed)
    && apt-get -qq install \
        bash-completion \
        wget \
        ncdu \
        vim \
        neovim \
        nano \
        htop \
        # Required for WP CLI
        less \
        # Required for unpacking wordpress.org plugins/themes
        unzip \
        # Required to check connectivity
        default-mysql-client \
        postgresql-client \
        # Required for healthcheck
        libfcgi-bin \
        # For init system
        tini

RUN \
    # Get WP CLI and autocompletion
    curl -fsSL -o /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x /usr/local/bin/wp \
    \
    && mkdir /etc/bash_completion.d/ \
    && curl -fsSL -o /etc/bash_completion.d/wp-completion.bash https://raw.githubusercontent.com/wp-cli/wp-cli/master/utils/wp-completion.bash \
    && sed -i -e 's/wp cli completions/wp --allow-root cli completions/g' /etc/bash_completion.d/wp-completion.bash \
    \
    # Add healthcheck script for PHP-FPM (https://github.com/renatomefi/php-fpm-healthcheck)
    && curl --fail --silent --show-error --location --output /usr/local/bin/php-fpm-healthcheck \
        https://raw.githubusercontent.com/renatomefi/php-fpm-healthcheck/master/php-fpm-healthcheck \
    && chmod +x /usr/local/bin/php-fpm-healthcheck \
    && { \
        echo '[www]'; \
        echo 'pm.status_path = /status'; \
    } >>"$PHP_INI_DIR/conf.d/zz-docker.conf" \
    \
    # Smoke tests
    && php -v \
    \
    # Uncomment bash auto completion
    && sed -i '35,41 s/^#//' /etc/bash.bashrc \
    \
    && { \
        # Add custom PS1
        # https://strasis.com/documentation/limelight-xe/reference/ecma-48-sgr-codes
        echo 'export PS1="🐳 ${debian_chroot:+($debian_chroot)}\[\e[38;5;46m\]\u@\h\[\e[0m\]:\[\e[38;5;33m\]\w\[\e[0m\]\\$ "'; \
    } >>/etc/bash.bashrc \
    \
    # Fix weird WordPress setup
    && { \
		echo 'cgi.fix_pathinfo = 0'; \
	} >"$PHP_INI_DIR/conf.d/wordpress.ini" \
    && rm --recursive --force \
        /usr/local/bin/docker-php-entrypoint \
        /usr/src/wordpress/.htaccess \
        /usr/src/wordpress/readme.html \
        /usr/src/wordpress/wp-config-sample.php \
        /usr/src/wordpress/wp-content/plugins/akismet \
        /usr/src/wordpress/wp-content/plugins/hello.php \
        /usr/src/wordpress/wp-content/themes/twentytwentythree \
        /usr/src/wordpress/wp-content/themes/twentytwentytwo \
    && mv /usr/src/wordpress/wp-config-docker.php /usr/src/wordpress/wp-config.php \
    && mv /usr/src/wordpress /usr/local/src/app \
    && cp --recursive /var/www/html/* /usr/local/src/app \
    && rm --recursive --force /var/www/html \
    && chown --recursive root:root /usr/local/src/app \
    && chown www-data:www-data \
        /usr/local/src/app/wp-content \
        /usr/local/src/app/wp-content/cache \
        /var/www

COPY web/.docker/phpfpm/rootfs-prod /

USER www-data

WORKDIR /usr/local/src/app

ENTRYPOINT ["tini", "--", "docker-entrypoint.sh"]
# Has to be redefined because of the ENTRYPOINT
CMD ["php-fpm"]

# -----------------------------------------------------------------------------
# Improved nginx image with all my extra needs & unprivileged user
# https://github.com/nginxinc/docker-nginx-unprivileged/blob/main/mainline/debian/Dockerfile
# https://github.com/krallin/tini
# https://developer.wordpress.org/advanced-administration/server/web-server/nginx/
# -----------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:1.27-bookworm AS nginx

USER root

# Switch shell to bash for better support
SHELL ["/bin/bash", "-e", "-u", "-x", "-o", "pipefail", "-c"]

# Fix apt warning "TERM is not set" (https://stackoverflow.com/a/35976127/4156752)
ARG DEBIAN_FRONTEND=noninteractive

# Download and cache apt packages
RUN rm -f /etc/apt/apt.conf.d/docker-clean \
    && echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' >/etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    # Update system first
    apt-get update -qq \
    && apt-get dist-upgrade -qq >/dev/null \
    \
    # apt-utils to fix "debconf: delaying package configuration, since apt-utils is not installed" but also needs "DEBIAN_FRONTEND=noninteractive"
    && apt-get -qq install \
        apt-utils >/dev/null \
    \
    # Install additional packages (curl already installed)
    && apt-get -qq install \
        bash-completion \
        ncdu \
        wget \
        vim \
        neovim \
        nano \
        htop \
        # For init system
        tini
# TODO: Figure out how to add brotli support

RUN \
    # Smoke tests
    nginx -v \
    \
    # Uncomment bash auto completion
    && sed -i '35,41 s/^#//' /etc/bash.bashrc \
    \
    && { \
        # Add custom PS1
        # https://strasis.com/documentation/limelight-xe/reference/ecma-48-sgr-codes
        echo 'export PS1="🐳 ${debian_chroot:+($debian_chroot)}\[\e[38;5;46m\]\u@\h\[\e[0m\]:\[\e[38;5;33m\]\w\[\e[0m\]\\$ "'; \
    } >>/etc/bash.bashrc \
    \
    # Move shell files to bin \
    && mv /docker-entrypoint.sh /usr/local/bin/ \
    \
    # Create app dir
    && mkdir --parents /usr/local/src/app

ENV NGINX_CLIENT_MAX_BODY_SIZE=100M

WORKDIR /usr/local/src/app

COPY web/.docker/nginx/rootfs-prod /
COPY --from=phpfpm /usr/local/src/app/ ./

RUN \
    # Empty all php files (to reduce container size). Only the file's existence is important
    find . -type f -name "*.php" -exec sh -c 'i="$1"; >"$i"' _ {} \; \
    \
    # Fix permissions
    && find /etc/nginx \( -not -user nginx -o -not -group root \) -exec chown nginx:root {} \;

USER nginx

ENTRYPOINT ["tini", "--", "docker-entrypoint.sh"]
# Has to be redefined because of the ENTRYPOINT
CMD ["nginx", "-g", "daemon off;"]

# -----------------------------------------------------------------------------
# Prod build (Build is done in separate stage)
# -----------------------------------------------------------------------------
FROM phpfpm AS prod-phpfpm
USER root
RUN \
    rm --recursive --force \
        ./wp-content/themes/twentytwentyfour \
    && wp-plugin-install.sh \
        bulk-delete \
        duplicator \
        google-analytics-for-wordpress \
        jetpack \
        loginizer \
        polylang \
        wordpress-importer \
        wordpress-seo \
        wp-mail-smtp \
        wpforms-lite \
    && wp-theme-install.sh \
        customify \
    \
    # Fix Permission
    && chown --recursive www-data:www-data . \
    && find . -type d -exec chmod 755 {} \; \
    && find . -type f -exec chmod 644 {} \;
USER www-data

FROM nginx AS prod-nginx
USER root
COPY --from=prod-phpfpm /usr/local/src/app/ ./
RUN \
    find . -type f -name "*.php" -exec sh -c 'i="$1"; >"$i"' _ {} \;
USER nginx
