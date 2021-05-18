<?php

namespace App\Controller;

use App\Controller\LibController;
use App\Service\EmbeddedObjectService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;


class EmbeddedObjectThemeController extends LibController
{
    /**
     * @Route ("/eot/get_all", methods = {"GET"})
     *
     * @param EmbeddedObjectService $embeddedObjectService
     * @return JsonResponse 200 si OK
     */
    public function getEmbeddedObjectThemes(EmbeddedObjectService $embeddedObjectService) : JsonResponse
    {
        $eoThemes = $embeddedObjectService->takeAllThemes();
        return $this->setReturn(self::OK, $eoThemes);
    }

    /**
     * @Route("/eot/new", methods={"POST"})
    *
    * @param Request $request
    * @param EmbeddedObjectService $embeddedObjectService
    * @return JsonResponse
    */
    public function createTheme(EmbeddedObjectService $embeddedObjectService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $eoTheme = $embeddedObjectService->createTheme($data);

        return $this->setReturn(self::OK, $eoTheme);     
    }

    /**
     * @Route("/eot/delete", methods={"DELETE"})
    *
    * @param Request $request
    * @param EmbeddedObjectService $embeddedObjectService
    * @return JsonResponse
    */
    public function deleteTheme(EmbeddedObjectService $embeddedObjectService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        if ($embeddedObjectService->deleteTheme($data)){
            return $this->setReturn(self::OK);
        }
        return $this->setReturn(self::NOT_FOUND);   
    }

    /**
     * @Route("/eot/get", methods={"GET"})
     *
     * @param EmbeddedObjectService $embeddedObjectService
     * @return JsonResponse
     */
    public function getEoThemeData(EmbeddedObjectService $embeddedObjectService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $eoTheme = $embeddedObjectService->getEoThemeData($data);

        return $this->setReturn(self::OK, $eoTheme);   
    }
}
