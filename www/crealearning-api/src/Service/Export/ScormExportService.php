<?php

namespace App\Service\Export;

use Exception;
use DOMElement;
use ZipArchive;
use DOMDocument;
use App\Entity\Grain;
use App\Service\LangService;
use App\Service\BlockService;
use App\Service\GrainService;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use App\Service\QuestionService;
use App\Repository\TrainingRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;
use App\Service\Training\TrainingReaderService;
use Symfony\Contracts\Translation\TranslatorInterface;

class ScormExportService
{

    private $tmpPath = '';
    private $zPages = array();
    private $dependencies = array();

    private $languages;
    
    private $training;

    private $PDFReader = false;
    private $dom = null;

    private $fileSystem;

    private $jsCookyKey;

    private $grainService;

    private $blockService;
    private $questionService;



    private $trainingRepository;
    private $trainingReaderService;

    private $security;

    private $creaExportService;

    private $monograin = false;

    private $langService;

    private $trans;

    function __construct(
                            TrainingRepository $trainingRepository, 
                            Filesystem $fileSystem, 
                            GrainService $grainService, 
                            TrainingReaderService $trainingReaderService,
                            BlockService $blockService,
                            QuestionService $questionService,
                            Security $security,
                            CreaExportService $creaExportService,
                            LangService $langService,
                            TranslatorInterface $trans
                        )
    {
        $this->trainingRepository = $trainingRepository;
        $this->fileSystem = $fileSystem;

        $this->grainService = $grainService;
        $this->trainingReaderService = $trainingReaderService;

        $this->blockService = $blockService;
        $this->questionService = $questionService;

        $this->security = $security;

        $this->creaExportService = $creaExportService;

        $this->langService = $langService;

        $this->trans = $trans;
    }

    /**
     * Fonction permettant de récuperer le module
     * 
     * @param array $data
     *
     * @return void
     */
    public function getTraining(array $data) : void
    {
        $this->training = $this->trainingRepository->findOneBy(['id' => $data['id']]);

        
        $this->jsCookyKey = time() . '_' . $this->training->getId() . '_lang';

        $this->languages = $this->training->getLanguage();
    }

    /**
     * Initie le fait d'être en monograin ou non
     *
     * @param array $data
     * @return void
     */
    public function isMonograinExport(array $data) : void
    {
        if (isset($data['monograin']))
        {
            $this->monograin = $data['monograin'];
        }
    }

    /**
     * Permet d'initializer l'export
     *
     * @return void
     */
    public function initialize() : void
    {
        $this->tmpPath = Utils::satanizeFileName($_ENV['TMP_TRAINING_PATH'] . $this->training->getUuid() . '/' . $this->training->getName());
        
        if (file_exists($this->tmpPath . "/imsmanifest.xml"))
        {
            $this->fileSystem->remove($this->tmpPath);
            $this->fileSystem->mkdir($this->tmpPath, 0700);
        }
        else
        {
            $this->fileSystem->mkdir($this->tmpPath, 0700);    
        }

        $this->fileSystem->mkdir($this->tmpPath . '/' . 'resources');
    }

