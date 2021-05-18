# ![](https://zupimages.net/up/20/41/w4f8.png)
![](https://img.shields.io/website?down_color=red&down_message=Offline&label=Serveur%20de%20Test&up_color=brightgreen&up_message=Online&url=https%3A%2F%2Ftestcreaporte.logi.pro%2F)
![](https://img.shields.io/website?down_color=red&down_message=Offline&label=Site%20de%20Production&up_color=brightgreen&up_message=Online&url=https%3A%2F%2Fcreaporte.logi.pro%2F)
![](https://img.shields.io/static/v1?label=Tags&message=4.9.15-dev&color=blue) ![](https://img.shields.io/static/v1?label=Date&message=2020-10-01&color=green) 
![](https://img.shields.io/static/v1?label=Symfony&message=v5.0.10&color=orange) ![](https://img.shields.io/static/v1?label=React&message=16.13.1&color=ff69b4) ![](https://img.shields.io/static/v1?label=Php&message=7.3.23&color=blue) ![](https://img.shields.io/static/v1?label=MariaDB&message=v10.5.5&color=yellow)

Crea Learning est un outil auteur.
## Outils 
![](https://zupimages.net/up/20/41/xclg.png) ![](https://zupimages.net/up/20/41/0mec.png) ![](https://zupimages.net/up/20/41/58bu.png) ![](https://zupimages.net/up/20/41/5vlx.jpg) ![](https://zupimages.net/up/20/41/up7p.png)
## Prérequis
- Docker
- Docker-Compose
- Node.js 14 

## Installation
1. Cloner le projet:
`git clone https://gitlab.com/logipro/devteam/crealearningdockeriser.git`

2. Accéder au dossier du projet via le terminal:
`cd crealearningdockeriser/`

3. Accéder au dossier du projet via le terminal:
`git checkout "develop"`

4. Lancer la commande: 
`docker-compose up -d`

### Installer l'Api + Front avec Npm au sein du docker : 

5. Se connecter au Docker:
`docker exec -it crea-php /bin/bash`
 
6. Allez dans le dossier : 
`cd crealearning-api`

7. Ajouter le Env Local dans le projet : `nano .env.local` avec ces infos :

 `
    ###> symfony/framework-bundle ###
    APP_ENV=dev
    APP_SECRET=6b8e6ff0e5121f99a844cb8e95390870
    #TRUSTED_PROXIES=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
    #TRUSTED_HOSTS='^(localhost|example\.com)$'
    ###< symfony/framework-bundle ###

    ###> doctrine/doctrine-bundle ###
    # Format described at https://www.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
    # For an SQLite database, use: "sqlite:///%kernel.project_dir%/var/data.db"
    # For a PostgreSQL database, use: "postgresql://db_user:db_password@127.0.0.1:5432/db_name?serverVersion=11&charset=utf8"
    # IMPORTANT: You MUST configure your server version, either here or in config/packages/doctrine.yaml
    DATABASE_URL=mysql://root:logipro@mysql/crea-learning
    ###< doctrine/doctrine-bundle ###

    ###> symfony/mailer ###
    MAILER_FROM=noreply@crea-learning.com
    MAILER_DSN=smtp://noreply%40logipro.com:mbkdFUP_7@isp15.logipro.com:587
    ###< symfony/mailer ###
    ###> nelmio/cors-bundle ###
    CORS_ALLOW_ORIGIN=*
    ###< nelmio/cors-bundle ###

    ROOT_PATH=/var/www/html/crealearning/public
    ASSETS_PATH=/var/www/html/crealearning/public/assets/clients/
    ASSETS_URL=/assets/clients/
    UPLOAD_PATH=/home/docker/clients/uploads/librairies
    UPLOAD_URL=/assets/upload/
    TMP_TRAINING_PATH=/var/www/html/crealearning-api/var/training/
    BACK_ORIGIN_URL=http://localhost/crea/
    BACK_LIB_URL=http://localhost/lib/
    FREE_LIB_PATH=/var/www/html/crealearning/public/assets/img/freeLibrairie/
    FRONT_URL=http://localhost:3000

    HASH_KEY=Sok{2wPFvEp0A0PJJAw04Nm]pBZOJPaQ
    
` 
    
7. Ensuite ` cd .. ` on est dans le répertoire `/crealearningdockeriser`

8. Run le Script d'installation : 
`./bin/setup.sh`

10. Une fois le script terminer, sortir du docker et allez dans `crealearningdockeriser/crealearning`

### Éxecution de React : 
11. Lancer la commande `npm start`

### Reconstruction de la Base de donnée en cas de nécessité : 

12. Run le Script : 
`./bin/rebuild_db.sh`

