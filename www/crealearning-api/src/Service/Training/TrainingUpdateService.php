<?php

namespace App\Service\Training;

use App\Entity\Training;
use App\Repository\SkinRepository;
use App\Repository\UserRepository;
use App\Repository\SocietyRepository;
use App\Repository\TrainingLanguageRepository;
use App\Repository\TrainingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use App\Service\Training\TrainingReaderService;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\Security;

class TrainingUpdateService
{

    private $trainingRepository;
    private $skinRepository;
    private $entityManagerInterface;
    private $trainingReaderService;
    private $trainingLanguageRepository;
    private $security;

    public function __construct (TrainingRepository $trainingRepository,
                                EntityManagerInterface $entityManagerInterface,
                                TrainingReaderService $trainingReaderService,
                                SkinRepository $skinRepository,
                                TrainingLanguageRepository $trainingLanguageRepository,
                                Security $security
                                )
                                {
        $this->trainingRepository = $trainingRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->trainingReaderService = $trainingReaderService;
        $this->skinRepository = $skinRepository;
        $this->trainingLanguageRepository = $trainingLanguageRepository;
        $this->security = $security;
    }
    
    function test($obj_a, $obj_b){
        return $obj_a->getId() - $obj_b->getId();
    }

    public function updateLogo(int $id, File $image, ?array $languages)
    {
        $tmpTraining = $this->trainingRepository->findOneBy(['id' => $id]);

        if ($tmpTraining->getLogo() !== "")
        {
            $filesystem = new Filesystem();
            $filesystem->remove($_ENV['ASSETS_PATH'] . 'trainings/' . $tmpTraining->getSociety()->getName() . '/' . $id . '/' . $tmpTraining->getLogo());
        }

        

        

        if ($languages !== null)
        {
            $langs = $tmpTraining->getLanguage();


            $originalLang = [];
            $givenLang  = [];

            foreach ($tmpTraining->getLanguage() as $l)
            {
                $originalLang[] = $l->toArray();
            }

            foreach ($langs as $l)
            {
                $givenLang[] = $l->toArray();
            }

            $diff = array_diff(...$originalLang, ...$languages);


            if (!empty($diff))
            {
                foreach($diff as $deletedLanguage)
                {
                    $tmpTraining->removeLanguage($deletedLanguage);
                }
            }

            
            $diff = array_diff(...$languages, ...$originalLang);

            if (!empty($diff))
            {
                foreach($diff as $deletedLanguage)
                {
                    $tmpTraining->addLanguage($deletedLanguage);
                }
            }
        }
        else
        {
            $codeLang = $this->security->getUser()->getLanguage()->getLanguageCode();

            $l = $this->trainingLanguageRepository->findOneBy(['iso_code_6391' => $codeLang]);
        }

        $tmpTraining->setLogo($_ENV['ASSETS_URL'] . 'trainings/' . $tmpTraining->getSociety()->getId() . '/' . $tmpTraining->getUuid() . '/' . 'crealearning-logo.' . $image->guessExtension());
        $image->move($_ENV['ASSETS_PATH'] . 'trainings/' . $tmpTraining->getSociety()->getId() . '/' . $tmpTraining->getUuid() . '/', 'crealearning-logo.' . $image->guessExtension());


        $this->entityManagerInterface->persist($tmpTraining);
        $this->entityManagerInterface->flush();
    }

    public function update(array $data, ?File $image, ?int $skin_id, ?array $languages)
    {
        $tmpTraining = $this->trainingRepository->findOneBy(['id' => $data['id']]);

        if ($skin_id !== null)
        {
            $skin = $this->skinRepository->findOneBy(['id' => $skin_id]);
            $tmpTraining->setSkin($skin);
        }

        

        if ($languages !== null)
        {

            $langs = array();
    
            foreach($languages as $l)
            {
                $lang = $this->trainingLanguageRepository->findOneBy(['label_fr' => $l['label_fr']]);
    
                array_push($langs, $lang);
            }



            $diff = array_udiff($tmpTraining->getLanguage()->toArray(), $langs, 
                                function ($obj_a, $obj_b) 
                                {
                                    return $obj_a->getLabelFr() != $obj_b->getLabelFr();
                                }
                            );

            if (!empty($diff))
            {
                foreach($diff as $deletedLanguage)
                {
                    $tmpTraining->removeLanguage($deletedLanguage);
                }
            }

            
            $diff = array_udiff($langs, $tmpTraining->getLanguage()->toArray(), 
                                function($obj_a, $obj_b)
                                {
                                    return $obj_a->getLabelFr() != $obj_b->getLabelFr();   
                                }
                        );

            if (!empty($diff))
            {
                foreach($diff as $deletedLanguage)
                {
                    $tmpTraining->addLanguage($deletedLanguage);
                }
            }
        }
        else
        {
            $codeLang = $this->security->getUser()->getLanguage()->getLanguageCode();

            $l = $this->trainingLanguageRepository->findOneBy(['iso_code_6391' => $codeLang]);
        }

        $tmpTraining->setName($data['name']);
        $tmpTraining->setDescription($data['description']);
        $tmpTraining->setTag(!empty($data['tags']) ? $data['tags'] : "");
        $tmpTraining->setVersion($data['version']);
        $tmpTraining->setLicense($data['license']);
        $tmpTraining->setShowPonderation($data['show_ponderation']);
        $tmpTraining->setStatus($data['status']);
        $tmpTraining->setDuration($data['duration']);
        $tmpTraining->setObjective($data['objective']);
        $tmpTraining->setEducMeans($data['educ_means']);
        $tmpTraining->setTechMeans($data['tech_means']);
        $tmpTraining->setManagement($data['management']);
        $tmpTraining->setAchievements($data['achievements']);
        $tmpTraining->setPublicTarget($data['public_target']);
        $tmpTraining->setPrerequisite($data['prerequisite']);
        $tmpTraining->setUpdatedAt(new \DateTime());

        $this->entityManagerInterface->persist($tmpTraining);
        $this->entityManagerInterface->flush();

        return $this->trainingReaderService->getOne($data);
    }
}

