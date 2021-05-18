<?php

namespace App\Controller;

use App\Controller\LibController;
use App\Service\TrainingAuthorService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class TrainingAuthorController extends LibController
{

    /**
     * @Route("/training_author/right", methods={"GET"})
     *
     * @param TrainingAuthorService $trainingAuthorService
     * @return JsonResponse
     */
    public function getAllAuthor(TrainingAuthorService $trainingAuthorService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $authors = $trainingAuthorService->getAuthorByTraining($data);

        return $this->setReturn(self::OK, $authors);
    }

    /**
     * @Route("/training_author/add", methods={"POST"})
     *
     * @param TrainingAuthorService $trainingAuthorService
     * @return JsonResponse
     */
    public function addAuthor(TrainingAuthorService $trainingAuthorService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $trainingAuthorService->addAuthor($data);

        return $this->setReturn(self::OK);
    }

    

    /**
     * @Route("/training_author/delete", methods={"DELETE"})
     *
     * @param TrainingAuthorService $trainingAuthorService
     * @return JsonResponse
     */
    public function deleteAuthor(TrainingAuthorService $trainingAuthorService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $trainingAuthorService->deleteAuthor($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/training_author/update", methods={"PUT"})
     *
     * @param TrainingAuthorService $trainingAuthorService
     * @return JsonResponse
     */
    public function updateAuthor(TrainingAuthorService $trainingAuthorService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $trainingAuthorService->updateAuthor($data);

        return $this->setReturn(self::OK);
    }


    /**
     * @Route("/training_author/get_right", methods={"GET"})
     */
    public function getRight(TrainingAuthorService $trainingAuthorService, Request $request)
    {
        $data = $this->getAllGet($request);

        $right = $trainingAuthorService->getRight($data);

        return $this->setReturn(self::OK, $right);
    }
}
