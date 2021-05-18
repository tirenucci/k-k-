<?php

namespace App\Service;

use App\Repository\UserRepository;
use Exception;
use App\Entity\BlockGrain;
use App\Service\Export\Utils;
use App\Service\QuotaService;
use App\Exception\BlockException;
use App\Repository\GrainRepository;
use App\Repository\BlockGrainRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Contracts\Translation\TranslatorInterface;
use function str_replace;

class BlockService
{


	private $entityManagerInterface;

	private $grainRepository;

	private $blockGrainRepository;

	private $security;

	private $quotaService;

	private $translation;

	private $userRepository;

	public function __construct(
		EntityManagerInterface $entityManagerInterface,
		GrainRepository $grainRepository,
		BlockGrainRepository $blockGrainRepository,
		Security $security,
		QuotaService $quotaService,
		TranslatorInterface $translation,
		UserRepository $userRepository
	)
	{
		$this->entityManagerInterface = $entityManagerInterface;
		$this->grainRepository = $grainRepository;
		$this->blockGrainRepository = $blockGrainRepository;
		$this->security = $security;
		$this->quotaService = $quotaService;
		$this->translation = $translation;
		$this->userRepository = $userRepository;
	}

	public function switchPosition(array $data): void
	{
		$grain = $this->grainRepository->findOneBy(['id' => $data['id']]);


		foreach ($data['htmls'] as $key => $html) {
			if ($html['position'] === null && $key === 0) {
				$block = $this->blockGrainRepository->findOneBy(['grain' => $grain, 'position' => $key]);
			} else {
				$block = $this->blockGrainRepository->findOneBy(['grain' => $grain, 'position' => $html['position']]);
			}

			$block->setPosition($key);


			$this->entityManagerInterface->persist($block);
		}
		$this->entityManagerInterface->flush();
	}

	/**
	 * Permet d'enregistrer en base de données le block
	 *
	 * @param array $data
	 *
	 * @return array
	 */
	public function save(array $data): array
	{
		// Variable pour savoir si le block existe déjà
		$exist = false;
		if (isset($data['id']) && $data['id'] !== null) {
			$block = $this->blockGrainRepository->findOneBy(['id' => $data['id']]);
			$exist = true;
		} else {
			$block = new BlockGrain();
		}

		$grain = $this->grainRepository->findOneBy(['id' => $data['grain_id']]);
		$training = $grain->getTraining();
		// Si jamais le block existe pas donc qu'il n'a jamais été enregistrer on créer le code à 100%
		if (!$exist) {
			$xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";

			$xml .= '<options ';

			foreach ($data['options'] as $key => $value) {
				// Je test si la clé est similar car ça veux dire que le neutral doit être remplit
				// Rappel le neutral veux que toute les lang fonts chercher la lang mis en neutral (Bloc similair)
				if ($key === "similar") {
					if ($value === true) {
						$xml .= 'neutral="' . $data["lang"] . '" ';
					} else {
						$xml .= 'neutral="" ';
					}
				} elseif ($data['media'] === true && $key === "url") {
					$url = $value;

					$xml .= ' url_' . $data['lang'] . '="' . $url . '" ';
				} else {
					$value = \htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
					$xml .= $key . "_" . $data['lang'] . '="' . $this->translation->trans($value, [], 'text', $this->security->getUser()->getLanguage()->getLanguageCode()) . '" ';
				}
			}
			$xml .= "/>";
		} else {
			$code = $block->getCode();

			$code = str_replace("/>", "", $code);

			foreach ($data['options'] as $key => $value) {
				if ($key === "similar") {
					if ($value === true) {
						$code = str_replace('neutral="' . $this->get_string_between($code, 'neutral="', '"') . '"', 'neutral="' . $data["lang"] . '" ', $code);
					}
				} else {
					$value = \htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
					if ($this->get_string_between($code, $key . '_' . $data['lang'] . '="', '"') !== null) {
						$tmp = $this->get_string_between($code, $key . '_' . $data['lang'] . '="', '"');
						$code = str_replace($key . "_" . $data['lang'] . '="' . $tmp . '"', $key . "_" . $data['lang'] . '="' . $value . '" ', $code);
					} else {
						$code .= $key . "_" . $data['lang'] . '="' . $value . '" ';
					}
				}
			}
			$code .= "/>";
		}

		$block->setCode(isset($xml) ? $xml : $code);
		$block->setGrain($grain);

		if ($exist) {
			$block->setPosition($data['position']);
		} elseif ($data['position']) {
			$block->setPosition($data['position']);
		} else {
			$block->setPosition(count($grain->getBlockGrains()));
		}

		if (!$data['newBlock']) {
			$currentBlocks = $this->blockGrainRepository->findBy(['grain' => $grain]);
			foreach ($currentBlocks as $key => $currentBlock) {
				if ($currentBlock->getPosition() >= $data['position']) {
					$currentBlock->setPosition($currentBlock->getPosition() + 1);
					$this->entityManagerInterface->persist($currentBlock);
				}
			}
		}
		$block->setPosition($data['position']);

		$block->setType($data['type']);

		$grain->setUpdatedAt(new \DateTime());
		$training->setUpdatedAt(new \DateTime());

		$this->entityManagerInterface->persist($block);
		$this->entityManagerInterface->persist($grain);
		$this->entityManagerInterface->persist($training);
		$this->entityManagerInterface->flush();

		return $block->toArray();
	}

