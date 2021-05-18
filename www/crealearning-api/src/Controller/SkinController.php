<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;

use App\Service\SkinService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class SkinController extends LibController
{
    /** 
     * @Route ("/skin/get_all_by_theme", methods = {"GET"})
     * 
     * @param SkinService $skinService
     * @return JsonResponse 
     */ 
    public function getThemes (SkinService $skinService, Request $request):JsonResponse 
    {
        dd($request);
        $data = $this->getAllGet($request);
        $skins = $skinService->takeTotalSkinByTheme($data);
        return $this->setReturn(self::OK, $skins);
    } 

    /**
     * @Route ("/skin/new", methods = {"POST"})
     *
     * @param SkinService $skinThemeService
     * @return JsonResponse
     */
    public function newSkin (SkinService $skinService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $newSkin = $skinService->insertSkin($data);

        return $this->setReturn(self::CREATED,$newSkin);

    }

    /**
     * @Route ("/skin/verify", methods = {"GET"})
     *
     * @param SkinService $skinService
     * @return JsonResponse
     */
    public function verifySkin (SkinService $skinService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        if ($skinService->verifySkin($data) === false)
        {
            return $this->setReturn(self::NOT_FOUND);
        }

        return $this->setReturn(self::OK);

    }

    /**
     * @Route ("/skin/update", methods = {"PUT"})
     *
     * @param SkinService $skinService
     * @return JsonResponse
     */
    public function updateSkin (SkinService $skinService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $skin = $skinService->updateSkin($data);

        return $this->setReturn(self::OK, $skin);

    }

    /**
     * @Route("/skin/update_one_skin", methods={"PUT"})
     *
     * @return JsonResponse
     */
    public function enableDisableOneSkin(SkinService $skinService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $skinService->enableDisableOneSkin($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/skin/update_all_skin", methods={"PUT"})
     *
     * @return JsonResponse
     */
    public function enableDisableAllSkin(SkinService $skinService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $skinService->enableDisableAllSkin($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/skin/extract_zip", methods={"POST"})
     *
     * @param SkinService $skinService
     * @return JsonResponse 200 si l'extraction c'est bien passer 404 si elle a échouer
     */
    public function extractZip(SkinService $skinService, Request $request) : JsonResponse
    {
        $zip = $this->getFiles($request, 'skin');
        $skin_folder = $this->getGet($request, 'skin_folder');
        $theme_folder = $this->getGet($request, 'theme_folder');
        
        if ($skinService->unzip($zip, $theme_folder, $skin_folder))
            return $this->setReturn(self::OK);


        return $this->setReturn(self::NOT_FOUND);
    }

    /**
     * @Route("/skin/get_one", methods={"GET"})
     *
     * @param SkinService $skinService
     * @return void
     */
    public function getSkinInformation(SkinService $skinService, Request $request)
    {
        $data = $this->getAllGet($request);

        $skin = $skinService->getOnSkin($data);

        return $this->setReturn(self::OK, $skin);
    }

    /**
     * @Route("/skin/delete", methods={"DELETE"})
     *
     * @param SkinService $skinService
     * @return JsonResponse
     */
    public function deleteSkin(SkinService $skinService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $skinService->delete($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/skin/update_with_form", methods={"PUT"})
     *
     * @param SkinService $skinService
     * @return JsonResponse
     */
    public function updateSkinWithForm(SkinService $skinService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $skinService->updateFromForm($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/skin/get_all", methods={"GET"})
     *
     * @param SkinService $skinService
     * @return JsonResponse
     */
    public function getAllSkin(SkinService $skinService) : JsonResponse
    {
        $skin = $skinService->getAllSkin();

        return $this->setReturn(self::OK, $skin);
    }
}