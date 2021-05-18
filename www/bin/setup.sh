read -p "Est-tu dans ton docker ? [O/n]" -n 1 -r
echo

if [[ $REPLY == 'n' ]]
then
	docker exec crea-php sh -c "cd /var/www/html/crealearning-api && echo \"Déplacement dans le dossier de l'api\" && composer install && php bin/console doctrine:database:create && php bin/console doctrine:schema:update --force && php bin/console doctrine:fixtures:load --append && cd ../crealearning/ && npm install"
else
	cd /var/www/html/crealearning-api && composer install && php bin/console doctrine:database:create && php bin/console doctrine:schema:update --force && php bin/console doctrine:fixtures:load --append && cd ../crealearning/ && npm install
fi