	/**
	 * Fonction pour generer le HTML du block grâce au fichier JSON dans public
	 *
	 * @param BlockGrain $block        Le bloc que l'on veux traduire en HTML
	 * @param string     $language     La langue du module
	 * @param bool       $autocomplete permet de savoir si l'algo trouve la langue du user pour generer un bloc malgrès
	 *                                 que dans la langue actuel il n'y ai rien
	 *
	 * @return string le code HTML en clair
	 */
	public function generateHtml(BlockGrain $block, string $language, bool $autocomplete = true): array
	{
		// Fichier contenant le préremplissage des balise
		$jsonFileContent = file_get_contents(__DIR__ . "/../../config/block_template.json");

		$json = json_decode($jsonFileContent, true);

		$html = '';

		$baliseType = '';


		if (key_exists($block->getType(), $json)) {
			if (key_exists("div", $json[$block->getType()]) && key_exists("balise", $json[$block->getType()])) {
				$html .= '    <div class="cle-block-box cle-block' . $json[$block->getType()]['div'] . '"';
				if (key_exists("style", $json[$block->getType()])) {
					$html .= '  style="' . $json[$block->getType()]['style'] . '"';
				}
				$html .= '>';

				if (strpos($block->getCode(), "href_" . $language) !== false) {
					$baliseType = 'balisehref';
				} else {
					$baliseType = 'balise';
				}

				if (strpos($json[$block->getType()][$baliseType], "%") !== false) {
					// Ce Regex permet de choper tous ce qui est ente %
					\preg_match_all('/%(.*?)\%/s', $json[$block->getType()][$baliseType], $baliseInJson);
					$code = $block->getCode();
					$balise = $json[$block->getType()][$baliseType];
					// Ce Regex chope ce qu'il y a dans neutral
					preg_match('/neutral="(.*?)\"/s', $code, $neutral);
					foreach ($baliseInJson[1] as $b) {
						if (!empty($neutral[1])) {
							preg_match('/' . $b . '_' . $neutral[1] . '="(.*?)\"/s', $code, $sqlInfo);
						} else {
							if (preg_match('/' . $b . '_' . $language . '="(.*?)\"/s', $code, $sqlInfo) !== 0) {
								preg_match('/' . $b . '_' . $language . '="(.*?)\"/s', $code, $sqlInfo);
							} else {
								if ($autocomplete) {
									preg_match('/_(.?\w)="/', $code, $language);
									$language = $language[1];
									preg_match('/' . $b . '_' . $language . '="(.*?)\"/s', $code, $sqlInfo);
								} else {
									$sqlInfo = false;
								}
							}
						}

						if ($b === "style_width") {
							preg_match('/url_' . $language . '="(.*?)\"/s', $code, $url);
							if (isset($url[1]) && $url[1] !== "_UNKNOWN") {
								preg_match('/scale_' . $language . '="(.*?)\"/s', $code, $scale);
								try {
									if (strpos($url[1], "http") !== false) {
										list($width, $height) = getimagesize(preg_replace('/\xE2\x80\x8B/', "", $url[1]));
									} else {
										list($width, $height) = getimagesize($_ENV['FRONT_URL'] . preg_replace(['/\xE2\x80\x8B/', '/\s/'], ['', '%20'], $url[1]));
									}
									$balise = str_replace("%style_width%", strval($width *= ($scale[1] / 100)) . "px", $balise);
								} catch (Exception $e) {
									dump($e->getMessage(), $scale);
									$balise = str_replace("%style_width%", "100%", $balise);
								}
							} else {
								$balise = str_replace("%style_width%", "0%", $balise);
							}
						} else {
							if ($autocomplete) {
								if (isset($sqlInfo[1]))
									$balise = str_replace("%" . $b . "%", $sqlInfo[1], $balise);
								else
									$balise = str_replace("%" . $b . "%", "", $balise);
							} else {
								$balise = "";
							}
						}
					}
					$html .= "\n";
					$html .= "      " . html_entity_decode($balise, ENT_QUOTES, "UTF-8");
					$html .= "\n";
				} else {
					$html .= "\n";
					$html .= "      " . $json[$block->getType()][$baliseType];
					$html .= "\n";
				}
				$html .= '  </div>';
				$html .= "\n";
			} else {
				throw new BlockException("Le fichier JSON est incorrect il manque sois l'élément div sois balise dans la partie " . $block->getType());
			}
		} else {
			throw new BlockException($block->getType() . " n'existe pas dans le fichier JSON");
		}

		return ["code" => $html, "lang" => $language];
	}

