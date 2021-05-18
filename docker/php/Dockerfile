FROM php:7.3-fpm

RUN apt-get -y update --fix-missing
RUN apt-get upgrade -y

# Install useful tools
RUN apt-get -y install apt-utils nano wget dialog curl software-properties-common gnupg spfquery
RUN apt-get -y install sudo 


RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install mysqli
RUN docker-php-ext-install tokenizer
RUN docker-php-ext-install json

RUN docker-php-ext-install mbstring
RUN docker-php-ext-install gettext

RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        zlib1g-dev \
        libxml2-dev \
        libzip-dev \
    && docker-php-ext-install \
        pdo_mysql \
        zip

RUN docker-php-ext-install bcmath

# Install useful npm
RUN curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN echo 'deb https://deb.nodesource.com/node_14.x buster main' > /etc/apt/sources.list.d/nodesource.list
RUN echo 'deb-src https://deb.nodesource.com/node_14.x buster main' >> /etc/apt/sources.list.d/nodesource.list
RUN apt-get -y update
RUN apt-get -y install nodejs

# Install useful cron
RUN apt-get -y install cron

# Install important libraries
RUN apt-get -y install --fix-missing apt-utils build-essential git curl libcurl4 libcurl3-dev zip openssl ffmpeg

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ARG USER=docker
ARG UID=1000
ARG GID=1000
ARG PW=logipro

RUN useradd -m ${USER} --uid=${UID} && echo "${USER}:${PW}" | \
      chpasswd



USER ${USER}

WORKDIR /var/www/html
