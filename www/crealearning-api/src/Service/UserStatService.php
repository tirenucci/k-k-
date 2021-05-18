<?php

namespace App\Service;

use App\Repository\GrainRepository;
use App\Repository\TrainingAuthorRepository;
use App\Repository\TrainingRepository;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\Security;

class UserStatService
{

	private $trainingAuthorRepository;
	private $grainRepository;
	private $userRepository;
	private $security;

	public function __construct(TrainingAuthorRepository $trainingAuthorRepository, GrainRepository $grainRepository,
	                            UserRepository $userRepository, Security $security)
	{
		$this->trainingAuthorRepository = $trainingAuthorRepository;
		$this->grainRepository = $grainRepository;
		$this->userRepository = $userRepository;
		$this->security = $security;
	}


	/**
	 * Permet de récuperer le nombre de module créer le la moyenne des
	 *
	 * @param array $data
	 *
	 * @return array
	 */
	public function getStatModule(): array
	{
		$trainings = $this->trainingAuthorRepository->findBy(['author' => $this->security->getUser()]);

		$nbTraining = count($trainings);
		$nbGrain = 0;

		foreach ($trainings as $training) {
			$nbGrain += count($this->grainRepository->findBy(['training' => $training->getTraining()]));
		}
		if ($nbTraining !== 0 || $nbGrain !== 0)
			$grainAverage = $nbGrain / $nbTraining;
		else
			$grainAverage = 0;

		return array(['total_training' => $nbTraining, 'grain_average' => $grainAverage]);
	}
}