	/**
	 * Fonction permettant de récuperer tout les parametres d'un bloc
	 *
	 * @param array $data
	 *
	 * @return array
	 */
	public function getParameter(array $data): array
	{
		$block = $this->blockGrainRepository->findOneBy(['id' => $data['id']]);

		if ($block === null) {
			return array();
		}

		$properties = array();

		preg_match_all('/(\w+)_' . $data['lang'] . '/', $block->getCode(), $props);
		foreach ($props[1] as $prop) {
			preg_match('/neutral="(.*?)\"/s', $block->getCode(), $neutral);
			if (!empty($neutral[1])) {
				preg_match_all('/' . $prop . '_' . $neutral[1] . '="(.*?)\"/s', $block->getCode(), $sqlInfo);
				$content = implode($sqlInfo[1]);

				$properties['options'][$prop] = html_entity_decode($content, ENT_QUOTES, "UTF-8");
			} else {
				preg_match_all('/' . $prop . '_' . $data['lang'] . '="(.*?)\"/s', $block->getCode(), $sqlInfo);
				$content = implode($sqlInfo[1]);

				$properties['options'][$prop] = html_entity_decode($content, ENT_QUOTES, "UTF-8");
			}
		}

		$properties['position'] = $block->getPosition();
		$properties['type'] = $block->getType();

		if (strpos($block->getType(), "_QUIZ") !== false) {
			$properties['coef'] = $block->getCoef();
			$properties['question_score'] = $block->getQuestionScore();
		}

		return $properties;
	}

	public function delete(array $data): bool
	{
		$block = $this->blockGrainRepository->findOneBy(['id' => $data['id']]);

		if ($block !== null) {
			$this->entityManagerInterface->remove($block);
			$this->entityManagerInterface->flush();
			$blocksHighter = $this->blockGrainRepository->getAllPositionHighter($block->getPosition());
			if (!empty($blocksHighter)) {
				foreach ($blocksHighter as $blockHighter) {
					$blockHighter->setPosition($blockHighter->getPosition() - 1);
					$this->entityManagerInterface->persist($blockHighter);
				}
			}
			$this->entityManagerInterface->flush();

			return true;
		} else {
			return false;
		}
	}

	public function sendBlock(array $data): void
	{
		$newGrain = $this->grainRepository->findOneBy(['id' => $data['new_grain']]);
		$block = $this->blockGrainRepository->findOneBy(['id' => $data['id_block']]);

		$newBlock = clone($block);

		$newBlock->setGrain($newGrain);
		$newBlock->setPosition(count($newGrain->getBlockGrains()));

		$this->entityManagerInterface->persist($newBlock);
		$this->entityManagerInterface->flush();
	}

	public function duplicateBlock(array $data): void
	{
		$grain = $this->grainRepository->findOneBy(['id' => $data['grain_id']]);
		$block = $this->blockGrainRepository->findOneBy(['id' => $data['id_block']]);

		$newBlock = clone($block);
		$newBlock->setPosition(count($grain->getBlockGrains()));

		$this->entityManagerInterface->persist($newBlock);
		$this->entityManagerInterface->flush();
	}

	public function uploadMediaFroala(File $file, array $data, string $path): ?string
	{
		$security = base64_decode($data['security']);
		$securityArray = explode(':', $security);
		$user = $this->userRepository->findOneBy(['connection_token' => $securityArray[1]]);
		if ($user && $securityArray[0] ===
			hash_hmac('sha256', $path, $_ENV['HASH_KEY'])) {
			$grain = $this->grainRepository->findOneBy(['id' => $data['id_grain']]);

			if ($this->quotaService->setSpaceDiskUsedSociety($_ENV['ASSETS_PATH'] . 'trainings/' . $user->getSociety()->getId() . '/' . $grain->getTraining()->getUuid())) {
				$target = $file->move($_ENV['ASSETS_PATH'] . 'trainings/' . $user->getSociety()->getId() . '/' . $grain->getTraining()->getUuid(), Utils::satanizeFileName($file->getClientOriginalName()));
				if ($target) {
					$this->quotaService->setSpaceDiskUsedTraining($grain->getTraining()->getUuid(), $user);

					return $_ENV['ASSETS_URL'] . 'trainings/' . $user->getSociety()->getId() . '/' . $grain->getTraining()->getUuid() . '/' . Utils::satanizeFileName($file->getClientOriginalName());
				} else {
					return "";
				}
			}

			return "nospace";
		}

		return null;
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

}