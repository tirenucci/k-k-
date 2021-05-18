<?php

namespace App\Service\Export;

use App\Entity\BlockGrain;
use App\Entity\Grain;
use App\Entity\Training;
use App\Repository\TrainingRepository;
use DateTime;
use DOMDocument;
use DOMElement;
use Dompdf\FrameDecorator\Block;

class CreaExportService
{

    private $trainingRepository;

    private $training;

    private $dom;

    public function __construct(TrainingRepository $trainingRepository)
    {
        $this->trainingRepository = $trainingRepository;
    }

    public function createManifest(string $path)
    {
        $this->dom = new DOMDocument('1.0', 'utf-8');

        $this->dom->formatOutput = true;

        $domManifest = $this->createTraining();

        $this->dom->appendChild($domManifest);

        $xml = $this->dom->saveXML();
        $xmlFile = $path . '/creamanifest.xml';

        file_put_contents($xmlFile, $xml);

    }

    public function getTraining(Training $training) : void
    {
        $this->training = $training;
    }

    private function createTraining() : DOMElement
    {
        $trainingElement = $this->dom->createElement('training');

        $trainingElement->setAttribute('name', $this->training->getName());
        $trainingElement->setAttribute('date_creation', $this->training->getCreatedAt()->format("Y-m-d H:i:s"));
        $trainingElement->setAttribute('date_modification', $this->training->getUpdatedAt()->format("Y-m-d H:i:s"));
        $trainingElement->setAttribute('code_lang', $this->training->getLanguageCode());
        $trainingElement->setAttribute('uuid', $this->training->getUuid());
        $trainingElement->setAttribute('version', $this->training->getVersion());
        $trainingElement->setAttribute('show_ponderation', $this->training->getShowPonderation());
        $date = new DateTime();
        $trainingElement->setAttribute('date_archive', $date->format("Y-m-d H:i:s"));
        $trainingElement->setAttribute('skin_uuid', $this->training->getSkin()->getUuid());
        $trainingElement->setAttribute('description', $this->training->getDescription());
        $trainingElement->setAttribute('educ_objective', $this->training->getObjective());
        $trainingElement->setAttribute('prerequesite', $this->training->getPrerequisite());
        $trainingElement->setAttribute('tech_means', $this->training->getTechMeans());
        $trainingElement->setAttribute('educ_means', $this->training->getEducMeans());
        $trainingElement->setAttribute('management', $this->training->getManagement());
        $trainingElement->setAttribute('eval_method', $this->training->getEvalMethod());
        $trainingElement->setAttribute('target_public', $this->training->getPublicTarget());
        $trainingElement->setAttribute('status', $this->training->getStatus());
        $trainingElement->setAttribute('content_validation', $this->training->getContentValidation());
        $trainingElement->setAttribute('tags', $this->training->getTag());
        $trainingElement->setAttribute('languages', $this->getAllLanguages());

        $grains = $this->dom->createElement("grains");
        
        foreach($this->training->getGrains() as $grain)
        {
            $grainElement = $this->createGrain($grain);
            $grains->appendChild($grainElement);
        }

        $trainingElement->appendChild($grains);


        return $trainingElement;
    }

    private function createGrain(Grain $grain) : DOMElement
    {
        $grainElement = $this->dom->createElement("grain");

        $grainElement->setAttribute("name", Utils::satanizeFileName($grain->getName(), false));
        $grainElement->setAttribute("create_at", $grain->getCreatedAt()->format("Y-m-d H:i:s"));
        $grainElement->setAttribute("updated_at", $grain->getUpdatedAt()->format("Y-m-d H:i:s"));
        $grainElement->setAttribute("duration", $grain->getDuration());
        $grainElement->setAttribute("position", $grain->getPosition());
        $grainElement->setAttribute("score_total", $grain->getScoreTotal());
        $grainElement->setAttribute("minimum_time", $grain->getMinimumTime()->format("H:i:s"));
        $grainElement->setAttribute("maximum_time", $grain->getMaximumTime()->format("H:i:s"));
        $grainElement->setAttribute("action_time_limit", $grain->getActionTimeLimit());
        $grainElement->setAttribute("content_validation", $grain->getContentValidation());
        $grainElement->setAttribute("graphic_validation", $grain->getGraphicValidation());
        $grainElement->setAttribute("show_correct_answers", $grain->getShowCorrectAnswers());

        $blocks = $this->dom->createElement("blocks");

        foreach($grain->getBlockGrains() as $block)
        {
            $blockElement = $this->createBlock($block);
            $blocks->appendChild($blockElement);
        }

        $grainElement->appendChild($blocks);

        return $grainElement;
    }

    private function createBlock(BlockGrain $block) : DOMElement
    {
        $blockElement = $this->dom->createElement("block");

        $blockElement->setAttribute("type", $block->getType());
        $blockElement->setAttribute("options", Utils::satanizeFileName(str_replace('"','\"', $block->getCode()), false, false));
        $blockElement->setAttribute("position", $block->getPosition());
        $blockElement->setAttribute("question_score", $block->getQuestionScore());

        return $blockElement;
    }

    private function getAllLanguages() : string
    {
        $allLanguage = $this->training->getLanguage();
        $languages = "";

        foreach($allLanguage as $key => $value)
        {
            if (isset($allLanguage[$key + 1]))
            {
                $languages .= $value->getIsoCode6391() . ";";
            }
            else
            {
                $languages .= $value->getIsoCode6391();
            }
        }


        return $languages;
    }
}
