<?php

namespace App\Controller;

use App\Service\PreviewService;
use App\Controller\LibController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class PreviewController extends LibController
{

	/**
	 * @Route("/preview/{idtraininggrain}/{language}", methods={"GET"})
	 *
	 * @param string         $idtraininggrain
	 * @param string         $language
	 * @param PreviewService $previewService
	 *
	 * @return JsonResponse
	 */
    public function preview(string $idtraininggrain, string $language, PreviewService $previewService) : JsonResponse
    {
        $preview = $previewService->generatePreview($idtraininggrain, $language);
        
        return $this->setReturn(self::OK, $preview);
    }

	/**
	 * @Route("/preview/{idtraininggrain}", methods={"GET"})
	 *
	 * @param string         $idtraininggrain
	 * @param PreviewService $previewService
	 *
	 * @return JsonResponse
	 */
    public function previewWithoutLang(string $idtraininggrain, PreviewService $previewService) : JsonResponse
    {
        $preview = $previewService->generatePreview($idtraininggrain, null);
        
        return $this->setReturn(self::OK, $preview);
    }
}
