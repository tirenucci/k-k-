<?php

namespace App\Controller;

use App\Service\QuestionService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class QuestionController extends LibController
{

    /**
     * @Route("/grain/question/save", methods={"POST"})
     *
     * @return JsonResponse
     */
    public function save(QuestionService $questionService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $block = $questionService->save($data);

        return $this->setReturn(self::CREATED,$block);
    }

    /**
     * @Route("/grain/question/get", methods={"GET"})
     *
     * @param BlockService $blockService
     * @return JsonResponse retourne les proprièter des block
     */
    public function getProperties(QuestionService $questionService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $propertie = $questionService->getParameter($data);

        if (!empty($propertie))
        {
            return $this->setReturn(self::OK, $propertie);
        }
        else
        {
            return $this->setReturn(self::NOT_FOUND);
        }
    }
}
