FROM nginx:latest




RUN apt-get -y update --fix-missing
RUN apt-get upgrade -y

# Install useful tools
RUN apt-get -y install apt-utils nano wget dialog curl software-properties-common gnupg spfquery
RUN apt-get -y install sudo

# Install useful npm
RUN curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN echo 'deb https://deb.nodesource.com/node_14.x buster main' > /etc/apt/sources.list.d/nodesource.list
RUN echo 'deb-src https://deb.nodesource.com/node_14.x buster main' >> /etc/apt/sources.list.d/nodesource.list
RUN apt-get -y update
RUN apt-get -y install nodejs

# Install useful cron
RUN apt-get -y install cron

# Install important libraries
RUN apt-get -y install --fix-missing apt-utils build-essential git curl libcurl4 libcurl3-dev zip openssl php php-pear php-dev php-xdebug

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install xdebug
RUN pecl install xdebug

# Install redis
RUN pecl install redis-4.0.1

# Other PHP7 Extensions

RUN apt-get -y install libsqlite3-dev libsqlite3-0 mariadb-client php-curl php-json

RUN apt-get -y install zlib1g-dev
RUN apt-get install -y \
        libzip-dev \
        zip \
  && apt-get -y install php-zip php-mbstring php-gettext php-bcmath

RUN apt-get update && apt-get install -y libzip-dev zlib1g-dev chromium
RUN apt-get update; \
  apt-get install -y --no-install-recommends \
  libfreetype6-dev \
  libjpeg62-turbo-dev \
  libpng-dev \
  pkg-config \
  patch;

# for soap
RUN apt-get update -y \
  && apt-get install -y \
    libxml2-dev php-soap php-gd php-exif php7.3-fpm php-pdo \
  && apt-get clean -y

RUN apt-get update -y \
  && apt-get -y install \
    xvfb \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*



#cypress
RUN apt-get update && apt-get install -y libgbm-dev

#ENV LC_ALL fr_FR.UTF-8
RUN apt-get update && apt-get install -y locales ffmpeg

ARG USER=docker
ARG UID=1000
ARG GID=1000
ARG PW=logipro

RUN useradd -m ${USER} --uid=${UID} && echo "${USER}:${PW}" | \
      chpasswd


## add permissions for nginx user
RUN chown -R ${USER}:${USER} /usr/share/nginx && chmod -R 755 /usr/share/nginx && \
        chown -R ${USER}:${USER} /var/cache/nginx && \
        chown -R ${USER}:${USER} /var/log/nginx && \
        chown -R ${USER}:${USER} /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R ${USER}:${USER} /var/run/nginx.pid

USER ${USER}

WORKDIR /var/www/html
