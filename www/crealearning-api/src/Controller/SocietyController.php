<?php

namespace App\Controller;

use App\Service\SocietyService;
use App\Controller\LibController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class SocietyController extends LibController
{

    /**
     * @Route("/society/get_all", methods={"GET"})
    *
    * @param SocietyService $societyService
    * @return JsonResponse
    */
    public function getSocieties(SocietyService $societyService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $society = $societyService->getSocieties($data);

        return $this->setReturn(self::OK, $society);     
    }

    /**
     * @Route("/society/create", methods={"POST"})
    *
    * @param SocietyService $societyService
    * @return JsonResponse
    */
    public function createSociety(SocietyService $societyService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $society = $societyService->createSociety($data);

        return $this->setReturn(self::CREATED, $society);     
    }

    /**
     * @Route("/society/get_data", methods={"GET"})
     *
     * @param SocietyService $societyService
     * @return JsonResponse
     */
    public function getDataSociety(SocietyService $societyService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $society = $societyService->getDataSociety($data);

        return $this->setReturn(self::OK, $society);   
    }

	/**
	 * @Route("/society/update", methods={"PUT"})
	 *
	 * @param SocietyService $societyService
	 * @param Request        $request
	 *
	 * @return JsonResponse
	 */
    public function updateSociety(SocietyService $societyService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $society = $societyService->updateSociety($data);

        return $this->setReturn(self::OK, $society);   
    }

    /**
     * @Route("/society/delete", methods={"DELETE"})
    *
    * @param Request $request
    * @param SocietyService $societyService
    * @return JsonResponse
    */
    public function deleteSociety(SocietyService $societyService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        if ($societyService->deleteSociety($data)){
            return $this->setReturn(self::OK);
        }
        return $this->setReturn(self::NOT_FOUND);   
    }

    /**
     * @Route("/society/quota", methods={"GET"})
     *
     * @param SocietyService $societyService
     * @return JsonResponse
     */
    public function getPercent(SocietyService $societyService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $percent = $societyService->getQuotaPercent($data);

        return $this->setReturn(self::OK, $percent);
    }

	/**
	 * @Route("/society/upload", methods={"POST"})
	 *
	 * @param SocietyService $societyService
	 * @param Request        $request
	 *
	 * @return JsonResponse
	 */
    public function uploadAvatar(SocietyService $societyService, Request $request) : JsonResponse
    {
        $file = $this->getFiles($request, 'avatar');
        $society_id = $request->request->get('society_id');

        $societyService->uploadLogo($file, $society_id);

        return $this->setReturn(self::OK);
    }

	/**
	 * @Route("/society/edit", methods={"PATCH"})
	 *
	 * @param SocietyService $societyService
	 * @param Request        $request
	 *
	 * @return JsonResponse
	 */
	public function societyEdit(SocietyService $societyService, Request $request) : JsonResponse
	{
		$data = $this->getBody($request);

		$societyService->editSociety($data);

		return $this->setReturn(self::OK);
	}
}
