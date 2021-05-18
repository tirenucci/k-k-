<?php

namespace App\Controller;

use App\Service\BlockService;
use App\Controller\LibController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;



class BlockController extends LibController
{

    /**
     * @Route("/block/save", methods={"POST"})
     *
     * @param BlockService $blockService
     * @param Request $request
     * @return JsonResponse le block
     */
    public function saveBlock(BlockService $blockService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);
        $block = $blockService->save($data);
        

        return $this->setReturn(self::CREATED, $block);
    }


    /**
     * @Route("/block/position", methods={"POST"})
     *
     * @param BlockService $blockService
     * @param Request $request
     * @return JsonResponse
     */
    public function switchPosition(BlockService $blockService, Request $request)
    {
        $data = $this->getBody($request);
        $block = $blockService->switchPosition($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/block/delete", methods={"DELETE"})
     *
     * @param BlockService $blockService
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteBlock(BlockService $blockService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);
        
        if ($blockService->delete($data))
        {
            return $this->setReturn(self::OK);
        }
        else
        {
            return $this->setReturn(self::NOT_FOUND);
        }

    }

    /**
     * @Route("/block/get", methods={"GET"})
     *
     * @param BlockService $blockService
     * @param Request $request
     * @return JsonResponse retourne les proprièter des block
     */
    public function getProperties(BlockService $blockService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $propertie = $blockService->getParameter($data);

        if (!empty($propertie))
        {
            return $this->setReturn(self::OK, $propertie);
        }
        else
        {
            return $this->setReturn(self::NOT_FOUND);
        }
    }

    /**
     * @Route("/block/send", methods={"POST"})
     *
     * @param BlockService $blockService
     * @return JsonResponse retourne les proprièter des block
     */
    public function sendBlock(BlockService $blockService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $propertie = $blockService->sendBlock($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/block/duplicate", methods={"POST"})
     *
     * @param BlockService $blockService
     * @return JsonResponse retourne les proprièter des block
     */
    public function duplicateBlock(BlockService $blockService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $propertie = $blockService->duplicateBlock($data);
        
        return $this->setReturn(self::OK);
    }

	/**
	 * @Route("/block/froala/upload", methods={"POST"})
	 *
	 * @param BlockService $blockService
	 * @param Request      $request
	 *
	 * @return JsonResponse
	 */
    public function uploadFileFroala(BlockService $blockService, Request $request) : JsonResponse
    {
        $file = $this->getFiles($request, 'file');
        $data = $this->getAllGet($request);
        $path = $blockService->uploadMediaFroala($file, $data, '/block/froala/upload');
        if ($path !== "" && $path !== 'nospace')
        {
            return $this->setReturn(self::OK, ['link' => $path]);
        }
        elseif($path === null)
        {
        	return $this->setReturn(self::ACCESS_DENIED);
        }
        elseif($path === 'nospace')
        {
	        return $this->setReturn(self::NO_SPACE);
        }

	    return $this->setReturn(self::CONFLICT);
    }
}