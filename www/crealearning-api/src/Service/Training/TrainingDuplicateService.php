<?php

namespace App\Service\Training;

use App\Entity\Training;
use App\Entity\TrainingAuthor;
use App\Repository\TrainingRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\TrainingAuthorRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;

class TrainingDuplicateService
{

	private $trainingRepository;

	private $authorRepository;

	private $trainingAuthorRepository;

	private $entityManagerInterface;

	public function __construct(TrainingRepository $trainingRepository,
	                            TrainingAuthorRepository $trainingAuthorRepository,
	                            UserRepository $authorRepository,
	                            EntityManagerInterface $entityManagerInterface)
	{
		$this->trainingRepository = $trainingRepository;
		$this->authorRepository = $authorRepository;
		$this->trainingAuthorRepository = $trainingAuthorRepository;
		$this->entityManagerInterface = $entityManagerInterface;
	}

	/**
	 * Fonction pour dupliquer en cascade un module
	 *
	 * @param array $data l'id du module
	 *
	 * @return boolean
	 */
	public function duplicate(array $data): bool
	{
		$filesystem = new Filesystem();
		$oldTraining = $this->trainingRepository->findOneBy(['id' => $data['id']]);
		$newTraining = clone $oldTraining;
		$newTraining->setName($oldTraining->getName() . ' (Copie)');
		$newTraining->setCreatedAt(new \DateTime());
		$newTraining->setUpdatedAt(new \DateTime());

		$allAuthor = $oldTraining->getAuthor();

		foreach ($allAuthor as $author) {
			$oldTrainingAuthor = $this->trainingAuthorRepository->findOneBy(['training' => $oldTraining->getId(), 'author' => $author->getAuthor()]);

			$newAuthor = clone $oldTrainingAuthor;
			$newAuthor->setTraining($newTraining);
			$this->entityManagerInterface->persist($newAuthor);
		}


		$allGrain = $oldTraining->getGrains();

		foreach ($allGrain as $grain) {
			$newGrain = clone $grain;
			$newGrain->setTraining($newTraining);
			$allBlock = $grain->getBlockGrains();
			foreach ($allBlock as $block) {
				$newBlock = clone $block;
				$newBlock->setGrain($newGrain);
				$this->entityManagerInterface->persist($newBlock);

			}
			$this->entityManagerInterface->persist($newGrain);
		}

		$this->entityManagerInterface->persist($newTraining);
		$this->entityManagerInterface->flush();

		$filesystem->mirror($_ENV['ASSETS_PATH'] . 'trainings/' . $oldTraining->getSociety()->getId() . '/' . $oldTraining->getUuid() . '/',
			$_ENV['ASSETS_PATH'] . 'trainings/' . $oldTraining->getSociety()->getId() . '/' . $newTraining->getUuid() . '/');

		return true;
	}

}