    /**
     * Fonction permettant toute les création et le zippage
     *
     * @return void
     */
    public function pack() : void
    {
        if (!$this->tmpPath || !is_dir($this->tmpPath))
        {
            throw new Exception("Le dossier " . $this->tmpPath . " n'a pas pus être créer.");
        }

        $this->makeManifest();

        if (!$this->monograin)
        {
            $this->fileSystem->mirror(__DIR__ . '/../../../templates/lib',$this->tmpPath . '/lib');
        }
        else
        {
            $this->fileSystem->mirror(__DIR__ . '/../../../templates/lib-monograin',$this->tmpPath . '/lib');
            $this->fileSystem->copy(__DIR__ . '/../../../templates/shared/scormfunction.js',$this->tmpPath . '/shared/scormfunction.js');
        }
        // Ne copie pas le skins si test git
        if (\strpos(__DIR__, "builds") === false)
        {
            $this->fileSystem->mirror($_ENV['ASSETS_PATH'] . '../skins/' . $this->training->getSkin()->getSkinTheme()->getFolderName(). '/' . $this->training->getSkin()->getFolderName(), $this->tmpPath . '/skin/');
        }

        $zip = new ZipArchive();
        if (!$this->monograin)
        {
            $this->fileSystem->mkdir(Utils::satanizeFileName($this->training->getSociety()->getId() . '/' . $this->training->getUuid() . '/scorm12/'));
            $zip->open(Utils::satanizeFileName($this->training->getSociety()->getId() . '/' . $this->training->getUuid() . '/scorm12/'. $this->training->getName()) .'.scorm.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);
        }
        else
        {
            $this->fileSystem->mkdir(Utils::satanizeFileName($this->training->getSociety()->getId() . '/' . $this->training->getUuid() . '/monograin/'));
            $zip->open(Utils::satanizeFileName($this->training->getSociety()->getId() . '/' . $this->training->getUuid() . '/monograin/'. $this->training->getName()) .'.scorm.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);
        }

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->tmpPath),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach($files as $name => $file)
        {
            if(!$file->isDir())
            {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($this->tmpPath) + 1);
                

                $zip->addFile($filePath, str_replace("\\","/",$relativePath));
            }
        }

        $zip->close();
        $this->fileSystem->remove($this->tmpPath);

    }

    /**
     * Fonction permettant de faire le manifest
     *
     * @return void
     */
    private function makeManifest() : void
    {
        $this->dom = new DOMDocument('1.0', 'UTF-8');
        $this->dom->xmlStandalone = true;
        $this->dom->formatOutput = true;

        $domManifest = $this->domManifest();

        $this->dom->appendChild($domManifest);

        $xml = $this->dom->saveXML();
        $path = $this->tmpPath . '/imsmanifest.xml';
        file_put_contents($path, $xml);

        $this->creaExportService->getTraining($this->training);

        $this->creaExportService->createManifest($this->tmpPath);
    }

    /**
     * Création du manifest
     *
     * @return DOMElement
     */
    private function domManifest() : DOMElement
    {
        $domManifest = $this->dom->createElement('manifest');

        $domManifest->setAttribute('identifier', $this->training->getUuid());
        $domManifest->setAttribute('version', $this->training->getVersion());
		$domManifest->setAttribute('xmlns','http://www.imsproject.org/xsd/imscp_rootv1p1p2');
		$domManifest->setAttribute('xmlns:adlcp','http://www.adlnet.org/xsd/adlcp_rootv1p2');
        $domManifest->setAttribute('xmlns:xsi','http://www.w3.org/2001/XMLSchema-instance');
        $domManifest->setAttribute('xsi:schemaLocation','http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd');

        $domManifest->appendChild($this->domMetadata());

        $domManifest->appendChild($this->domOrganisations());

        $domManifest->appendChild($this->domResources());

        return $domManifest;
    }

    /**
     * Permet de mettre les metadata dans le xml
     *
     * @return DOMElement
     */
    private function domMetadata() : DOMElement
    {
        $dom = $this->dom;

        $domMetadata = $dom->createElement('metadata');
        $domMetadata->appendChild($dom->createElement('schema', 'ADL SCORM'));
        $domMetadata->appendChild($dom->createElement('schemaversion', '1.2'));

        $domMetadata->appendChild($this->domLom());

        return $domMetadata;
    }

    /**
     * Ici on genere le LOM la grosse parti du XML du scorm
     *
     * @return DOMElement
     */
    private function domLom() : DOMElement
    {
        $domLom = $this->dom->createElement('lom');
        $domLom->setAttribute('xmlns', 'http://ltsc.ieee.org/xsd/LOM');

        $domLom->appendChild($this->domGeneral());

        
		$domLom->appendChild($this->domClassification('educ_objective'));
		$domLom->appendChild($this->domClassification('prerequesite'));
		$domLom->appendChild($this->domClassification('educ_means','NotLOM'));
		$domLom->appendChild($this->domClassification('tech_means','NotLOM'));
		$domLom->appendChild($this->domClassification('management','NotLOM'));
		$domLom->appendChild($this->domClassification('eval_method','NotLOM'));
        $domLom->appendChild($this->domClassification('target_public','NotLOM'));
        
        if ($this->domEducational() != '')
        {
            $domLom->appendChild($this->domEducational());
        }

        return $domLom;

    }

