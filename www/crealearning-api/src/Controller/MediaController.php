<?php

namespace App\Controller;

use App\Service\MediaService;
use App\Controller\LibController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;


class MediaController extends LibController
{


	/**
	 * @Route("/media/convert", methods={"POST"})
	 *
	 * @param MediaService $mediaService
	 * @param Request      $request
	 *
	 * @return JsonResponse
	 */
    public function convert(MediaService $mediaService, Request $request)
    {
        $data = $this->getBody($request);

        if ($mediaService->convert($data))
        {
            return $this->setReturn(self::OK);
        }
        else
        {
            return $this->setReturn(self::NOT_FOUND);
        }
    }


	/**
	 * @Route("/media/upload", methods={"POST"})
	 *
	 * @param MediaService $mediaService
	 * @param Request      $request
	 *
	 * @return JsonResponse
	 */
    public function uploadMedia(MediaService $mediaService, Request $request) : JsonResponse
    {
        $media = $this->getFiles($request, 'media');
        $name = $this->getGet($request, 'name');
        $id_grain = $this->getGet($request, 'id_grain');

        $media = $mediaService->uploadMedia($media, $name, $id_grain);

        return $this->setReturn(self::CREATED, ['media' => $media]);
    }


    /**
     * @Route("/media/frame", methods={"GET"})
     *
     * @param MediaService $mediaService
     * @return JsonResponse
     */
    public function getImage(MediaService $mediaService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $image = $mediaService->getImage($data);

        return $this->setReturn(self::OK, ['image' => $image]);
    }

	/**
	 * @Route("/media/video/trim", methods={"PUT"})
	 *
	 * @param MediaService $mediaService
	 * @param Request      $request
	 *
	 * @return JsonResponse
	 */
    public function trimVideo(MediaService $mediaService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        if ($mediaService->trimVideo($data))
        {
            return $this->setReturn(self::OK);
        }
        else
        {
        	return $this->setReturn(self::NO_SPACE);
        }
        return $this->setReturn(self::NOT_FOUND);

    }

    /**
     * @Route("/media/image/free", methods={"GET"})
     *
     * @param MediaService $mediaService
     * @return JsonResponse
     */
    public function getAllFreeImage(MediaService $mediaService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);
        $images = $mediaService->getFreeImage($data);
        
        return $this->setReturn(self::OK, $images);

    }
}
