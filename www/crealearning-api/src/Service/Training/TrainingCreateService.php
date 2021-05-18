<?php

namespace App\Service\Training;

use App\Entity\Training;
use App\Service\GrainService;
use App\Service\QuotaService;
use App\Entity\TrainingAuthor;
use App\Repository\SkinRepository;
use App\Repository\UserRepository;
use App\Repository\SocietyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use App\Repository\TrainingLanguageRepository;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Constraints\Uuid;

class TrainingCreateService
{

	private $skinRepository;
	private $societyRepository;
	private $authorRepository;
	private $grainService;
	private $entityManagerInterface;

	private $trainingLanguageRepository;
	private $quotaService;
	private $security;

	public function __construct(SkinRepository $skinRepository,
	                            SocietyRepository $societyRepository,
	                            UserRepository $authorRepository,
	                            EntityManagerInterface $entityManagerInterface,
	                            GrainService $grainService,
	                            TrainingLanguageRepository $trainingLanguageRepository,
	                            QuotaService $quotaService,
	                            Security $security)
	{
		$this->skinRepository = $skinRepository;
		$this->societyRepository = $societyRepository;
		$this->authorRepository = $authorRepository;
		$this->entityManagerInterface = $entityManagerInterface;
		$this->grainService = $grainService;
		$this->trainingLanguageRepository = $trainingLanguageRepository;
		$this->quotaService = $quotaService;
		$this->security = $security;
	}

	/**
	 * Fonction permettant de créer le dossier du training et le mettre en base de donée
	 *
	 * @param array $data les information envoyer par react
	 *
	 * @return int l'id du training ou -1 si plus de place
	 */
	public function createTraining(array $data): int
	{
		$author = $this->security->getUser();
		if ($this->quotaService->noSpace($author->getSociety()->getId())) {
			$filesystem = new Filesystem();
			$skin = $this->skinRepository->findOneBy(['id' => $data['skin'] ? $data['skin'] :
				$author->getSociety()->getSkinDefault()]);
			$language = $this->trainingLanguageRepository->findOneBy(['label' => $author->getLanguage()->getLanguage()]);
			$training = new Training();
			$training->setSkin($skin);
			$training->setSociety($author->getSociety());
			$training->setName($data['name']);
			$training->setCreatedAt(new \DateTime());
			$training->setUpdatedAt(new \DateTime());
			$training->setLanguageCode($language->getIsoCode6391());
			$training->addLanguage($language);
			$training->setVersion('1.0');
			$training->setUuid(uuid_create(Uuid::V4_RANDOM));
			$training->setLicense('_CC');
			$training->setStatus('_UNDERCONSTRUCTION');
			$training->setDuration(0);
			$training->setContentValidation('INVALID');
			$training->setDiskSpace(0);
			$training->setShowPonderation(true);
			$training->setLogo(0);
			$training->setLogoPosition('left');
			$training->setDescription($data['description']);
			$training->setEducMeans("");
			$training->setTechMeans("");
			$training->setManagement("");
			$training->setAchievements("");
			$training->setPublicTarget("");
			$training->setPrerequisite("");
			$training->setTag('');
			$training->setEvalMethod('');


			$this->entityManagerInterface->persist($training);

			$trainingAuthor = new TrainingAuthor();
			$trainingAuthor->setTraining($training);
			$trainingAuthor->setAuthor($author);
			$trainingAuthor->setIsOwner(true);
			$trainingAuthor->setIsEditor(true);
			$this->entityManagerInterface->persist($trainingAuthor);
			$this->entityManagerInterface->flush();
			$this->grainService->createGrain(['id' => $training->getId()]);

			$filesystem->mkdir($_ENV['ASSETS_PATH'] . 'trainings/' . $author->getSociety()->getId() . '/' .
				$training->getUuid
				(),
				0777, true);

			return $training->getId();
		} else {
			return -1;
		}

	}
}