    /**
     * Undocumented function
     *
     * @return void
     */
    private function domEducational()
    {
        $createDomEducational = false;
        $domEducational = $this->dom->createElement('educational');

        $dureeMnEstimee = $this->training->getDuration();
        $dureeSecondeEstimee = $dureeMnEstimee * 60;

        if ($dureeSecondeEstimee > 0)
        {
            $domTypicalLearningTime = $this->domTypicalLearningTime($dureeSecondeEstimee);
            if ($domTypicalLearningTime == '') 
            {
                return;
            }
            else
            {
                $createDomEducational = true;
                $domEducational->appendChild($domTypicalLearningTime);
            }

            if ($createDomEducational)
            {
                return $domEducational;
            }
        }
        else
        {
            return;
        }
    }

    private function domTypicalLearningTime(int $dureeSecondeEstimee) : DOMElement
    {
        $dureeIso = Utils::formatTime($dureeSecondeEstimee);

        $domTypicalLearningTime = $this->dom->createElement('typicalLearningTime');

        $domDurationTypicalLearningTime = $this->dom->createElement('datetime', $dureeIso);
        $domTypicalLearningTime->appendChild($domDurationTypicalLearningTime);

        $descriptionTypicalLearningTimeCdata = $this->dom->createCDATASection('Durée estimée de la formation');

        $domDescription = $this->dom->createElement('description');
        $domStringDescription = $this->createStringDom($this->dom);

        $domDescription->appendChild($domStringDescription);
        $domStringDescription->appendChild($descriptionTypicalLearningTimeCdata);

        $domTypicalLearningTime->appendChild($domDescription);

        return $domTypicalLearningTime;
    }

    private function domClassification(string $typeClassification, string $lomv = 'LOMv1.0')
    {
        if ($typeClassification == '')
        {
            return;
        }

        $domClassification = $this->dom->createElement('classification');

        $domPurpose = $this->dom->createElement('purpose');

        $domSourcePurpose = $this->dom->createElement('source', $lomv);
        $domPurpose->appendChild($domSourcePurpose);

        switch($typeClassification)
        {
            case 'educ_objective':
               $valueClassification = 'educational objectif';
               $descriptionClassification = $this->training->getObjective();
            break;
            
            case 'prerequesite':
                $valueClassification = 'educational prerequisite';
                $descriptionClassification = $this->training->getPrerequisite();
            break;
             
            case 'educ_means':
                $valueClassification = 'educational means';
                $descriptionClassification = $this->training->getEducMeans();
            break;
             
            case 'tech_means':
                $valueClassification = 'technical means';
                $descriptionClassification = $this->training->getTechMeans();
            break;
             
            case 'management':
                $valueClassification = 'management';
                $descriptionClassification = $this->training->getManagement();
            break;
            case 'eval_method':
                $valueClassification = 'evaluation method';
                $descriptionClassification = $this->training->getEvalMethod();
            break;
            case 'target_public':
                $valueClassification = 'target public';
                $descriptionClassification = $this->training->getPublicTarget();
            break;
            default:
                return;
            break;
        }

        $domValuePurpose = $this->dom->createElement('value', $valueClassification);
        $domPurpose->appendChild($domValuePurpose);

        $domClassification->appendChild($domPurpose);

        $descriptionClassifationCdata = $this->dom->createCDATASection($descriptionClassification);

        $domDescription = $this->dom->createElement('description');
        $domStringDescription = $this->dom->createElement('langstring');

        $domDescription->appendChild($domStringDescription);
        $domStringDescription->appendChild($descriptionClassifationCdata);

        $domClassification->appendChild($domDescription);

        return $domClassification;
    }

