<?php

namespace App\Service;

use DateTime;
use Exception;
use ZipArchive;
use App\Entity\Grain;
use FilesystemIterator;
use App\Entity\Training;
use App\Entity\BlockGrain;
use App\Entity\TrainingAuthor;
use App\Repository\SkinRepository;
use App\Repository\UserRepository;
use App\Repository\SocietyRepository;
use App\Repository\TrainingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;
use App\Repository\TrainingLanguageRepository;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Contracts\Translation\TranslatorInterface;


class ImportCreaService
{

	private $fileSystem;

	private $entityManagerInterface;

	private $security;

	private $skinRepository;

	private $trainingLangRepository;

	private $societyRepository;

	private $userRepository;

	private $trainingRepository;

	private $trans;

	public function __construct(
		Filesystem $fileSystem,
		Security $security,
		EntityManagerInterface $entityManagerInterface,
		SkinRepository $skinRepository,
		TrainingLanguageRepository $trainingLangRepository,
		SocietyRepository $societyRepository,
		UserRepository $userRepository,
		TrainingRepository $trainingRepository,
		TranslatorInterface $trans
	)
	{
		$this->fileSystem = $fileSystem;
		$this->security = $security;
		$this->entityManagerInterface = $entityManagerInterface;
		$this->skinRepository = $skinRepository;
		$this->trainingLangRepository = $trainingLangRepository;
		$this->societyRepository = $societyRepository;
		$this->userRepository = $userRepository;
		$this->trainingRepository = $trainingRepository;
		$this->trans = $trans;
	}


	public function getInformation(File $file): array
	{
		$path = $_ENV['TMP_TRAINING_PATH'] . $this->security->getUser()->getSociety()->getId() . '/' . $this->security->getUser()->getUuid() . '/';

		$this->fileSystem->mkdir($path);

		$zip = new ZipArchive();
		if ($zip->open($file->getRealPath()) === true) {
			$zip->extractTo($path);
			$zip->close();

		} else {
			throw new Exception("Impossible d'importer le module");
		}

		// On test si c'est un zip de l'ancien créa
		if (mime_content_type($path . 'skin.zip') === "application/zip") {
			$this->fileSystem->mkdir($path . 'skin');
			if ($zip->open($path . 'skin.zip') === true) {
				$zip->extractTo($path . 'skin');
				$zip->close();
			} else {
				throw new Exception("Impossible d'importer le module");
			}
		}

		$moduleXml = simplexml_load_file($path . "creamanifest.xml");
		$skinXml = simplexml_load_file($path . "skin/creamanifest.xml");
		$training = $this->trainingRepository->findOneBy(['uuid' => $moduleXml['uuid']]);
		$skin = $this->skinRepository->findOneBy(['uuid' => $moduleXml['skin_uuid']]);

		$information['module_version'] = isset($training) ? $training->getVersion() : null;
		$information['module_skin'] = $skinXml->theme . ' (' . $skinXml->color_name . ') ';
		$information['module_skin_version'] = isset($skin) ? $skin->getVersion() : null;

		$information['name'] = $moduleXml['name']->__toString();
		$information['version'] = $moduleXml['version']->__toString();
		$information['description'] = $moduleXml['description']->__toString();

		$langs = explode(";", $moduleXml['languages']);
		$information['language'] = '';
		foreach ($langs as $key => $lang) {
			$l = $this->trainingLangRepository->findOneBy(['iso_code_6391' => $lang]);
			$information['language'] .= isset($langs[$key + 1]) ? $l->getLabel() . '(' . $this->trans->trans($l->getLabelFr(), [], 'text', $this->security->getUser()->getLanguage()->getLanguageCode()) . '),' : $l->getLabel() . '(' . $this->trans->trans($l->getLabelFr(), [], 'text', $this->security->getUser()->getLanguage()->getLanguageCode()) . ')';
		}

		return $information;
	}

