<?php

namespace App\Service;

use App\Entity\Society;
use App\Entity\ActivatedLanguage;
use App\Repository\ActivatedLanguageRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\TrainingLanguageRepository;

class ActivatedLanguageService
{

    private $trainingLanguageRepository;
    private $entityManagerInterface;
    private $activatedLanguageRepository;

    public function __construct(
                                    TrainingLanguageRepository $trainingLanguageRepository,
                                    EntityManagerInterface $entityManagerInterface,
                                    ActivatedLanguageRepository $activatedLanguageRepository
                                )
    {
        $this->trainingLanguageRepository = $trainingLanguageRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->activatedLanguageRepository = $activatedLanguageRepository;
    }

    public function generateDefault(Society $society) : void
    {
        $languages = $this->trainingLanguageRepository->findAll();

        foreach ($languages as $lang)
        {
            $language = new ActivatedLanguage();
            $language->setSociety($society);
            $language->setLanguage($lang);
            if ($lang->getIsoCode6391() === "en" ||$lang->getIsoCode6391() === "fr")
            {
                $language->setActivated(true);
            }
            else
            {
                $language->setActivated(false);
            }

            $this->entityManagerInterface->persist($language);
        }
        $this->entityManagerInterface->flush();
    }
    public function update(array $language)
    {

        $l = $this->trainingLanguageRepository->findOneBy(['iso_code_6391' => $language['iso_code_6391']]);

        $activatedLanguage = $this->activatedLanguageRepository->findOneBy(['language' => $l->getId()]);
        $activatedLanguage->setActivated($language['active'] === "true");
        $this->entityManagerInterface->persist($activatedLanguage);
        $this->entityManagerInterface->flush();

        return $activatedLanguage;
    }
}
