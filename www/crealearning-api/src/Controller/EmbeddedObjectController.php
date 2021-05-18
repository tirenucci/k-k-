<?php


namespace App\Controller;

//Pour l'API
use App\Controller\LibController;
use App\Service\EmbeddedObjectService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\IntegratedObjectThemeRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EmbeddedObjectController extends LibController
{
    /**
     * @Route("/eo/new", methods={"POST"})
    *
    * @param Request $request
    * @param EmbeddedObjectService $embeddedObjectService
    * @return JsonResponse
    */
    public function createEO(EmbeddedObjectService $embeddedObjectService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $eo = $embeddedObjectService->createEO($data);

        return $this->setReturn(self::OK, $eo);     
    }

    /**
     * @Route ("/eo", methods = {"GET"})
     * 
     * @param EmbeddedObjectService $embeddedObjectService
     * @return JsonResponse
     */

    public function getEmbeddedObject(EmbeddedObjectService $embeddedObjectService, Request $request) : JsonResponse
    {
        $eo = $embeddedObjectService->takeAllEOByTheme();
        return $this->setReturn(self::OK, $eo);
    }

    /**
     * @Route("/eo/get_data", methods={"GET"})
     *
     * @param EmbeddedObjectService $embeddedObjectService
     * @return JsonResponse
     */
    public function getEoData(EmbeddedObjectService $embeddedObjectService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $eo = $embeddedObjectService->getEoData($data);

        return $this->setReturn(self::OK, $eo);   
    }

    /**
     * @Route("/eo/update", methods={"PUT"})
     *
     * @param EmbeddedObjectService $embeddedObjectService
     * @return JsonResponse
     */
    public function updateEO(EmbeddedObjectService $embeddedObjectService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $eo = $embeddedObjectService->updateEO($data);

        return $this->setReturn(self::OK, $eo);   
    }

    /**
     * @Route("/eo/delete", methods={"DELETE"})
    *
    * @param Request $request
    * @param EmbeddedObjectService $embeddedObjectService
    * @return JsonResponse
    */
    public function deleteEO(EmbeddedObjectService $embeddedObjectService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        if ($embeddedObjectService->deleteEO($data)){
            return $this->setReturn(self::OK);
        }
        return $this->setReturn(self::NOT_FOUND);   
    }
}