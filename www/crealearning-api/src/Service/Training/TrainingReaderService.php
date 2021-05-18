<?php

namespace App\Service\Training;

use App\Entity\Training;
use App\Entity\TrainingAuthor;
use App\Repository\GrainRepository;
use App\Repository\SocietyRepository;
use App\Repository\TrainingRepository;
use App\Repository\TrainingAuthorRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Constraints\Uuid;

class TrainingReaderService
{

    private $trainingRepository;
    private $grainRepository;
    private $trainingAuthorRespository;
    private $societyRepository;
    private $security;
    

    public function __construct (TrainingRepository $trainingRepository, 
                                GrainRepository $grainRepository,
                                TrainingAuthorRepository $trainingAuthorRepository,
                                SocietyRepository $societyRepository,
                                Security $security
                                ){
        $this->trainingRepository = $trainingRepository;
        $this->grainRepository = $grainRepository;
        $this->trainingAuthorRespository = $trainingAuthorRepository;
        $this->societyRepository = $societyRepository;
        $this->security = $security;
    }

    /**
     * Méthode qui renvoie tous les trainings correspondants à une société
     *
     * @param array $data
     * @return array
     */
    public function takeAllTrainings (array $data) : array
    {
        $trainingsAndCount = null;

        if($this->security->getUser()->getRole() === 'ROLE_ADMINISTRATOR')
        {
            $trainingsAndCount = $this->trainingRepository->sortAllBySociety($data['order'], $data['target'], $data['status'], $data['wordSearch'], $this->security->getUser()->getSociety(), $this->security->getUser(), $data['page']);
        }
        else
        {
            $trainingsAndCount = $this->trainingRepository->sortAllBy($data['order'], $data['target'], $data['status'], $data['wordSearch'], $this->security->getUser()->getSociety(), $this->security->getUser(), $data['page']);
        }

        //On vérifie si la requête retourne des éléments
        $data = [];
        foreach ($trainingsAndCount['trainings'] as $training)
        {
            $tags = explode(', ', $training->getTag());

            $tag = array_slice($tags, 0, 3);
            
            //Récupération des Auteurs

            $authors = $training->getAuthor();
            
            $authorName = [];

            foreach($authors as $author)
            {
                if ($author->getIsEditor())
                {
                    $authorName[] = [
                        'id' => $author->getAuthor()->getId(),
                        'name' => $author->getAuthor()->getFirstName() . ' ' . $author->getAuthor()->getLastName()
                    ];
                }
            }

            //Constitution des données pour l'API
            $description = $training->getDescription();
            if (strlen($description) > 70)
            {
                $description = substr($training->getDescription(), 0, 70).'...';
            }
            
            $data[]=[
                'id' => $training->getId(),
                'name' => $training->getName(),
                'description' => $description,
                'author' => $authorName,
                'version' => $training->getVersion(),                
                'created_at' => $training->getCreatedAt()->format('d-m-Y à H:i'),
                'updated_at' => $training->getUpdatedAt()->format('d-m-Y à H:i'),
                'disk_space' => $training->getDiskSpace(),
                'status' => $training->getStatus(),
                'duration' => $training->getDuration(),
                'uuid' => $training->getUuid(),
                'tag' => $tag
            ];

        }
        
        return ['training' => $data, 'count' => $trainingsAndCount['count'][1]];
    }
    /**
     * Recupère un seul module
     *
     * @param array $data l'id envoyer par le coté client
     * @return array le module avec les informations qu'il faut
     */
    public function getOne(array $data) : array
    {
        $tmpTraining = $this->trainingRepository->findOneBy(['id' => $data['id']]);

        $creator = $this->trainingAuthorRespository->findOneBy(['training' => $data['id'], 'is_owner' => true]);

        $allGrain = $this->grainRepository->findBy(['training' => $tmpTraining]);

        $grainDuration = 0;

        foreach($allGrain as $grain)
        {
            $grainDuration += $grain->getDuration();
        }

        $training = [
            'id' => $tmpTraining->getId(),
            'name' => $tmpTraining->getName(),
            'description' => $tmpTraining->getDescription(),
            'version' => $tmpTraining->getVersion(),
            'license' => $tmpTraining->getLicense(),
            'show_ponderation' => $tmpTraining->getShowPonderation(),
            'status' => $tmpTraining->getStatus(),
            'duration' => $tmpTraining->getDuration(),
            'uuid' => $tmpTraining->getUuid(),
            'language_code' => $tmpTraining->getLanguageCode(),
            'logo' => $tmpTraining->getLogo(),
            'logo_position' => $tmpTraining->getLogoPosition(),
            'tags' => $tmpTraining->getTag(),
            'created_at' => $tmpTraining->getCreatedAt()->format('d/m/Y à H:i'),
            'updated_at' => $tmpTraining->getUpdatedAt()->format('d/m/Y à H:i'),
            'disk_space' => $tmpTraining->getDiskSpace(),
            'grain_duration' => $grainDuration,
            'grain_count' => count($allGrain),
            'society_id' => $tmpTraining->getSociety()->getId(),
            'skin_path' => $tmpTraining->getSkin() !== null ? $tmpTraining->getSkin()->getSkinTheme()->getFolderName() . '/' . $tmpTraining->getSkin()->getFolderName() : null,
            'objective' => $tmpTraining->getObjective(),
            'educ_means' => $tmpTraining->getEducMeans(),
            'tech_means' => $tmpTraining->getTechMeans(),
            'management' => $tmpTraining->getManagement(),
            'achievements' => $tmpTraining->getAchievements(),
            'public_target' => $tmpTraining->getPublicTarget(),
            'prerequisite' => $tmpTraining->getPrerequisite(),
            'firstName' => $creator->getAuthor()->getFirstName(),
            'lastName' => $creator->getAuthor()->getLastName()
        ];

        return $training;
    }

    public function getTrainingPath(Training $training) : string
    {
        return $_ENV['ASSETS_PATH'] . $training->getId() . '/resources/';
    }
}