    private function domGeneral() : DOMElement
    {
        //$codeLangue = $this->security->getUser()->getLanguage()->getLanguageCode();

        $authors = $this->training->getAuthor();

        $domGeneral = $this->dom->createElement('general');

        // Création de l'identifier
        $domId = $this->dom->createElement('identifier', $this->training->getUuid());
        $domGeneral = $this->dom->createElement('general');

        // Création du titre
        $titleCdata = $this->dom->createCDATASection($this->training->getName());
        $domTitle = $this->dom->createElement("title");
        $domStringTitle = $this->createStringDom($this->dom, 'fr');
        $domTitle->appendChild($domStringTitle);
        $domStringTitle->appendChild($titleCdata);
        $domGeneral->appendChild($domTitle);

        // Creation de la description
        $descriptionCdata = $this->dom->createCDATASection($this->training->getDescription());
        $domDescription = $this->dom->createElement('description');
        $domStringDescription = $this->createStringDom($this->dom, 'fr');

        $domDescription->appendChild($domStringDescription);
        $domStringDescription->appendChild($descriptionCdata);

        $domGeneral->appendChild($domDescription);

        // Lifecycle
        $domLifeCycle = $this->dom->createElement('lifecycle');

        $domVer = $this->dom->createElement('version');
        $verCdata = $this->dom->createCDATASection($this->training->getVersion());
        $domStringVer = $this->createStringDom($this->dom, 'fr');
        $domStringVer->appendChild($verCdata);
        $domVer->appendChild($domStringVer);
        $domLifeCycle->appendChild($domVer);

        if (count($authors))
        {
            $domContribute = $this->dom->createElement('contribute');
            $domRole = $this->dom->createElement('role');
            $domSource = $this->dom->createElement('source');

            $domStringSource = $this->createStringDom($this->dom);
            $domStringSource->appendChild($this->dom->createTextNode('LOMv1.0'));
            $domSource->appendChild($domStringSource);
            $domRole->appendChild($domSource);

            $domValue = $this->dom->createElement('value');
            $domStringValue = $this->createStringDom($this->dom);
            $domStringValue->appendChild($this->dom->createTextNode('LOMv1.0'));
            $domValue->appendChild($domStringValue);
            $domRole->appendChild($domValue);

            $domContribute->appendChild($domRole);

            foreach($authors as $author)
            {
                $name = $author->getAuthor()->getFirstName() . ' ' . $author->getAuthor()->getLastName();

                $domCEntity = $this->dom->createElement('centity');
                $domVcard = $this->dom->createElement('vcard', $name);
                $domCEntity->appendChild($domVcard);

                $domContribute->appendChild($domCEntity);
            }
            $date = $this->training->getUpdatedAt();
            $domDate = $this->dom->createElement('date');
            $domDatetime = $this->dom->createElement('datetime',$date->format("Y-m-d"));
            $domDate->appendChild($domDatetime);
            $domContribute->appendChild($domDate);
            $domLifeCycle->appendChild($domContribute);
        }

        $domGeneral->appendChild($domLifeCycle);

        return $domGeneral;
    }

    private function createStringDom($dom, $codeLangue = 'x-none')
    {
        $domString = $dom->createElement('langstring');
        $domString->setAttribute('xml:lang', $codeLangue);

        return $domString;
    }

    private function domOrganisations() : DOMElement
    {
        $domOrganizations = $this->dom->createElement('organizations');

        $domOrganizations->setAttribute('default', 'Org1');

        $domOrganizations->appendChild($this->domOrganisation());

        return $domOrganizations;
    }

    /**
	 * Créé et renvoie les organization sous forme de DOM.
	 *
	 * Pour le moment on ne gère qu'une seule organisation
	 * nommée Org1, qui correspond à la succession linéaire
	 * des grains de la formation.
	 * Mais en fait on peut en mettre autant qu'on veut et
	 * gérer les parcours perso par exemple.
     * 
     * Sachant que Scorm conseille de pas utiliser le multi organization sachant que aujourd'hui agora ne le gère pas
     *
     * @return DOMElement
     */
    private function domOrganisation() : DOMElement
    {
        $domOrg = $this->dom->createElement('organization');
        $domOrg->setAttribute('identifier', 'Org1');

        $domOrg->appendChild($this->dom->createElement('title', $this->training->getName()));

        if (count($this->languages) > 1)
        {
            $domItem = $this->dom->createElement('item');

            $domItem->setAttribute('identifier', 'ItemLanguages');
            $domItem->setAttribute('identifierref', 'ResourceLanguages');
            $domItem->setAttribute('isvisible', 'true');

            $domItem->appendChild($this->dom->createElement('title', 'Languages'));

            $domPrereq = $this->dom->createElement('adlcp:prerequisites');
            $domPrereq->setAttribute('type', 'aicc_script');
            $domItem->appendChild($domPrereq);

            $domOrg->appendChild($domItem);
        }
        if (!$this->monograin)
        {
            $grains = $this->training->getGrains();
            foreach($grains as $grain)
            {
                $domItem = $this->domItemGrain($grain);
                $domOrg->appendChild($domItem);
            }
        }
        else
        {
            $domItem = $this->dom->createElement("item");
            $domItem->setAttribute("identifier", "Item1");
            $domItem->setAttribute("identifierref", "Resource1");
            $domItem->setAttribute("isvisible", "true");

            $domItem->appendChild($this->dom->createElement("title", $this->training->getName()));

            $prerequise = $this->dom->createElement("adlcp:prerequisites");
            $prerequise->setAttribute("type", "aicc_script");

            $domItem->appendChild($prerequise);

            $domOrg->appendChild($domItem);
        }

        return $domOrg;
    }

