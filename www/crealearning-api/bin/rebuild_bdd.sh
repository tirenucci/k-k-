read -p "Utilisez vous un docker ? (Y/n) " docker

if [ "$docker" == "n" ]; then
    cd back/
    php bin/console doctrine:database:drop --force; php bin/console doctrine:database:create; php bin/console doctrine:schema:update --force; php bin/console doctrine:fixtures:load --append;
else
    docker exec 7.2.x-webserver 'cd /var/www/html/crea/back;php bin/console cache:clear;php bin/console doctrine:database:drop --force; php bin/console doctrine:database:create; php bin/console doctrine:schema:update --force; php bin/console doctrine:fixtures:load --append;';
fi

echo "La base de donnée est de nouveau toute propre";