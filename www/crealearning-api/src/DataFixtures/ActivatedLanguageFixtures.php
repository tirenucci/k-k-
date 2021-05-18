<?php

namespace App\DataFixtures;

use App\Entity\ActivatedLanguage;
use App\Repository\SocietyRepository;
use App\Repository\TrainingLanguageRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ActivatedLanguageFixtures extends Fixture implements DependentFixtureInterface
{
    
    private $societyRepository;
    private $trainingLanguageRepository;

    public function __construct(SocietyRepository $societyRepository, TrainingLanguageRepository $trainingLanguageRepository)
    {
        $this->societyRepository = $societyRepository;
        $this->trainingLanguageRepository = $trainingLanguageRepository;
    }

    public function load(ObjectManager $manager)
    {
        for ($i = 1; $i < 12; $i++)
        {
            $en = new ActivatedLanguage();
            $en->setLanguage($this->trainingLanguageRepository->findOneBy(['id' => $i]));
            $en->setSociety($this->societyRepository->findOneBy(['id' => 1]));
            if ($i <= 2)
            {
                $en->setActivated(true);
            }
            else
            {
                $en->setActivated(false);
            }
            $manager->persist($en);
        }

        
       

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            SocietyFixtures::class,
            TrainingLanguageFixture::class
        );
    }
}
