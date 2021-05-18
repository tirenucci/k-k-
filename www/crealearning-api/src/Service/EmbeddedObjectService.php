<?php

namespace App\Service;

use App\Entity\IntegratedObject;
use App\Entity\IntegratedObjectTheme;
use App\Repository\IntegratedObjectRepository;
use App\Repository\IntegratedObjectThemeRepository;
use Symfony\Component\Filesystem\Filesystem;
use Doctrine\ORM\EntityManagerInterface;

class EmbeddedObjectService
{

    private $integratedObjectRepository;
    private $integratedObjectThemeRepository;
    private $entityManagerInterface;
    
    public function __construct (IntegratedObjectThemeRepository $integratedObjectThemeRepository, 
                                IntegratedObjectRepository $integratedObjectRepository, 
                                EntityManagerInterface $entityManagerInterface)
    {
        $this->integratedObjectThemeRepository = $integratedObjectThemeRepository;
        $this->integratedObjectRepository = $integratedObjectRepository;
        $this->entityManagerInterface = $entityManagerInterface;
    }
    
    /**
     * Méthode qui renvoi tout les thèmes 
     *
     * @return array
     */
    public function takeAllThemes () : array
    {
        $eoThemes = $this->integratedObjectThemeRepository->findBy([], ['position' => 'ASC']);
        $data = [];
        foreach ($eoThemes as $eoTheme)
        {            
            $data[]=$eoTheme->toArray();
        }
        return $data;
    }

    /**
     * Méthode qui renvoi tout les objets intégrés de chaque thème
     */
    public function takeAllEOByTheme () : array
    {
        $eoThemes = $this->integratedObjectThemeRepository->findBy([], ['position' => 'ASC']);
        $data = [];
        foreach ($eoThemes as $eoTheme)
        {
            //Constitution des données pour l'API
            $eos = $this->integratedObjectRepository->findBy(['integrated_object_theme' => $eoTheme], ['position' => 'ASC']);

            $data[$eoTheme->getTitle()] = array();

            foreach($eos as $eo)
            {
                array_push($data[$eoTheme->getTitle()], $eo->toArray());
            }

        }
        return $data;
    }

    /**
     * Récupère les infos d'un objet intégré par son id
     *
     * @param array $data
     * @return array
     */
    public function getEoData(array $data) : array
    {
        $eo = $this->integratedObjectRepository->findOneBy(['id' => $data['id']]);

        return $eo->toArray();
    }

    /**
     * Récupère les infos du thème des objets intégrés par son id
     *
     * @param array $data
     * @return array
     */
    public function getEoThemeData(array $data) : array
    {
        $eoTheme = $this->integratedObjectThemeRepository->findOneBy(['id' => $data['theme_id']]);

        return $eoTheme->toArray();
    }

    /**
     * Met à jour les infos d'un objet intégré
     *
     * @param array $data
     * @return array
     */
    public function updateEO(array $data) :array
    {
        $eo = $this->integratedObjectRepository->findOneBy(['id' => $data['id']]);

        $eo->setIntegratedObjectTheme($this->integratedObjectThemeRepository->findOneBy(['id' => $data['integrated_object_theme_id']]));
        $eo->setTitle($data['title']);
        $eo->setPosition($data['position']);
        $eo->setUrl($data['url']);
        $eo->setDescription($data['description']);
        $eo->setLogo($data['logo']);

        $this->entityManagerInterface->persist($eo);
        $this->entityManagerInterface->flush();
        
        return $eo->toArray();
    }

    /**
     * Permet de créer un thème
     *
     * @param array
     * @return IntegratedObjectTheme 
     */
    public function createTheme(array $data) : array
    {
        $eoTheme = new IntegratedObjectTheme();
        $eoTheme->setPosition($data['themePosition']);
        $eoTheme->setTitle($data['themeTitle']);

        $this->entityManagerInterface->persist($eoTheme);
        $this->entityManagerInterface->flush();

        return $eoTheme->toArray();
    }

     /**
     * Permet de créer un objet intégré
     *
     * @param array
     * @return IntegratedObject
     */
    public function createEO(array $data) : array
    {
        $eo = new IntegratedObject();
        $eo->setIntegratedObjectTheme($this->integratedObjectThemeRepository->findOneBy(['id' => $data['theme']]));
        $eo->setPosition($data['position']);
        $eo->setTitle($data['title']);
        $eo->setUrl($data['url']);
        $eo->setDescription($data['description']);
        $eo->setLogo($data['logo']);

        $this->entityManagerInterface->persist($eo);
        $this->entityManagerInterface->flush();

        return $eo->toArray();
    }

    /**
     * Supprime un thème
     *
     * @param array $data
     * @return array
     */
    public function deleteTheme(array $data): array
    {
        $eoTheme = $this->integratedObjectThemeRepository->findOneBy(['id' => $data['id']]);
        $this->entityManagerInterface->remove($eoTheme);
        $this->entityManagerInterface->flush();

        return $eoTheme->toArray();
    }

    /**
     * Supprime un objet intégré
     *
     * @param array $data
     * @return array
     */
    public function deleteEO(array $data): array
    {
        $eo = $this->integratedObjectRepository->findOneBy(['id' => $data['id']]);
        $this->entityManagerInterface->remove($eo);
        $this->entityManagerInterface->flush();

        return $eo->toArray();
    }
}