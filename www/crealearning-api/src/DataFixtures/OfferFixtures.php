<?php

namespace App\DataFixtures;

use App\Entity\Offer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class OfferFixtures extends Fixture 
{

    public const OFFER_REFERENCE = 'offer';

    public function load(ObjectManager $manager)
    {
        $offer = new Offer();
        $offer->setName('org');
        $offer->setLabel('Organisation');
        $manager->persist($offer);
        $offer = new Offer();
        $offer->setName('open');
        $offer->setLabel('Open Créa');
        $manager->persist($offer);
        $offer = new Offer();
        $offer->setName('pro');
        $offer->setLabel('Open Créa Pro');
        $manager->persist($offer);        
        $offer = new Offer();
        $offer->setName('Logipro');
        $offer->setLabel('Logipro');
        $manager->persist($offer);


        $manager->flush();
        $this->addReference(self::OFFER_REFERENCE, $offer);
    }
}