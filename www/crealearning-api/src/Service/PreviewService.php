<?php

namespace App\Service;

use App\Service\BlockService;
use App\Service\Export\Utils;
use App\Service\GrainService;
use App\Service\QuestionService;
use App\Repository\GrainRepository;
use App\Repository\LanguageRepository;
use App\Repository\TrainingRepository;
use App\Repository\BlockGrainRepository;

class PreviewService
{
    private $training;

    private $grain;
    private $allGrain;

    private $language;
    private $languageCollection;

    private $previewLanguage;

    private $trainingRepository;
    private $languageRepository;
    private $grainRepository;

    private $grainService;
    private $blockService;
    private $questionService;

    private $style;

    private $blockGrainRepository;

    private $blocks;

    public function __construct(
        TrainingRepository $trainingRepository,
        LanguageRepository $languageRepository,
        GrainRepository $grainRepository,
        GrainService $grainService,
        BlockService $blockService,
        QuestionService $questionService,
        BlockGrainRepository $blockGrainRepository
    )
    {
        $this->trainingRepository = $trainingRepository;
        $this->languageRepository = $languageRepository;
        $this->grainRepository = $grainRepository;
        $this->grainService = $grainService;
        $this->blockService = $blockService;
        $this->questionService = $questionService;
        $this->blockGrainRepository = $blockGrainRepository;
    }

    public function generatePreview(string $base64, string $language = null) : array
    {
        $array = \explode("&", \base64_decode($base64));
        $this->getTraining($array[0]);
        $this->getLanguage();

        $this->style = '/assets/skins/' . $this->training->getSkin()->getSkinTheme()->getFolderName() . '/' . $this->training->getSkin()->getFolderName() . '/style.css';

        if (count($this->languageCollection) === 1 && $language === null)
        {
            $this->previewLanguage = $this->languageCollection[0]->getIsoCode6391();
        }
        elseif(count($this->language) > 1 && $language === null)
        {
            return ['lang' => $this->language, 'css' => $this->style];
        }
        else
        {
            $this->previewLanguage = $language;
        }

        $this->getGrain($array[1]);
        $this->getBlock();
        return ["code" => $this->generateHtml(), "name" => $this->grain->getNameByLang($this->previewLanguage), "grains" => $this->allGrain, 'lang' => $this->language, 'css' => $this->style];
    }

    private function getTraining(string $id) : void
    {
        $this->training = $this->trainingRepository->findOneBy(['id' => $id]);
    }

    private function getGrain(string $position) : void
    {
        $this->allGrain = $this->grainService->getAllGrainByTraining(['training_id' => $this->training, 'lang' => $this->previewLanguage]);
        $this->grain  = $this->grainRepository->findOneBy(['position' => $position, 'training' => $this->training]);
    }

    private function getBlock() : void
    {
        $this->blocks = $this->blockGrainRepository->findBy(['grain' => $this->grain], ['position' => 'ASC']);
    }

    private function getLanguage() : void
    {
        $this->languageCollection = $this->training->getLanguage();

        foreach($this->languageCollection as $lang)
        {
            $this->language[] = $lang->toArray();
        }
    }

    private function generateHtml() : string
    {
        $html = file_get_contents(__DIR__ . '/../../templates/export-template.html');
        //$html = str_replace('$.cookie("__COOKIE_LANG__")', '"'  . $this->previewLanguage . '"', $html);
        $html = str_replace("__COOKIE_LANG__", $this->training->getId() . '_lang', $html);
        $html = str_replace("lib/", $_ENV['BACK_LIB_URL'], $html);
        $html = str_replace("__TITLE__", $this->grain->getNameByLang($this->previewLanguage), $html);
        $html = str_replace("__QUIZ_TRANSLATION__", Utils::generateLang($this->languageCollection), $html);
        $html = str_replace("skin/style.css", '/assets/skins/' . $this->training->getSkin()->getSkinTheme()->getFolderName() . '/' . $this->training->getSkin()->getFolderName() . '/style.css', $html);


        if ($this->grainService->hasQuestion($this->grain->getId()))
        {
            $html = str_replace("__BEGIN_FORM__", '<form name="QUIZ_'. $this->grain->getId() .'" id="QUIZ_'.$this->grain->getId().'" class="quiz">', $html);
            $html = str_replace("__END_FORM__", Utils::generateButtonValidate($this->previewLanguage), $html);
            $html = str_replace("__GENERATE_QUIZ__", Utils::generateAllQuestion($this->grain, $this->questionService, $this->language), $html);
            $quizTemplate = file_get_contents(__DIR__ . '/../../templates/scormOption/quiz-template.js');
            $html = str_replace('__QUIZ_TEMPLATE__', $quizTemplate, $html);
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



        if ($this->grainService->hasTimeAllowed($this->grain))
        {
            $timerTemplate = file_get_contents(__DIR__ . '/../../templates/scormOption/quiz-template.js');
            $html = str_replace("__JS_TIMER__", $timerTemplate, $html);
            $timerTemplate = file_get_contents(__DIR__ . '/../../templates/scormOption/timer-template.html');
            $html = str_replace("__TIMER__", $timerTemplate, $html);
        }
        else
        {
            $timerTemplate = file_get_contents(__DIR__ . '/../../templates/scormOption/quiz-template.js');
            $html = str_replace("__JS_TIMER__", $timerTemplate, $html);
            $html = str_replace("__TIMER__", "", $html);
        }


        $html = str_replace("__ACTION_EXIT__", "'" . $this->grain->getActionTimeLimit() . "'", $html);

        $timerTemplate = file_get_contents(__DIR__ . '/../../templates/scormOption/quiz-template.js');
        $html = str_replace("__JS_TIMER__", '<script>' . $timerTemplate . '</script>', $html);
        $html = str_replace('__BANIERE_OPEN_CREA__', "", $html);

        $html = str_replace("__BLOCK__", Utils::generateBlock($this->blocks, $this->languageCollection, $this->blockService, $this->questionService), $html);
        $html = str_replace("__GENERATE_QUIZ__", "", $html);
        
        return $html;
    }
}