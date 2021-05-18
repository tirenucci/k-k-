<?php

namespace App\Service;

use App\Entity\ActivatedLanguage;
use App\Entity\TraingLang;
use App\Entity\TrainingLang;
use App\Repository\TrainingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;
use App\Repository\TrainingLanguageRepository;
use App\Repository\ActivatedLanguageRepository;

class LangService
{

    private $trainingLanguageRepository;
    private $trainingRepository;
    private $activateLanguage;
    private $security;

    public function __construct (
        TrainingLanguageRepository $trainingLanguageRepository,
        TrainingRepository $trainingRepository, 
        ActivatedLanguageRepository $activatedLanguageRepository,
        Security $security
    )
    {
        $this->trainingLanguageRepository = $trainingLanguageRepository;
        
        $this->trainingRepository = $trainingRepository;

        $this->activateLanguage = $activatedLanguageRepository;

        $this->security = $security;
    }

    public function getLanguageByTraining(array $data) : array
    {
        $training = $this->trainingRepository->findOneBy(['id' => $data['id']]);

        $tmpLangs = $training->getLanguage();

        

        $langs = array();

        foreach($tmpLangs as $lang)
        {
            $langs[] = $lang->toArray();
        }

        usort($langs, function($a, $b)
             {
                 if ($a["position"] == $b["position"])
                     return (0);
                 return (($a["position"] < $b["position"]) ? 1 : -1);
             });


        return $langs;
    }
    
    /**
     * Méthode qui renvoie toutes les langues
     *
     * @param array $data
     * @return array
     */
    public function takeAllLanguages (array $data) : array
    {
        $langs = $this->activateLanguage->findBy(['society' => $this->security->getUser()->getSociety()->getId()]);

        $data = [];
        foreach ($langs as $lang)
        {
            //Constitution des données pour l'API
            $data[] = $lang->toArray();

        }
        return $data;
    }

    /**
     * Permet de récuperer une langue
     *
     * @param array $data
     * @return array
     */
    public function getLanguage(array $data) : array
    {
        $langTmp = $this->trainingLanguageRepository->findOneBy(['iso_code_6391' => $data['lang']]);

	    return $langTmp->toArray();
    }
}