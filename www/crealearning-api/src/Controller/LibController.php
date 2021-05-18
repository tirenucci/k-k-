<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Controller\ArgumentResolver\RequestValueResolver;

/**
 * Cette classe est la base pour l'API elle doit être extends par chaque controller elle vas permettre plus facilement de récuperer
 * des informations souhaiter et de faire un return plus simple
 */
class LibController
{
    private $request;

    protected const ACCESS_DENIED = 403;
    protected const NOT_FOUND = 404;
    protected const CREATED = 201;
    protected const OK = 200;
    protected const CONFLICT = 409;
    protected const NO_SPACE = 507;

    /**
     * Variable pour les message de base de retour
     */
    private const MESSAGE = [
        200 => 'Requête traiter avec succès',
        201 => 'Ressource créer',
        404 => 'Ressource introuvable',
        403 => 'Accès refuser',
	    409 => 'Conflit',
	    507 => 'Espace insufficant'
    ];

    public function __construct(RequestStack $request)
    {
        $this->request = $request->getCurrentRequest();
    }

    /**
     * Fonction permettant de récuperer le body de la requete
     *
     * @param Request $request
     * @return array L'array contenant les infos de body
     */
    protected function getBody(Request $request) : array
    {
        return \json_decode($request->getContent(), true);
    }

    protected function getAllGet(Request $request) : array
    {
        return $request->query->all();
    }

    /**
     * Fonction qui permet de récuperer un fichier qui été dans une requête
     *
     * @param string $field_name le nom du champs
     * @return mixed
     */
    protected function getFiles(Request $request, string $field_name)
    {
        return $request->files->get($field_name);
    }

    /**
     * Fonction qui permet de récuperer un get qui été dans une requête
     *
     * @param string $field le nom du champs
     * @return mixed
     */
    protected function getGet(Request $request, string $field)
    {
        return $this->request->request->get($field);
    }

    /**
     * Permet de faire le return new JsonResponse plus simplement et plus rapidement
     *
     * @param array $information Les informations que l'on souhaite envoyer au front
     * @param integer $code Le code serveur renvoyer (merci de mettre a jour les constante si une n'existe pas ;) )
     * @return JsonResponse La réponse que l'on envois
     */
    protected function setReturn(int $code, array $information = null) : JsonResponse
    {
        if (!isset($information))
        {
            return new JsonResponse(['status' => self::MESSAGE[$code]], $code);
        }
        return new JsonResponse($information, $code);
    }
}