    private function domItemGrain(Grain $grain) : DOMElement
    {
        $idGrain = $grain->getId();
        $domItem = $this->dom->createElement('item');
        $domItem->setAttribute('identifier', 'Item' . $idGrain);
        $domItem->setAttribute('identifierref', 'Resource' . $idGrain);
        $domItem->setAttribute('isvisible', 'true');

        $firstLang = reset($this->languages);
        $name = $this->grainService->getNameByLang($grain, $firstLang[0]);
        $domItem->appendChild($this->dom->createElement('title', $name));


        $domPrereq = $this->dom->createElement('adlcp:prerequisites');
        $domPrereq->setAttribute('type', 'aicc_script');
        $domItem->appendChild($domPrereq);

        $masteryScore = $grain->getScoreTotal();
        
        if ($masteryScore != '' && $masteryScore != 0)
        {
            $domItem->appendChild($this->dom->createElement('adlcp:masteryscore', $masteryScore));
        }

        $maxTimeAllowed = date_format($grain->getMaximumTime(), "H:i:s");
        if ($maxTimeAllowed != "00:00:00")
        {
            $domItem->appendChild($this->dom->createElement('adlcp:maxtimeallowed', $maxTimeAllowed));
            $domItem->appendChild($this->dom->createElement('adlcp:timelimitaction', $grain->getActionTimeLimit()));
        }

        return $domItem;
    }


