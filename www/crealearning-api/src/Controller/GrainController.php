<?php

namespace App\Controller;

use App\Service\GrainService;
use App\Controller\LibController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use ProxyManager\Factory\RemoteObject\Adapter\JsonRpc;

class GrainController extends LibController
{

    /**
     * @Route("/grain/create", methods={"POST"})
     *
     * @param GrainService $grainService
     * @return JsonResponse
     */
    public function createGrain(GrainService $grainService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $grainService->createGrain($data);

        return $this->setReturn(self::CREATED);
    }

    /**
     * @Route("/grain/generate_html", methods={"GET"})
     *
     * @param GrainService $grainService
     * @param Request $request
     * @return JsonResponse
     */
    public function generateHtml(GrainService $grainService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $html = $grainService->generateHtml($data);

        return $this->setReturn(self::OK, $html);
    }

    /**
     * @Route("/grain/get_all_by_training", methods={"GET"})
     *
     * @param GrainService $grainService
     * @return JsonResponse
     */
    public function getAllGrainByTraining(GrainService $grainService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $allGrain = $grainService->getAllGrainByTraining($data);

        return $this->setReturn(self::OK, $allGrain);
    }

    /**
     * @Route("/grain/change_name", methods={"PUT"})
     * 
     * @param GrainService $grainService
     * @return JsonResponse
     */
    public function changeName(GrainService $grainService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $grainService->changeName($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/grain/get_property", methods={"GET"})
     * 
     * @param GrainService $grainService
     * 
     * @return JsonResponse
     */
    public function getAllProperty(GrainService $grainService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);
        
        $grain = $grainService->getOneGrainInformation($data);


        return $this->setReturn(self::OK, $grain);
    }

	/**
	 * @Route("/grain/update", methods={"POST"})
	 *
	 * @param GrainService $grainService
	 *
	 * @param Request      $request
	 *
	 * @return JsonResponse
	 */
    public function update(GrainService $grainService, Request $request) : JsonResponse
    {
    	$data = $this->getBody($request);

        $grainService->update($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/grain/delete", methods={"DELETE"})
     *
     * @param GrainService $grainService
     * 
     * @return JsonResponse
     */
    public function delete(GrainService $grainService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $grainService->delete($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/grain/duplicate", methods={"POST"})
     *
     * @param GrainService $grainService
     * @return JsonResponse
     */
    public function duplicate(GrainService $grainService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $grainPosition = $grainService->duplicate($data);

        return $this->setReturn(self::OK, ['position' => $grainPosition]);
    }

    /**
     * @Route("/grain/switch_position")
     *
     * @param GrainService $grainService
     * 
     * @return JsonResponse
     */
    public function switchPosition(GrainService $grainService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $grainService->switchPosition($data);

        return $this->setReturn(self::OK);
    }


    /**
     * @Route("/grain/has_question", methods={"GET"})
     *
     * @param GrainService $grainService
     * 
     * @return JsonResponse
     */
    public function hasQuestion(GrainService $grainService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $hasQuestion = $grainService->hasQuestion($data['id_grain']);

        return $this->setReturn(self::OK, ['has_question' => $hasQuestion]);

    }
}