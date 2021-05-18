<?php


namespace App\Controller;

use App\Service\UserService;
use App\Controller\LibController;
use App\Service\SkinThemeService;
use Symfony\Component\HttpFoundation\Request;
use App\Service\Training\TrainingCreateService;
use App\Service\Training\TrainingDeleteService;
use App\Service\Training\TrainingReaderService;
use App\Service\Training\TrainingUpdateService;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\Training\TrainingDuplicateService;
use Symfony\Component\HttpFoundation\JsonResponse;

class TrainingController extends LibController
{
	/**
	 * @Route("/training/get_all", methods = {"GET"})
	 *
	 * @param TrainingReaderService $serviceReaderTraining : Service qui récupère toutes les données nécessaires pour afficher une liste de trainings
	 * @param Request               $request
	 *
	 * @return JsonResponse 200 si c'est OK
	 */
    public function getTrainings(TrainingReaderService $serviceReaderTraining, Request $request
                                    ) : JsonResponse
    {
        $data = $this->getAllGet($request);
        $trainings = $serviceReaderTraining->takeAllTrainings($data);
        
        return $this->setReturn(self::OK, $trainings);
    }


	/**
	 * @Route("/training/create", methods={"POST"})
	 *
	 * @param TrainingCreateService $serviceCreateTraining
	 * @param Request               $request
	 *
	 * @return JsonResponse
	 */
    public function createTraining(TrainingCreateService $serviceCreateTraining, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);
        $trainingId = $serviceCreateTraining->createTraining($data);
        return $this->setReturn(self::CREATED, ['id' => $trainingId]);       
    }

	/**
	 * @Route("/training/get_all_theme", methods={"GET"})
	 *
	 * @param SkinThemeService $skinThemeService
	 * @param Request          $request
	 *
	 * @return JsonResponse
	 */
    public function getAllTheme(SkinThemeService $skinThemeService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $allTheme = $skinThemeService->getAllThemeForTraining($data);
        
        return $this->setReturn(self::OK, $allTheme);
    }

    /**
     * @Route("/training/delete", methods={"DELETE"})
     *
     * @param TrainingDeleteService $trainingDeleteService
     * @return JsonResponse
     */
    public function deleteTraining(TrainingDeleteService $trainingDeleteService, Request $request): JsonResponse
    {
        $data = $this->getBody($request);

        if ($trainingDeleteService->delete($data)){
            return $this->setReturn(self::OK);
        }
        return $this->setReturn(self::NOT_FOUND);
    }

    /**
     * @Route("/training/duplique", methods={"POST"})
     *
     * @param TrainingDuplicateService $trainingDuplicateService
     * @return JsonResponse
     */
    public function duplique(TrainingDuplicateService $trainingDuplicateService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);
        
        if ($trainingDuplicateService->duplicate($data))
        {
            return $this->setReturn(self::CREATED);
        }
        else
        {
            return $this->setReturn(self::NOT_FOUND);
        }
    }

    /**
     * @Route("/training/get", methods={"GET"})
     *
     * @param TrainingReaderService $trainingReaderService
     * @return JsonResponse
     */
    public function getTraining(TrainingReaderService $trainingReaderService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $training = $trainingReaderService->getOne($data);

        return $this->setReturn(self::OK, $training);
    }

    /**
     * @Route("/training/update", methods={"PUT"})
     *
     * @param TrainingUpdateService $trainingUpdateService
     * @param Request $request
     * @return JsonResponse
     */
    public function updateTrainingProperty(TrainingUpdateService $trainingUpdateService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);
        $updatedTraining = $trainingUpdateService->update($data['training'], null, $data['skin_id'], $data['languages']);

        return $this->setReturn(self::OK, $updatedTraining);
    }

    /**
     * @Route("/training/update_with_image", methods={"POST"})
     *
     * @param TrainingUpdateService $trainingUpdateService
     * @param Request $request
     * @return JsonResponse
     */
    public function updateTrainingPropertyWithImage(TrainingUpdateService $trainingUpdateService, Request $request) : JsonResponse
    {
        $image = $this->getFiles($request, 'image');
        $training = $request->request->get('id');
        $languages = json_decode($request->request->get('languages'), true);
        $skin_id = $request->request->get('skin_id');

        $newTraining = $trainingUpdateService->updateLogo($training, $image, $languages);

        return $this->setReturn(self::OK);
    }
}