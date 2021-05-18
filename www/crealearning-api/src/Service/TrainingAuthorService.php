<?php

namespace App\Service;

use App\Entity\TrainingAuthor;
use App\Repository\UserRepository;
use App\Repository\TrainingRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\TrainingAuthorRepository;
use Symfony\Component\Security\Core\Security;

class TrainingAuthorService
{

    private $trainingAuthorRepository;
    private $userRepository;
    private $trainingRepository;
    private $entityManagerInterface;
    private $security;

    public function __construct(
                                TrainingAuthorRepository $trainingAuthorRepository,
                                UserRepository $userRepository,
                                EntityManagerInterface $entityManagerInterface,
                                TrainingRepository $trainingRepository,
                                Security $security
                                )
    {
        $this->trainingAuthorRepository = $trainingAuthorRepository;
        $this->userRepository = $userRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->trainingRepository = $trainingRepository;
        $this->security = $security;
    }

    public function getAuthorByTraining(array $data) : array
    {
        $tmpTrainingAuthor = $this->trainingAuthorRepository->findBy(['training' => $data['id_training']]);

        $trainingAuthor = array();

        foreach($tmpTrainingAuthor as $author)
        {
            array_push($trainingAuthor, $author->toArray());
        }
        
        return $trainingAuthor;
    }

    public function addAuthor(array $data) : void
    {
        $author = $this->userRepository->findOneBy(['id' => $data['id_user']]);
        $training = $this->trainingRepository->findOneBy(['id' => $data['id_training']]);

        $newAuthor = new TrainingAuthor();

        $newAuthor->setAuthor($author);
        $newAuthor->setTraining($training);
        
        if ($newAuthor->getAuthor()->getRole() === "ROLE_USER")
        {
            $newAuthor->setIsEditor(false);
            $newAuthor->setIsOwner(false);
        }
        else
        {
            $newAuthor->setIsEditor(true);
            $newAuthor->setIsOwner(false);
        }

        $this->entityManagerInterface->persist($newAuthor);
        $this->entityManagerInterface->flush();
    }

    public function deleteAuthor(array $data) : void
    {
        $author = $this->trainingAuthorRepository->findOneBy(['training' => $data['training_id'], 'author' => $data['user_id']]);

        $this->entityManagerInterface->remove($author);
        $this->entityManagerInterface->flush();
    }

    

    public function updateAuthor(array $data) : void
    {
        $author = $this->trainingAuthorRepository->findOneBy(['training' => $data['training_id'], 'author' => $data['user_id']]);
        
        $author->setIsEditor($data['is_editor']);

        $this->entityManagerInterface->persist($author);
        $this->entityManagerInterface->flush();
    }

    public function getRight(array $data) : array
    {
        if ($this->security->getUser()->getRole() !== 'ROLE_ADMINISTRATOR')
        {
            $author = $this->trainingAuthorRepository->findOneBy(['training' => $data['id_training'],'author' => $this->security->getUser()->getId()]);
            return $author->toArray();
        }
        else
        {
            return ['is_editor' => true];
        }
    }
}