    private function domResources() : DOMElement
    {
        $domResources = $this->dom->createElement('resources');
        if (!$this->monograin)
        {
            if (count($this->languages) > 1)
            {
                $domGrain = $this->dom->createElement('resource');
                $domGrain->setAttribute('adlcp:scormtype','asset');
                $domGrain->setAttribute('type','webcontent');
                $domGrain->setAttribute('identifier','ResourceLanguages');

                $href = './_languages.html';
                if ($href != '')
                {
                    $domGrain->setAttribute('href', $href);
                }

                $domFile = $this->domFile($href);
                $domGrain->appendChild($domFile);

                // Depency
                $domDep = $this->dom->createElement('depency');
                $domDep->setAttribute('identifier', 'DependencyLanguages');
                
                $domGrain->appendChild($domDep);

                
		        $domResources->appendChild($domGrain);

                $html = file_get_contents(__DIR__ . '/../../../templates/_language.html');
                $css = file_get_contents(__DIR__ . '/../../../templates/multi-lang.css');
                if ($html != '')
                {
                    $html = str_replace('__COOKIE__', $this->jsCookyKey, $html);
                    $html = str_replace('__TRAINING_TITLE__', $this->training->getName(), $html);
                    $html = str_replace('__LANGUAGE_CHOICE__TITLE__', $this->trans->trans('language.choice.title', [],'text', $this->security->getUser()->getLanguage()->getLanguageCode()), $html);
                    $svg = file_get_contents(__DIR__ . '/../../../../public/assets/img/arrow_right2.svg');
                    $svg = str_replace("<?xml version=\"1.0\" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>", "", $svg);
                    $langHtml = '';
                    foreach($this->languages as $lang)
                    {
                        $iso = $lang->getIsoCode6391();
                        $image = file_get_contents(__DIR__ . '/../../../../public/assets/img/flag/' . $iso . '-flag-big.png');
                        $base64 = base64_encode($image);
                        $langHtml .= '<li id="'. $iso .'">
                                        <a href="#">
                                            <img src="data:image/png;base64, '. $base64 .'" class="flags">
                                            <p class="lang_name_language">'. $lang->getLabel() .'</p>
                                            <span>'. $svg .'</span>
                                        </a>
                        
                        ';
                    }

                    $html = str_replace('__LANGUAGE_FLAG_GENERATION__', $langHtml, $html);

                    file_put_contents($this->tmpPath . '/_languages.html', $html);
                    file_put_contents($this->tmpPath . '/multi-lang.css', $css);
                    
                    $this->zPages[] = $this->tmpPath . '/_languages.html';
                }
                else
                {
                    throw new Exception("Une erreur est survenue lors de la copie de la page du choix de langue");
                }
            }

            $grains = $this->training->getGrains();

        
            foreach($grains as $grain)
            {
                $domGrain = $this->domGrain($grain);
                $domResources->appendChild($domGrain);
            }
            
            foreach($this->dependencies as $depId => $depFiles)
            {
                $domAsset = $this->domResource('asset', $depId, '', $depFiles);
                $domResources->appendChild($domAsset);
            }
        }
        else
        {
            $domGrain = $this->dom->createElement("resource");
            $domGrain->setAttribute("adlcp:scormtype", "sco");
            $domGrain->setAttribute("type", "webcontent");
            $domGrain->setAttribute("identifier", "Resource1");
            $domGrain->setAttribute("href", "shared/launchpage.html");
            $grains = $this->training->getGrains();
            $page = "pageArray = new Array(".count($grains).");  \n";

            $quiz = false;

            foreach($grains as $key => $g)
            {
                $file = $this->dom->createElement("file");

                $file->setAttribute("href", "./" . Utils::satanizeFileName($g->getName() . $g->getId()) . '.html');

                $this->generateHtmlPages($g);

                $page .= 'pageArray[' . $key .'] = "'  . Utils::satanizeFileName($g->getName() . $g->getId()) . '.html"' . "\n";

                if ($quiz == false)
                {
                    $quiz = $this->grainService->hasQuestion($g->getId());
                }

                $domGrain->appendChild($file);
            }

            $this->fileSystem->mkdir($this->tmpPath . '/shared');


            $html = file_get_contents(__DIR__ . '/../../../templates/shared/launchpage.html');

            $html = str_replace("__PAGE_NAMES__", $page, $html);
            $html = str_replace("__isQuiz__", $quiz ? "true" : "false", $html);

            if (count($this->languages) > 1)
            {
                $html = str_replace("__MULTILANGUE__", "true", $html);
            }
            else
            {
                $html = str_replace("__MULTILANGUE__", "false", $html);
            }

            file_put_contents($this->tmpPath . '/shared/launchpage.html', $html);

            $file = $this->dom->createElement("file");

            $file->setAttribute("href", "shared/launchpage.html");

            $domGrain->appendChild($file);

            $domResources->appendChild($domGrain);
        }

        return $domResources;
    }

    /**
     * Créer l'element file pour le SCORM
     *
     * @param string $href
     * @return DOMElement
     */
    private function domFile(string $href) : DOMElement
    {
        $domFile = $this->dom->createElement('file');

        $domFile->setAttribute('href', $href);

        return $domFile;
    }

