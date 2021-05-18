<?php

namespace App\Service;

use App\Repository\OfferRepository;

class OfferService
{

    private $offerRepository;

    function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    /**
     * Permet d'afficher les offres
     *
     * @return array
     */
    public function getOffers() : array
    {
        $offers = $this->offerRepository->findAll();

        $data = [];
        foreach ($offers as $offer)
        {
            $data[] = $offer->toArray();
        }

        return $data;
    }
}