<?php

namespace App\Service\Training;

use App\Entity\Training;
use App\Entity\TrainingAuthor;
use App\Repository\TrainingRepository;
use App\Service\QuotaService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;

class TrainingDeleteService
{

    private $trainingRepository;
    private $entityManagerInterface;
    private $quotaService;

    public function __construct (TrainingRepository $trainingRepository,
                                EntityManagerInterface $entityManagerInterface,
								QuotaService $quotaService){
        $this->trainingRepository = $trainingRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->quotaService = $quotaService;
    }

    public function delete(array $data): bool
    {
        $training = $this->trainingRepository->findOneBy(['id' => $data['id']]);
        $this->entityManagerInterface->remove($training);
        $this->entityManagerInterface->flush();
        $filesystem = new FileSystem;
        $filesystem->remove($_ENV['ASSETS_PATH'] . 'trainings/' . $training->getSociety()->getId() . '/' .
	        $training->getUuid());
        $this->quotaService->noSpace($training->getSociety()->getId());
        return true;
    }
}

