# Model d'environnement
```
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
```

# Architecture client côté api
> public/*{id_society}*/*{uuid_training}* 

# Documentation
[Documentation du UserController](docs/user.md)  
[Documentation du TrainingLanguageController](docs/training_language.md)  
[Documentation du TrainingController](docs/training.md)  
[Documentation du TrainingAuthorController](docs/training_author.md)  
[Documentation du SocietyController](docs/society.md)  