	public function importZip(string $action_training, bool $exist_skin): bool
	{
		$path = $_ENV['TMP_TRAINING_PATH'] . $this->security->getUser()->getSociety()->getId() . '/' . $this->security->getUser()->getUuid() . '/';
		//dd(simplexml_load_file($path . "creamanifest.xml"));
		$xml = simplexml_load_file($path . "creamanifest.xml");
		$begin_grain_position = 0;

		if ($action_training == "create") {
			$training = new Training();
			$training->setName($xml['name']);
			$training->setCreatedAt(new DateTime($xml['date_creation']));
			$training->setUpdatedAt(new DateTime($xml['date_modification']));
			$training->setLanguageCode($xml['code_lang']);
			$training->setUuid($xml['uuid']);
			$training->setVersion($xml['version']);
			$training->setShowPonderation((bool)$xml['show_ponderation']);
			$training->setDescription($xml['description']);
			$training->setObjective($xml['educ_objective']);
			$training->setPrerequisite($xml['prerequesite']);
			$training->setTechMeans($xml['tech_means']);
			$training->setEducMeans($xml['educ_means']);
			$training->setManagement($xml['management']);
			$training->setEvalMethod($xml['eval_method']);
			$training->setPublicTarget($xml['target_public']);
			$training->setSociety($this->societyRepository->findOneBy(['id' => 1]));
			$training->setStatus($xml['status']);
			$training->setContentValidation($xml['content_validation']);
			$training->setTag($xml['tags']);
			$training->setDiskSpace(0);
			$training->setLogo("");
			$training->setLogoPosition("left");


			$author = new TrainingAuthor();
			$author->setTraining($training);
			$author->setAuthor($this->userRepository->findOneBy(['id' => $this->security->getUser()->getId()]));
			$author->setIsOwner(true);
			$author->setIsEditor(true);
			$this->entityManagerInterface->persist($author);
		} elseif ($action_training == "add") {
			$training = $this->trainingRepository->findOneBy(['uuid' => $xml['uuid']]);
			$begin_grain_position = count($training->getGrains());
		} elseif ($action_training == "replace") {
			$training = $this->trainingRepository->findOneBy(['uuid' => $xml['uuid']]);
			$this->entityManagerInterface->remove($training);
			$training = new Training();
			$training->setName($xml['name']);
			$training->setCreatedAt(new DateTime($xml['date_creation']));
			$training->setUpdatedAt(new DateTime($xml['date_modification']));
			$training->setLanguageCode($xml['code_lang']);
			$training->setUuid($xml['uuid']);
			$training->setVersion($xml['version']);
			$training->setShowPonderation((bool)$xml['show_ponderation']);
			$training->setDescription($xml['description']);
			$training->setObjective($xml['educ_objective']);
			$training->setPrerequisite($xml['prerequesite']);
			$training->setTechMeans($xml['tech_means']);
			$training->setEducMeans($xml['educ_means']);
			$training->setManagement($xml['management']);
			$training->setEvalMethod($xml['eval_method']);
			$training->setPublicTarget($xml['target_public']);
			$training->setSociety($this->societyRepository->findOneBy(['id' => 1]));
			$training->setStatus($xml['status']);
			$training->setContentValidation($xml['content_validation']);
			$training->setTag($xml['tags']);
			$training->setDiskSpace(0);
			$training->setLogo("");
			$training->setLogoPosition("left");

			$author = new TrainingAuthor();
			$author->setTraining($training);
			$author->setAuthor($this->userRepository->findOneBy(['id' => 1]));
			$author->setIsOwner(true);
			$author->setIsEditor(true);
			$this->entityManagerInterface->persist($author);
		}

		if ($exist_skin == "true") {
			$training->setSkin($this->skinRepository->findOneBy(['uuid' => $xml['skin_uuid']]));
		} else {
			$training->setSkin($this->skinRepository->findOneBy(['id' => $this->security->getUser()->getSociety()->getSkinDefault()]));
		}


		$langs = explode(";", $xml['languages']);
		foreach ($langs as $lang) {
			$training->addLanguage($this->trainingLangRepository->findOneBy(['iso_code_6391' => $lang]));
		}

		$this->entityManagerInterface->persist($training);

		foreach ($xml->grains->grain as $g) {
			$grain = new Grain();
			$grain->setTraining($training);
			$grain->setName($g['name']);
			$grain->setDuration((int)$g['duration']);
			$grain->setPosition((int)$g['position'] + $begin_grain_position);
			$grain->setCreatedAt(new DateTime($g['create_at']));
			$grain->setUpdatedAt(new DateTime($g['updated_at']));
			$grain->setScoreTotal($g['score_total'] !== null ? $g['score_total'] : $g['mastery_score']);
			$grain->setMinimumTime(new DateTime($g['minimum_time']));
			$grain->setMaximumTime(new DateTime($g['maximum_time']));
			$grain->setActionTimeLimit($g['action_time_limit']);
			$grain->setContentValidation($g['content_validation']);
			$grain->setGraphicValidation($g['graphic_validation']);
			$grain->setShowCorrectAnswers((bool)$g['show_correct_answers']);
			$this->entityManagerInterface->persist($grain);
			foreach ($g->blocks->block as $b) {
				$block = new BlockGrain();
				// On regarde si c'est l'ancien créa
				if (preg_match('/url_(.?\w)="/', $b['options'], $matches) && strpos($b['options'], '/assets/clients/') === false) {
					$block->setType($this->translateTypeBlock($b['type']));
					$original = $this->get_string_between($b['options'], $matches[0], '"');
					$new_code = str_replace($original, $_ENV['ASSETS_URL'] . 'trainings/' . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid() . $original, $b['options']);
					$block->setCode(str_replace('\"', '"', $new_code));
				} else {
					$block->setType($b['type']);
					$block->setCode(str_replace(['\"', '{URL_MODULE}'], ['"', $_ENV['ASSETS_URL'] . 'trainings/' . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid()], $b['options']));
				}
				$block->setPosition(isset($b['position']) ? (int)$b['position'] : (int)$b['order']);
				$block->setQuestionScore((int)$b['question_code']);
				$block->setGrain($grain);
				$this->entityManagerInterface->persist($block);
			}
		}
		$filesystem = new Filesystem();
		if (is_dir($_ENV['ASSETS_PATH'] . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid())) {
			$filesystem->mkdir($_ENV['ASSETS_PATH'] . 'trainings/' . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid(), 0766);
		}
		if (is_dir($path . 'resources')) {
			$filesystem->remove($_ENV['ASSETS_PATH'] . $this->security->getUser()->getSociety()->getId());
			$filesystem->mirror($path . 'resources', $_ENV['ASSETS_PATH'] . 'trainings/' . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid());
		}

		$this->entityManagerInterface->flush();

		return true;
	}


	/**
	 * Permet de récuperer un bout de chaine entre deux
	 *
	 * @param string $string
	 * @param string $start
	 * @param string $end
	 *
	 * @return string
	 */
	private function get_string_between(string $string, string $start, string $end): string
	{
		$string = ' ' . $string;
		$ini = strpos($string, $start);
		if ($ini == 0) return '';
		$ini += strlen($start);
		$len = strpos($string, $end, $ini) - $ini;

		return substr($string, $ini, $len);
	}


	/**
	 * Fait la traduction entre les ancien type et les nouveau
	 *
	 * @param string $type
	 *
	 * @return string
	 */
	private function translateTypeBlock(string $type): string
	{
		$new_type = ['_IMGR', '_IMGL', '_EO_BLOCK', '_PDF_READER', '_QUIZ_GAPS'];
		$old_type = ['_IMGL', '_IMGR', '_EMBED', '_PDFREADER', '_QUIZ_CLOZE'];

		return str_replace($old_type, $new_type, $type);
	}

}
