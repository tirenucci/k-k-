read -p "Est-tu dans ton docker ? [O/n]" -n 1 -r
echo

if [[ $REPLY == 'n' ]]
then
	docker exec crea-php sh -c "cd /var/www/html/crealearning-api && php bin/console doctrine:database:drop --force && php bin/console doctrine:database:create && php bin/console doctrine:schema:update --force && php bin/console doctrine:fixtures:load --append"
else
	cd /var/www/html/crealearning-api && php bin/console doctrine:database:drop --force && php bin/console doctrine:database:create && php bin/console doctrine:schema:update --force && php bin/console doctrine:fixtures:load --append
fi
