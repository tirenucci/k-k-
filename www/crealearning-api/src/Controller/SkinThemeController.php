<?php

namespace App\Controller;

use App\Service\SkinThemeService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class SkinThemeController extends LibController
{
    
    /**
     * @Route("/skintheme/get_all", methods={"GET"})
     *
     * @param SkinThemeService $skinThemeService Le service
     * @return JsonResponse retourne les theme
     */
    public function getAllTheme(SkinThemeService $skinThemeService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $theme = $skinThemeService->getAllTheme($data['society_id'], $data['wantSkin']);

        return $this->setReturn(self::OK, $theme);
    }

    /**
     * @Route("/skintheme/update", methods={"PUT"})
     *
     * @param SkinThemeService $skinThemeService
     * @return JsonResponse
     */
    public function updateSkinTheme(SkinThemeService $skinThemeService, Request $request): JsonResponse
    {
        $data = $this->getBody($request);

        $skinThemeService->updateSkinTheme($data);

        return $this->setReturn(self::OK);
    }


    /**
     * @Route("/skintheme/last_theme", methods={"GET"})
     *
     * @param SkinThemeService $skinThemeService
     * @return JsonResponse
     */
    public function getThemeNumber(SkinThemeService $skinThemeService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);
        
        $position = $skinThemeService->getHowManySkinTheme($data['society']);

        return $this->setReturn(self::OK, ['position' => $position]);
    }
    

    /**
     * @Route("/skintheme/create_theme", methods={"POST"})
     *
     * @param SkinThemeService $skinThemeService le service du skin theme
     * @return JsonResponse
     */
    public function createNewTheme(SkinThemeService $skinThemeService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $newTheme = $skinThemeService->createNewTheme($data);

        return $this->setReturn(self::CREATED, $newTheme);
    }

    /**
     * @Route("/skintheme/theme", methods={"GET"})
     *
     * @param SkinThemeService $skinThemeService le service du skin theme
     * @return JsonResponse
     */
    public function getOneThemeWithSkin(SkinThemeService $skinThemeService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $theme = $skinThemeService->getOneThemeById($data['id']);

        return $this->setReturn(self::OK, $theme);
    }

    /**
     * @Route("/skintheme/update_all", methods={"PUT"})
     *
     * @param SkinThemeService $skinThemeService le service du skin theme
     * @return JsonResponse
     */
    public function updateTheme(SkinThemeService $skinThemeService, Request $request) : JsonResponse
    {

        $data = $this->getBody($request);

        $skinThemeService->updateTheme($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/skintheme/delete", methods={"DELETE"})
     *
     * @param SkinThemeService $skinThemeService
     * @return JsonResponse
     */
    public function delete(SkinThemeService $skinThemeService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        if ($skinThemeService->delete($data))
        {
            return $this->setReturn(self::OK);
        }
        return $this->setReturn(self::NOT_FOUND);
    }
}