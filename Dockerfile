FROM richarvey/nginx-php-fpm:3.1.6

COPY . .

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG true
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]

# FROM php:8.1 as php

# RUN apt-get update -y
# RUN apt-get install -y unzip libpq-dev libcurl4-gnutls-dev
# RUN docker-php-ext-install pdo pdo_mysql bcmath

# WORKDIR /var/www
# COPY . .

# COPY --from=composer:2.1.3 /usr/bin/composer /usr/bin/composer

# ENV PORT=8000
# ENTRYPOINT [ "docker/entrypoint.sh" ]

# # ==============================================================================
# #  node
FROM node:14-alpine as node

WORKDIR /var/www
COPY . .

RUN npm install --global cross-env
RUN npm install

VOLUME /var/www/node_modules