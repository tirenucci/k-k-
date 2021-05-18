<?php


namespace App\Controller;

use App\Service\LangService;
use App\Controller\LibController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class TrainingLanguageController extends LibController
{
	/**
	 * @Route ("/training_language/get_all", methods = {"GET"})
	 *
	 * @param LangService $langService : Service qui récupère toutes les données nécessaires pour afficher une liste de
	 *                                 trainings
	 *
	 * @param Request     $request
	 *
	 * @return JsonResponse 200 si c'est OK
	 */
	public function getTrainingLanguages(LangService $langService, Request $request): JsonResponse
	{
		$data = $this->getAllGet($request);
		$langs = $langService->takeAllLanguages($data);
		return $this->setReturn(self::OK, $langs);
	}

	/**
	 * @Route("/training_language/get_all_by_training", methods={"GET"})
	 *
	 * @param LangService $langService
	 *
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function getLanguagesByTraining(LangService $langService, Request $request): JsonResponse
	{
		$data = $this->getAllGet($request);

		$langs = $langService->getLanguageByTraining($data);

		return $this->setReturn(self::OK, $langs);
	}

	/**
	 * @Route("/training_language/get_one", methods={"GET"})
	 *
	 * @param LangService $langService
	 *
	 * @return JsonResponse
	 */
	public function getOneLanguage(LangService $langService, Request $request): JsonResponse
	{
		$data = $this->getAllGet($request);

		$lang = $langService->getLanguage($data);

		return $this->setReturn(self::OK, $lang);
	}
}