    private function domGrain(Grain $grain) : DOMElement
    {
        $type = ($this->grainService->hasQuestion($grain->getId()) || $this->grainService->hasTimeAllowed($grain)) ? '_SCO' : '_ASSET';

        $blocks = $grain->getBlockGrains();
        $blocOptions = array(); 
        $i = 0;

        $relGrainRes = array();

        $identifier = 'Resource' . $grain->getId();

        foreach($blocks as $block)
        {
            $options = $block->getCode();
            if (!$this->PDFReader && $block->getType() == "_PDF_READER")
            {
                $this->PDFReader = true;
            }

            $resources = array();
            $neutral = false;
            $i = 0;

            while($neutral == false && $i < count($this->languages))
            {
                $neutral = $this->get_string_between($block->getCode(), 'neutral="', '"');

                if ($neutral != "")
                {
                    array_push($resources, $this->get_string_between($block->getCode(), 'url_' . $neutral . '="', '"'));
                    $neutral = true;
                }
                else
                {
                    $lang = $this->languages[0];

                    $resource = $this->get_string_between($block->getCode(), 'url_' . $lang->getIsoCode6391() . '="', '"');

                    if ($resource != "")
                        array_push($resources, $resource);
                    $i++;
                }
            }

            foreach($resources as $resName => $packageRelName)
            {
                // On ne prend pas les resource en http car elle sont des resources externe
                if (preg_match("#http[s]?://#",$packageRelName) === 1)
                {
                    // Bibliothèque du module
                    if (strstr($packageRelName, '/resources/'))
                    {
                        // On récupère la partie de l'URL à la suite du premier /resources/
                        $resourcesPos = strpos($packageRelName, '/resources/');
                        $resourcesPos += 11; // longueur de '/resources/'
                        $packageRelName = substr($packageRelName, $resourcesPos);
                        $srcFullName = $this->trainingReaderService->getTrainingPath($this->training) . $packageRelName;
                    }
                    // Bibliothèque général
                    else
                    {
                        $srcFullName = $packageRelName;
                        $packageRelName = explode('/', $packageRelName);
                        $packageRelName = end($packageRelName);
                    }
                }
                else
                {
                    $srcFullName = $this->trainingReaderService->getTrainingPath($this->training) . $packageRelName;
                }

                $packageRelName = urldecode($packageRelName);
                $packageFullName = $this->tmpPath . '/resources/' . $packageRelName; 


                // Création du dossier de destination
                $pFullName = urldecode($packageFullName);

                $this->fileSystem->mkdir(dirname($pFullName), 0755);

                $headers = @get_headers($srcFullName);
                if (strpos($headers[0], '200') === false)
                {
                    if(strpos($headers[0], '404') === false)
                    {
                        break;
                    }
                    else
                    {
                        throw new Exception("Le fichier " . $packageRelName . " est introuvable");
                    }
                }

                @copy($srcFullName, $pFullName);

                $options = str_ireplace($srcFullName, 'resources/' . $packageRelName, $block->getCode());

                $relGrainRes[] = './' . 'resources/' . $packageRelName;
            }
            $blocOptions[$i++] = $options;
        }

        $relGrainRes = array_unique($relGrainRes);

        $langs = array();

        $firstLang = reset($this->languages);
        $name = $this->grainService->getNameByLang($grain, $firstLang[0]);
        $pageHref = './' . Utils::satanizeFileName($name . $grain->getId()) . '.html';

        $files = array($pageHref);

        foreach($this->languages as $lang)
        {
            $langs[] = $lang->getIsoCode6391();
        }

        $this->generateHtmlPages($grain);

        $i = 0;
        $domGrain = $this->domResource($type == '_ASSET' ? 'asset' : 'sco', $identifier, $pageHref, $files);


        if (count($relGrainRes) > 0)
        {
            $depId = 'Dependency' . $grain->getId();
            $this->dependencies[$depId] = $relGrainRes;

            $domDep = $this->dom->createElement('dependency');
            $domDep->setAttribute('identifier', $depId);
            $domGrain->appendChild($domDep);
        }

        return $domGrain;
    }

    private function domResource(string $type, string $identifier, string $href, array $files)
    {
        $domSco = $this->dom->createElement('resource');
        $domSco->setAttribute('adlcp:scormtype', $type);
        $domSco->setAttribute('type', 'webcontent');
        $domSco->setAttribute('identifier', $identifier);

        $domSco->setAttribute('href', $href);

        foreach($files as $fileName)
        {
            $domFile = $this->domFile($fileName);
            $domSco->appendChild($domFile);
        }

        return $domSco;
    }

