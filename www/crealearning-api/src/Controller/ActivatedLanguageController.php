<?php


namespace App\Controller;


use App\Service\ActivatedLanguageService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ActivatedLanguageController extends LibController
{
    /**
     * @Route("/activated_language/update", methods={"PATCH"})
     *
     * @param Request $request
     * @param ActivatedLanguageService $activatedLanguageService
     * @return JsonResponse
     */
    public function update(Request $request, ActivatedLanguageService $activatedLanguageService) : JsonResponse
    {
        $data = $this->getBody($request);

        $lang = $activatedLanguageService->update($data);

        if ($lang !== null)
            return $this->setReturn(self::OK );

        return $this->setReturn(self::CONFLICT);
    }



}