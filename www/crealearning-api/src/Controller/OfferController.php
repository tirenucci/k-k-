<?php

namespace App\Controller;

use App\Service\OfferService;
use App\Controller\LibController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class OfferController extends LibController
{

    /**
     * @Route("/offer/all", methods={"GET"})
    *
    * @param Request $request
    * @param OfferService $offerService
    * @return JsonResponse
    */
    public function getOffers(OfferService $offerService) : JsonResponse
    {
        $offers = $offerService->getOffers();

        return $this->setReturn(self::OK, $offers);     
    }
}