    private function generateHtmlPages(Grain $grain): void
    {
        $html = file_get_contents(__DIR__ . '/../../../templates/export-template.html');
        
        $html = str_replace("__COOKIE_LANG__", time() . '_' . $this->training->getId() . '_lang', $html);

        $firstLang = reset($this->languages);
        $name = $this->grainService->getNameByLang($grain, $firstLang[0]);
        $html = str_replace("__TITLE__", $name, $html);
        $html = str_replace("__NAME_MODULE__", $grain->getTraining()->getName(), $html);
        $html = str_replace("__QUIZ_TRANSLATION__", Utils::generateLang($this->languages), $html);

        if ($this->grainService->hasQuestion($grain->getId()))
        {
            $html = str_replace("__BEGIN_FORM__", '<form name="QUIZ_'. $grain->getId() .'" id="QUIZ_'.$grain->getId().'" class="quiz">', $html);
            $html = str_replace("__END_FORM__", Utils::generateButtonValidate(), $html);
            $html = str_replace("__GENERATE_QUIZ__", Utils::generateAllQuestion($grain, $this->questionService, $this->languages), $html);
            $quizTemplate = file_get_contents(__DIR__ . '/../../templates/scormOption/quiz-template.js');
            $html = str_replace('__QUIZ_TEMPLATE__', '<script>' . $quizTemplate . '</script>', $html);
        }
        else
        {
            $html = str_replace("__BEGIN_FORM__", "", $html);
            $html = str_replace("__END_FORM__", "", $html);
            $html = str_replace("__GENERATE_QUIZ__", "", $html);
            $html = str_replace('__QUIZ_TEMPLATE__', '', $html);
        }

        if ($this->grainService->hasTimeAllowed($grain))
        {
            $timerTemplate = file_get_contents(__DIR__ . '/../../../templates/scormOption/quiz-template.js');
            $html = str_replace("__JS_TIMER__", $timerTemplate, $html);
            $timerTemplate = file_get_contents(__DIR__ . '/../../../templates/scormOption/timer-template.html');
            $html = str_replace("__TIMER__", $timerTemplate, $html);
        }
        else
        {
            $timerTemplate = file_get_contents(__DIR__ . '/../../../templates/scormOption/quiz-template.js');
            $html = str_replace("__JS_TIMER__", $timerTemplate, $html);
            $html = str_replace("__TIMER__", "", $html);
        }


        $html = str_replace("__ACTION_EXIT__", "'" . $grain->getActionTimeLimit() . "'", $html);

        $html = str_replace('__BANIERE_OPEN_CREA__', "", $html);

        $html = str_replace("__BLOCK__", Utils::generateBlock($grain->getBlockGrains(), $this->languages, $this->blockService, $this->questionService), $html);
        $html = str_replace("__GENERATE_QUIZ__", "", $html);

        $firstLang = reset($this->languages);
        $name = $this->grainService->getNameByLang($grain, $firstLang[0]);
        file_put_contents(Utils::satanizeFileName($this->tmpPath . '/' . $name . $grain->getId() . '.html'), $html);
    }

    public function isDownloaded(array $data) : string
    {
        $training = $this->trainingRepository->findOneBy(['id' => $data['id']]);

        $zip = new ZipArchive();
        
        if ($data['monograin'] === "true")
        {
            if ($zip->open(Utils::satanizeFileName(__DIR__ . '/../../../public/' . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid() . '/monograin/' . $training->getName()) . '.scorm.zip') == true || $zip->open(Utils::satanizeFileName(__DIR__ . '/../../../public/' . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid() . '/scorm12/' . $training->getName()) . '.scorm.zip') == ZipArchive::ER_READ)
            {
                return Utils::satanizeFileName($_ENV['BACK_ORIGIN_URL'] . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid() . '/monograin/' .  $training->getName()) . '.scorm.zip';
            }
            else
            {
                return "";
            }
        }
        else
        {
            if ($zip->open(Utils::satanizeFileName(__DIR__ . '/../../../public/' . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid() . '/scorm12/' . $training->getName()) . '.scorm.zip') == true || $zip->open(Utils::satanizeFileName(__DIR__ . '/../../../public/' . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid() . '/scorm12/' . $training->getName()) . '.scorm.zip') == ZipArchive::ER_READ)
            {
                return Utils::satanizeFileName($_ENV['BACK_ORIGIN_URL'] . $this->security->getUser()->getSociety()->getId() . '/' . $training->getUuid() . '/scorm12/' .  $training->getName()) . '.scorm.zip';
            }
            else
            {
                return "";
            }
        }
    }


    /**
     * Permet de récuperer un bout de chaine entre deux
     *
     * @param string $string
     * @param string $start
     * @param string $end
     * @return string
     */
    private function get_string_between(string $string, string $start, string $end) : string
    {
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }
}
