<?php

namespace App\Service;

use DateTime;
use Exception;
use App\Entity\BlockGrain;
use App\Exception\BlockException;
use App\Repository\GrainRepository;
use App\Repository\BlockGrainRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Translation\Translator;
use App\Repository\TrainingLanguageRepository;
use Symfony\Contracts\Translation\TranslatorInterface;
use function htmlspecialchars;

class QuestionService
{

    private $blockGrainRepository;
    private $grainRepository;
    private $entityManagerInterface;
    private $trainingLanguageRepository;
    private $security;
    private $translator;

    function __construct(
        BlockGrainRepository $blockGrainRepository,
        GrainRepository $grainRepository,
        EntityManagerInterface $entityManagerInterface,
        TrainingLanguageRepository $trainingLanguageRepository,
        TranslatorInterface $translator,
        Security $security
    )
    {
        $this->blockGrainRepository = $blockGrainRepository;
        $this->grainRepository = $grainRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->trainingLanguageRepository = $trainingLanguageRepository;
        $this->security = $security;
        $this->translator = $translator;
    }


    /**
     * Permet d'enregistrer la question en base de données
     *
     * @return void
     */
    public function save(array $data) : array
    {
        // Variable pour savoir si la question exister déjà
        $exist = false;
        if (isset($data['id']) && $data['id'] !== null)
        {
            $exist = true;
            $block = $this->blockGrainRepository->findOneBy(['id' => $data['id']]);
        }
        else
        {
            $block = new BlockGrain();
        }

        $grain = $this->grainRepository->findOneBy(['id' => $data['grain_id']]);
        $training = $grain->getTraining();

        if (!$exist)
        {
            $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";

            $xml .= '<options ';

            foreach($data['options'] as $key => $value)
            {
                if ($key === 'similar')
                {
                    if ($value === true)
                    {
                        $xml .= 'neutral="' . $data['lang'] . '" ';
                    }
                    else
                    {
                        $xml .= 'neutral="" ';
                    }
                }
                elseif($key === 'answers')
                {
                    foreach ($value as $k => $v)
                    {
                        $xml .= 'answer_' . $k . '_' . $data['lang'] . '="'. $v['value'] .'" ';
                        $xml .= 'correct_' . $k . '="'. $v['correct'] .'" ';
                    }
                }
                elseif($key === 'items')
                {
                    foreach($value as $k => $v)
                    {
                        $xml .= 'item_' . $k . '_' . $data['lang'] . '="' . $v . '" ';
                    }
                }

                elseif($key === 'categorys')
                {
                    foreach($value as $k => $v)
                    {
                        $xml .= 'category_' . $k . '_' . $data['lang'] . '="' . $v . '" ';
                    }
                }

                elseif($key === 'exemplars')
                {
                    foreach($value as $k => $v)
                    {
                        $xml .= 'exemplar_' . $k . '_' . $data['lang'] . '="' . $v . '" ';
                    }
                }
                elseif($key === 'matches')
                {
                    foreach($value as $k => $v)
                    {
                        $xml .= 'match_' . $k . '_' . $data['lang'] . '="' . $v['exemplar'] . '.'. $v['category'] . '" ';
                    }
                }
                else
                {
                    $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                    $xml .= $key . "_" . $data['lang'] . '="' . $this->translator->trans($value,[],'text',$this->security->getUser()->getLanguage()->getLanguageCode()) . '" ';
                }
            }
            $block->setCoef($data['question_score'] / $grain->getScoreTotal());
            $block->setQuestionScore($data['question_score']);
            $xml .= 'weight="' . $block->getCoef() . '" ';



            if (!isset($data['id']) && $data['id'] === null){
                $trainingLanguage = $this->trainingLanguageRepository->findOneBy(['iso_code_6391' => $data['lang']]);
                $xml .= 'feedback_correct_' . $data['lang'] .'="'. $trainingLanguage->getFeedbackCorrectLabel() .'" ';
                $xml .= 'feedback_incorrect_' . $data['lang'] .'="'. $trainingLanguage->getFeedbackIncorrectLabel() .'" ';
            }
            $xml .= "/>";
        }
        else
        {
            $code = $block->getCode();

            $code = str_replace("/>", "", $code);

            $parameter = $this->getParameter($data);


            foreach($data['options'] as $key => $value)
            {
                if ($key === 'similar')
                {
                    if ($value === true)
                    {
                        $code = str_replace('neutral="' . $this->get_string_between($code, 'neutral="', '"'), 'neutral="' . $data['lang'] . '"', $code);
                    }
                }
                elseif($key === 'answers')
                {
                    foreach ($value as $k => $v)
                    {
                        if (strpos($code, 'answer_' . $k . '_' . $data['lang'] . '="') !== false)
                        {
                            $code = str_replace('answer_' . $k . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'answer_' . $k . '_' . $data['lang'] . '="', '"') .'" ', 'answer_' . $k . '_' . $data['lang'] . '="'. $v['value'] .'" ', $code);
                            $code = str_replace('correct_' . $k . '="'. $this->get_string_between($code, 'correct_' . $k . '="', '"') .'" ', 'correct_' . $k  . '="'. $v['correct'] .'" ', $code);
                        }
                        else
                        {
                            $code .= 'answer_' . $k . '_' . $data['lang'] . '="'. $v['value'] .'" ';
                            $code .= 'correct_' . $k . '="'. $v['correct'] .'" ';
                        }
                    }
                    if (!empty($parameter['options']['answers'][$data['options']['nAnswers']]))
                    {
                        for ($i = $data['options']['nAnswers']; $i < count($parameter['options']['answers']); $i++)
                        {
                            $code = str_replace('answer_' . $i . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'answer_' . $i . '_' . $data['lang'] . '="', '"') .'" ', '', $code);
                            $code = str_replace('correct_' . $i . '="'. $this->get_string_between($code, 'correct_' . $i . '="', '"') .'" ', "", $code);
                        }
                    }
                    $code = str_replace('nAnswers_' . $data['lang'] . '="'. $this->get_string_between($code, 'nAnswers_' . $data['lang'] . '="', '"') .'" ', 'nAnswers_' . $data['lang'] . '="'. $data['options']['nAnswers'] .'" ', $code);
                }
                elseif($key === 'items')
                {
                    foreach($value as $k => $v)
                    {
                        if (strpos($code, 'item_' . $k . '_' . $data['lang'] . '="') !== false)
                        {
                            $code = str_replace('item_' . $k . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'item_' . $k . '_' . $data['lang'] . '="', '"') .'" ', 'item_' . $k . '_' . $data['lang'] . '="'. $v .'" ', $code);
                        }
                        else
                        {
                            $code .= 'item_' . $k . '_' . $data['lang'] . '="' . $v . '" ';
                        }
                    }
                    if (!empty($parameter['options']['items'][$data['options']['nItems']]))
                    {
                        for ($i = $data['options']['nItems']; $i < count($parameter['options']['items']); $i++)
                        {
                            $code = str_replace('item_' . $i . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'item_' . $i . '_' . $data['lang'] . '="', '"') .'"', '', $code);
                        }
                    }
                }

                elseif($key === 'categorys')
                {
                    foreach($value as $k => $v)
                    {
                        if (strpos($code, 'category_' . $k . '_' . $data['lang'] . '="') !== false)
                        {
                            $code = str_replace('category_' . $k . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'category_' . $k . '_' . $data['lang'] . '="', '"') .'" ', 'category_' . $k . '_' . $data['lang'] . '="'. $v .'" ', $code);
                        }
                        else
                        {
                            $code .= 'category_' . $k . '_' . $data['lang'] . '="' . $v . '" ';
                        }
                    }
                    if (!empty($parameter['options']['categorys'][$data['options']['nCategory']]))
                    {
                        for ($i = $data['options']['nCategory']; $i < count($parameter['options']['categorys']); $i++)
                        {
                            $code = str_replace('category_' . $i . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'category_' . $i . '_' . $data['lang'] . '="', '"') .'"', '', $code);
                        }
                    }
                }

                elseif($key === 'exemplars')
                {
                    foreach($value as $k => $v)
                    {
                        if (strpos($code, 'exemplar_' . $k . '_' . $data['lang'] . '="') !== false)
                        {
                            $code = str_replace('exemplar_' . $k . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'exemplar_' . $k . '_' . $data['lang'] . '="', '"') .'" ', 'exemplar_' . $k . '_' . $data['lang'] . '="'. $v .'" ', $code);
                        }
                        else
                        {
                            $code .= 'exemplar_' . $k . '_' . $data['lang'] . '="' . $v . '" ';
                        }

                    }

                    if (!empty($parameter['options']['exemplars'][$data['options']['nExemplar']]))
                    {
                        for ($i = $data['options']['nExemplar']; $i < count($parameter['options']['exemplars']); $i++)
                        {
                            $code = str_replace('exemplar_' . $i . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'exemplar_' . $i . '_' . $data['lang'] . '="', '"') .'" ', '', $code);
                        }
                    }
                }
                elseif($key === 'matches')
                {
                    foreach($value as $k => $v)
                    {
                        if (strpos($code, 'match_' . $k . '_' . $data['lang'] . '="') !== false)
                        {
                            $code = str_replace('match_' . $k . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'match_' . $k . '_' . $data['lang'] . '="', '"') .'" ', 'match_' . $k . '_' . $data['lang'] . '="'. $v['exemplar'] . '.' . $v['category'] . '" ', $code);
                        }
                        else
                        {
                            $code .= 'match_' . $k . '_' . $data['lang'] . '="' . $v['exemplar'] . '.' . $v['category'] . '" ';
                        }
                    }

                    if (!empty($parameter['options']['matches'][$data['options']['nMatch']]))
                    {
                        for ($i = $data['options']['nMatch']; $i < count($parameter['options']['matches']); $i++)
                        {
                            $code = str_replace('match_' . $i . '_' . $data['lang'] . '="'. $this->get_string_between($code, 'match_' . $i . '_' . $data['lang'] . '="', '"') .'" ', '', $code);
                        }
                    }
                }
                else
                {
                    if (strpos($code, $key. '_' . $data['lang'] . '="') !== false)
                    {
                        $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                        $code = str_replace($key. '_' . $data['lang'] . '="' . $this->get_string_between($code, $key . '_' . $data['lang'] . '="', '"') . '"', $key. '_' . $data['lang'] . '="' . $value . '"', $code);
                    }
                    else
                    {
                        $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                        $code .= $key . "_" . $data['lang'] . '="' . $value . '" ';
                    }
                }
            }
            $block->setCoef($data['question_score'] / $grain->getScoreTotal());
            $block->setQuestionScore($data['question_score']);
            if (strpos($code, "feedback_correct_" . $data['lang']) === false)
            {
                $trainingLanguage = $this->trainingLanguageRepository->findOneBy(['iso_code_6391' => $data['lang']]);
                $code .= 'feedback_correct_' . $data['lang'] .'="'. $trainingLanguage->getFeedbackCorrectLabel() .'" ';
                $code .= 'feedback_incorrect_' . $data['lang'] .'="'. $trainingLanguage->getFeedbackIncorrectLabel() .'" ';
            }

            $code .= "/>";
        }


        $block->setCode(!isset($xml) ? $code : $xml);
        $block->setGrain($grain);
        $block->setPosition($data['position']);
        $block->setType($data['type']);

        $grain->setUpdatedAt(new DateTime());
        $training->setUpdatedAt(new DateTime());

        $this->entityManagerInterface->persist($block);
        $this->entityManagerInterface->persist($grain);
        $this->entityManagerInterface->persist($training);
        $this->entityManagerInterface->flush();

        return $block->toArray();
    }


    /**
     * Fonction pour generer le HTML du block grâce au fichier JSON dans public
     *
     * @param BlockGrain $block Le bloc que l'on veux traduire en HTML
     * @param string $language La langue du module
     * @param bool $finish permet de dire si on veux mettre le </div> ne pas le mettre pour le scorm par defaut true
     * @param bool $autocomplet savoir si on prend la premier langue qu'on vois pour la génération si jamais la traduction existe pas
     * @return string le code HTML en clair
     */
    public function generateHtml(BlockGrain $block, string $language, string $disabled = 'disabled="disabled"', string $defaultChecked = 'checked=""', bool $finish = true, bool $autocomplet = true) : array
    {

        $html = '';

        $code = '';

        $trainingLanguage = $this->trainingLanguageRepository->findOneBy(['iso_code_6391' => $language]);

        $html .= '    <div class="cle-quiz-box cle-quiz-title">';

        if (!$this->get_string_between($block->getCode(), 'description_' . $language . '="', '"'))
        {
            if ($autocomplet)
            {
                preg_match('/description_(.?\w)="/', $code, $language);
                $language = $language[1];
            }
        }

        $html .= "      " . html_entity_decode($this->get_string_between($block->getCode(), 'description_' . $language . '="', '"'), ENT_QUOTES, "UTF-8");

        $html .= '    </div>';

        switch($block->getType())
        {
            case '_QUIZ_TRUE_FALSE':
                $html .= '<div class="cle-quiz-box cle-quiz-true-false">';
                $html .= '<input id="answer_'. $block->getId() .'_t" type="radio" group="group_'. $block->getId() .'" name="group_'. $block->getId() .'" value="'. $trainingLanguage->getAnswerTrueLabel() .'" '. $disabled .' '.$defaultChecked.'>';
                $html .= '<label id="label_answer_'. $block->getId() .'_t" style="width: auto;" for="answer_'. $block->getId() .'_t">'. $trainingLanguage->getAnswerTrueLabel() .'</label>';
                $html .= '<input id="answer_'. $block->getId() .'_f" type="radio" group="group_'. $block->getId() .'" name="group_'. $block->getId() .'" value="'. $trainingLanguage->getAnswerFalseLabel() .'" '. $disabled .'>';
                $html .= '<label id="label_answer_'. $block->getId() .'_f" style="width: auto;" for="answer_'. $block->getId() .'_f">'. $trainingLanguage->getAnswerFalseLabel() .'</label>';
                $finish ? $html .= '</div>' : '';
                break;
            case '_QUIZ_NUMERIC':
                $html .= '<div class="cle-quiz-box cle-quiz-numeric">';

                if(!$this->get_string_between($block->getCode(), 'answer_' . $language . '="', '"') && $this->get_string_between($block->getCode(), 'answer_' . $language . '="', '"') != 0)
                {
                    if ($autocomplet)
                    {
                        preg_match('/answer_(.?\w)="/', $code, $language);
                        $language = $language[1];
                    }
                }
                if ($autocomplet)
                {
                    $html .= '<input id="'. $block->getId() .'" class="cle-quiz-numeric" value="'. $this->get_string_between($block->getCode(), 'answer_' . $language . '="', '"') .'" '. $disabled .' />';
                }
                else
                {
                    $html .= '<input id="'. $block->getId() .'" class="cle-quiz-numeric" value="0" '. $disabled .' />';
                }

                $finish ? $html .= '</div>' : '';
                break;
            case '_QUIZ_MCQ':
                $html .= '<div class="cle-quiz-box cle-quiz-qcm">';
                if (!$this->get_string_between($block->getCode(), 'nAnswers_' . $language . '="', '"'))
                {
                    preg_match('/nAnswers_(.?\w)="/', $code, $language);
                    $language = $language[1];
                }
                for ($i = 0; $i < $this->get_string_between($block->getCode(), 'nAnswers_' . $language . '="', '"'); $i++)
                {
                    if ($this->get_string_between($block->getCode(), 'correct_' . $i . '="', '"') === "1")
                    {
                        if (strpos($block->getCode(), '_MCQ') !== false)
                            $html .= '<input id="answer_'.$block->getId().'_'. $i .'" type="checkbox" '. $disabled .' '. $defaultChecked .' name="answer_'.$block->getId().'_'. $i .'">';
                        else
                            $html .= '<input id="answer_'.$block->getId().'_'. $i .'" type="radio" '. $disabled .' '.$defaultChecked.' name="answer_'.$block->getId().'_'. $i .'">';
                    }
                    else
                    {
                        if (strpos($block->getCode(), '_MCQ') !== false)
                            $html .= '<input id="answer_'.$block->getId().'_'. $i .'" type="checkbox" '. $disabled .' name="answer_'.$block->getId().'_'. $i .'">';
                        else
                            $html .= '<input id="answer_'.$block->getId().'_'. $i .'" type="radio" '. $disabled .' name="answer_'.$block->getId().'_'. $i .'">';
                    }

                    if (!$this->get_string_between($block->getCode(), 'answer_' . $i . '_' . $language . '="', '"'))
                    {
                        if ($autocomplet)
                        {

                            preg_match('/answer_(.?\w)="/', $code, $language);
                            $language = $language[1];
                        }
                    }

                    $html .= '<label id="label_answer_'.$block->getId().'_'. $i .'" for="answer_'.$block->getId().'_'. $i .'"> '. $this->translator->trans($this->get_string_between($block->getCode(), 'answer_' . $i . '_' . $language . '="', '"'), [], 'text', $this->security->getUser()->getLanguage()->getLanguageCode()) .'</label>';
                    $html .= '<br>';
                }
                $finish ? $html .= '</div>' : '';
                break;
            case '_QUIZ_GAPS':
                $html .= '<div class="cle-quiz-box cle-quiz-cloze">';
                $code = "";
                if (!$this->get_string_between($block->getCode(), "text_" . $language . '="', '"'))
                {
                    if ($autocomplet)
                    {

                        preg_match('/text_(.?\w)="/', $code, $language);
                        $language = $language[1];
                    }

                }

                $code = $this->get_string_between($block->getCode(), "text_" . $language . '="', '"');
                preg_match_all('/\[(.*?)\]/', $code, $matches);
                foreach($matches[0] as $key => $match)
                {
                    if ($autocomplet)
                    {
                        $code = str_replace($match, '<input id="answer_'. $block->getId() .'_'. $key .'" type="text" style="text-align: center;max-width: 100%" name="answer_'. $block->getId() .'_'. $key .'" '. $disabled .' value="'. $matches[1][$key] .'">' ,$code);
                    }
                    else
                    {
                        $code = str_replace($match, '<input id="answer_'. $block->getId() .'_'. $key .'" type="text" style="text-align: center;max-width: 100%" name="answer_'. $block->getId() .'_'. $key .'" '. $disabled .' value="0">' ,$code);
                    }
                }

                $html .= html_entity_decode($code, ENT_QUOTES, "UTF-8");
                $finish ? $html .= '</div>' : '';
                break;
            case '_QUIZ_LIKERT':
                $html .= '<div class="cle-quiz-box cle-quiz-likert">';
                $html .= '<span class="cle-quiz-likert-span">Note actuelle</span>';
                $html .= ':';
                $html .= '<span id="'. $block->getId() .'_val">aucune</span>';
                $html .= '<br>';
                $html .= '<div class="cle-quiz-likert">';
                $html .= '<span class="rating">';
                if (!$this->get_string_between($block->getCode(), 'nItems_' . $language . '="', '"'))
                {
                    if ($autocomplet)
                    {
                        preg_match('/nItems_(.?\w)="/', $code, $language);
                        $language = $language[1];
                    }
                }


                for ($i = 0; $i < $this->get_string_between($block->getCode(), 'nItems_' . $language . '="', '"'); $i++)
                {
                    $html .= '<input id="item_'.$block->getId().'_'. $i .'" class="rating-input" type="radio" name="rating-input-'.$block->getId().'_'. $i .'">';
                    $html .= '<label class="rating-star" for="item_'.$block->getId().'_'. $i .'" title="'. $this->get_string_between($block->getCode(), 'item_' . $i . '_' . $language . '="', '"') .'"></label>';
                }

                $html .= '</span>';
                $html .= '</div>';
                $finish ? $html .= '</div>' : '';
                break;
            case '_QUIZ_SEQUENCE':
                $html .= '<div class="cle-quiz-box cle-quiz-sequence">';
                $html .= '<ul class="'. $block->getId() .'" class="">';
                if (!$this->get_string_between($block->getCode(), 'nItems_' . $language . '="', '"'))
                {
                    if ($autocomplet)
                    {
                        preg_match('/nItems_(.?\w)="/', $code, $language);
                        $language = $language[1];
                    }
                }

                for ($i = 0; $i < $this->get_string_between($block->getCode(), 'nItems_' . $language . '="', '"'); $i++)
                {
                    $html .= '<li id="'.$block->getId().'" name="item_'. $block->getId() .'_'. $i .'">';
                    $html .= '<div>';
                    $html .= '<div style="height: auto;">';
                    $html .= '<a class="cle-quiz-sequence-arrow ui-state-disabled" href="#!" style="float: left" onclick="" title=".' . $this->translator->trans("move.down", [], 'text', $this->security->getUser()->getLanguage()->getLanguageCode()) . '."><span class="ui-icon ui-icon-arrowthick-1-n" style="display:block"></span></a>';
                    $html .= '<a class="cle-quiz-sequence-arrow ui-state-disabled" href="#!" style="float: left" onclick="" title=".' . $this->translator->trans("move.up", [], 'text', $this->security->getUser()->getLanguage()->getLanguageCode()) . '."><span class="ui-icon ui-icon-arrowthick-1-s" style="display:block"></span></a>';
                    $html .= '</div>';
                    if ($this->get_string_between($block->getCode(), 'type' . '_' . $language . '="', '"') === "_IMG")
                    {
                        $html .= '<img class="cle-block-img" src="'.$this->get_string_between($block->getCode(), 'item_' . $i . '_' . $language . '="', '"').'">';
                    }
                    elseif ($this->get_string_between($block->getCode(), 'type' . '_' . $language . '="', '"') === "_SND")
                    {
                        $html .= '<audio class="cle-block-audio" src="'.$this->get_string_between($block->getCode(), 'item_' . $i . '_' . $language . '="', '"').'"></audio>';
                    }
                    elseif ($this->get_string_between($block->getCode(), 'type' . '_' . $language . '="', '"') === "_SND")
                    {
                        $html .= '<video class="cle-block-audio" src="'.$this->get_string_between($block->getCode(), 'item_' . $i . '_' . $language . '="', '"').'"></video>';
                    }
                    else
                    {
                        $html .= '<p>'. $this->get_string_between($block->getCode(), 'item_' . $i . '_' . $language . '="', '"') .'</p>';
                    }
                    $html .= '</div>';
                    $html .= '</li>';
                }

                $html .= '</ul>';
                $finish ? $html .= '</div>' : '';
                break;

            case '_QUIZ_MATCH':
                $html .= '<div class="cle-quiz-box cle-quiz-match">';
                if (!$this->get_string_between($block->getCode(), 'nExemplar_' . $language . '="', '"'))
                {
                    if ($autocomplet)
                    {
                        preg_match('/nExemplar_(.?\w)="/', $code, $language);
                        $language = $language[1];
                    }
                }
                for ($i = 0; $i < $this->get_string_between($block->getCode(), 'nExemplar_' . $language . '="', '"'); $i++)
                {
                    if ($this->get_string_between($block->getCode(), 'type' . '_' . $language . '="', '"') === "_IMG")
                    {
                        $html .= '<img src="'.$this->get_string_between($block->getCode(), 'exemplar_' . $i . '_' . $language . '="', '"').'">';
                    }
                    else
                    {
                        $html .= '<p>'.$this->get_string_between($block->getCode(), 'exemplar_' . $i . '_' . $language . '="', '"').'</p>';
                    }
                    $html .= '<select id="'. $block->getId() .'_'. $i .'" style="display: block; margin-left: auto; margin-right: auto;">';
                    $html .= '<option value="">- '. $this->get_string_between($block->getCode(), 'categoryTitle_' . $language . '="', '"') .' -</option>';
                    for ($j = 0; $j < $this->get_string_between($block->getCode(), 'nCategory_' . $language . '="', '"'); $j++)
                    {
                        $html .= '<option value="'. $block->getId() .'">'.$this->get_string_between($block->getCode(), 'category_' . $j . '_' . $language . '="', '"').'</option>';
                    }
                    $html .= '</select>';
                }
                $finish ? $html .= '</div>' : '';
                break;
            default:
                break;
        }

        return ['code' => $html, 'lang' => $language];
    }

    /**
     * Permet d'avoir l'url propre pour les fichiers
     *
     * @param string $brut_url l'url brut envoyer par le client
     * @return string l'url traiter par l'algo magique
     */
    private function satanizeUrl(string $brut_url) : string
    {
        if (strpos($brut_url, "Bibliothèque générale") !== false)
        {
            // TODO : Laisser ce if que le temps du confinement car mon linux a lacher donc windows
            if (strpos($brut_url, "\\") !== false)
            {
                $url = str_replace('Bibliothèque générale\\', $_ENV['UPLOAD_URL'] . $this->security->getUser()->getSociety()->getName() . '\\', $brut_url);
                $url = str_replace('\\', '/', $url);
            }
            else
                $url = str_replace('Bibliothèque générale/', $_ENV['UPLOAD_URL'] . $this->security->getUser()->getSociety()->getName() . '/', $brut_url);
        }
        else
        {
            $url = $brut_url;
        }

        return $url;
    }

    /**
     * Fonction permettant de récuperer tout les parametres d'un bloc
     *
     * @param array $data
     * @return array
     */
    public function getParameter(array $data) : array
    {
        $block = $this->blockGrainRepository->findOneBy(['id' => $data['id']]);

        $answer = [];

        if ($block === null)
        {
            return array();
        }


        $properties = array();

        preg_match_all('/(\w+)_'. $data['lang'] .'/', $block->getCode(), $props);
        foreach($props[1] as $key => $prop)
        {
            preg_match('/neutral="(.*?)\"/s', $block->getCode(), $neutral);
            if (!empty($neutral[1]))
            {
                preg_match_all('/'. $prop .'_'. $neutral[1] .'="(.*?)\"/s', $block->getCode(), $sqlInfo);
                $content = implode($sqlInfo[1]);

                $properties['options'][$prop] = html_entity_decode($content, ENT_QUOTES, "UTF-8");
            }
            else
            {

	            if ($prop === 'answer')
	            {
		            $properties['options']['answer'] = $this->get_string_between($block->getCode(), $prop . '_' . $data['lang'] . '="', '"');
	            }
                elseif (strpos($prop, 'answer') !== false)
                {
                    $properties['options']['answers'][] = array(
                        'value' => $this->get_string_between($block->getCode(), $prop . '_' .  $data['lang'] . '="', '"'),
                        'correct' => $this->get_string_between($block->getCode(), "correct_" . substr($prop, -1, 1) . '="', '"')
                    );
                }
                elseif (strpos($prop, 'item') !== false)
                {
                    $prop_array = explode("_", $prop);
                    if (strpos($this->get_string_between($block->getCode(), $prop . '_' .  $data['lang'] . '="', '"'), "http") !== false)
                    {
                        $properties['options']['items'][] = $this->satanizeUrl($this->get_string_between($block->getCode(), $prop . '_' .  $data['lang'] . '="', '"'));
                    }
                    else
                    {
                        $properties['options']['items'][] = $this->get_string_between($block->getCode(), $prop . '_' .  $data['lang'] . '="', '"');
                    }
                }
                elseif (strpos($prop, 'exemplar') !== false)
                {
                    $prop_array = explode("_", $prop);
                    if (strpos($this->get_string_between($block->getCode(), $prop . '_' .  $data['lang'] . '="', '"'), "http") !== false)
                    {
                        $properties['options']['exemplars'][] = $this->satanizeUrl($this->get_string_between($block->getCode(), $prop . '_' .  $data['lang'] . '="', '"'));
                    }
                    else
                    {
                        $properties['options']['exemplars'][] = $this->get_string_between($block->getCode(), $prop . '_' .  $data['lang'] . '="', '"');
                    }
                }
                elseif (strpos($prop, 'category_') !== false)
                {
                    $prop_array = explode("_", $prop);
                    $properties['options']['categorys'][] = $this->get_string_between($block->getCode(), $prop . '_' .  $data['lang'] . '="', '"');
                }
                elseif (strpos($prop, 'match') !== false)
                {
                    $prop_array = explode("_", $prop);
                    $value = explode(".", $this->get_string_between($block->getCode(), $prop . '_' .  $data['lang'] . '="', '"'));
                    $properties['options']['matches'][] = array('exemplar' => $value[0], 'category' => $value[1]);
                }
                else
                {
                    preg_match_all('/'. $prop .'_'. $data['lang'] .'="(.*?)\"/s', $block->getCode(), $sqlInfo);
                    $content = implode($sqlInfo[1]);

                    $properties['options'][$prop] = html_entity_decode($content, ENT_QUOTES, "UTF-8");
                }
            }
        }
        $properties['position'] = $block->getPosition();
        $properties['type'] = $block->getType();

        if (strpos($block->getType(), "_QUIZ") !== false)
        {
            $properties['coef'] = $block->getCoef();
            $properties['question_score'] = $block->getQuestionScore();
        }
        return $properties;
    }

    private function basicDescription(BlockGrain $block, int $maxScore = 0) : string
    {
        $info = '';


        $info .= 'question.identifier = ' . $block->getId() ."\n";
        $info .= 'question.feedbackWin = blocks["quiz-'. $block->getId() .'"][lang]["feedbackWin"]' ."\n";
        $info .= 'question.feedbackFail = blocks["quiz-'. $block->getId() .'"][lang]["feedbackFail"]' ."\n";
        $info .= 'question.description = blocks["quiz-'. $block->getId() .'"][lang]["description"]' ."\n";
        if ($maxScore == 0)
        {
            $info .= 'question.maxScore = 1' . "\n";
            $info .= 'question.weight = ';
            if ($block->getCoef() == 0)
                $info .= '1' ."\n";
            else
                $info .= $block->getCoef() ."\n";
        }
        else
        {

            $info .= 'question.maxScore = ' . $block->getQuestionScore() ."\n";
            $info .= 'question.weight = ' . $maxScore ."\n";
        }

        return $info;
    }

    private function basicInformation(string $code, string $lang)
    {
        $content = '';

        $content .= '"' . $lang . '"' . ' : { ';
        $content .= '"feedbackWin": "'. $this->get_string_between($code, "feedback_correct_" . $lang . '="', '"') .'",';
        $content .= '"feedbackFail": "'. $this->get_string_between($code, "feedback_incorrect_" . $lang . '="', '"') .'",';
        $content .= '"description": "'. $this->get_string_between($code, "description_" . $lang . '="', '"') .'"';

        return $content;
    }

    private function getArray(string $type, string $lang, string $code)
    {
        $array = '';

        preg_match_all('/'. $type .'_\d_'.$lang.'="(.*?)"/', $code, $answers);

        foreach ($answers[1] as $key => $answer)
        {
            if (isset($answers[1][$key + 1]))
                $array .= '"' . $answer . '",';
            else
                $array .= '"' . $answer . '"';
        }

        return ['content' => $array, 'count' => count($answers[1])];
    }

    private function toArrayString(array $array, int $begin = 0, int $end = -1) : string
    {

        foreach($array as $key => $value)
        {
            $arr = '';
            if (isset($array[$key + 1]))
                $arr .= '"' . substr($value, $begin, $end) . '",';
            else
                $arr .= '"' . substr($value, $begin, $end) . '"';
        }

        return $arr;
    }

    public function generateJs(BlockGrain $block, array $language) : string
    {
        $js = "";
        $code = $block->getCode();
        switch($block->getType())
        {
            case '_QUIZ_TRUE_FALSE':
                $content = '';
                foreach ($language as $key => $lang)
                {
                    $content .= $this->basicInformation($code, $lang['iso_code_6391']);
                    $content .= '}' . "\n";
                    $content .= isset($language[$key++]) ? ',' : null;
                }
                $js .= 'blocks["quiz-'. $block->getId() .'"] = { '. $content .' }' . "\n";
                $js .= 'var question = new CLEQuizTrueFalse();' . "\n";
                $js .= $this->basicDescription($block) . "\n";

                $js .= 'question.answers[0] =
                {
                    name: "answer_'.$block->getId().'_t",
                    value: "True",
                    label: "True",
                    score: ';
                if ($this->get_string_between($code, "answer_" . $lang['iso_code_6391'] . '="', '"') == "true")
                {
                    $js .= '1' . "\n";
                }
                else
                {
                    $js .= '0' . "\n";
                }
                $js .= '};' . "\n";
                $js .= 'question.answers[1] =
                {
                    name: "answer_'.$block->getId().'_f",
                    value: "False",
                    label: "False",
                    score: ';
                if ($this->get_string_between($code, "answer_" . $lang['iso_code_6391'] . '="', '"') == "false")
                {
                    $js .= '1' . "\n";
                }
                else
                {
                    $js .= '0' . "\n";
                }
                $js .= '};' . "\n";
                $js .= 'quizManager.addQuestion(question);' . "\n";
                break;
            case '_QUIZ_NUMERIC':
                $content = '';
                foreach ($language as $key => $lang)
                {
                    $content .= $this->basicInformation($code, $lang['iso_code_6391'], isset($language[$key++]));
                    $content .= ',"tolerance": ' . $this->get_string_between($code, "tolerance_" . $lang->getIsoCode6391() . '="', '"') . ',';
                    $content .= '"precision": ' . $this->get_string_between($code, "precision_" . $lang->getIsoCode6391() . '="', '"');
                    $content .= '}' . "\n";
                    $content .= isset($language[$key++]) ? ',' : null;
                }
                $js .= 'blocks["quiz-'. $block->getId() .'"] = { '. $content .' }' . "\n";
                $js .= 'var question = new CLEQuizNumeric();' . "\n";
                $js .= $this->basicDescription($block) . "\n";
                $js .= 'question.tolerance = blocks["quiz-'.$block->getId().'"][lang]["tolerance"]' . "\n";
                $js .= 'question.precision = blocks["quiz-'.$block->getId().'"][lang]["precision"]' . "\n";
                $js .= 'question.answers[0] = 
                {
                    name: "'.$block->getId().'",
                    value: 0,
                    label: 0,
                    score: 1
                };' . "\n";

                $js .= 'quizManager.addQuestion(question);' . "\n";
                break;
            case '_QUIZ_MCQ':
                $content = '';
                $count = $this->getArray("answer", 'fr', $code)['count'];
                foreach ($language as $key => $lang)
                {
                    $content .= $this->basicInformation($code, $lang['iso_code_6391'], isset($language[$key++]));
                    $content .= ',"labels": [' . $this->getArray("answer", $lang->getIsoCode6391(), $code)['content'] .']';
                    $content .= '}' . "\n";
                    $content .= isset($language[$key++]) ? ',' : null;
                }
                $js .= 'blocks["quiz-'. $block->getId() .'"] = { '. $content .' }' . "\n";
                $js .= 'var question = new CLEQuizMcq();';
                $js .= $this->basicDescription($block);
                $js .= 'question.isCaseSensitive = blocks["quiz-'.$block->getId().'"][lang]["caseSensitive"]';
                $js .= '
                let fields = blocks["quiz-'. $block->getId() .'"][lang]["fields"]
                for(let i = 0; i < fields.lenght; i++) {
                    question.answers[i] = {
                        name: "answer_" + question.identifier + "_" + i,
                        value: fields[i],
                        label: fields[i],
                        score: 1
                    }
                }
                ' . "\n";

                $js .= 'quizManager.addQuestion(question);' . "\n";
                break;
            case '_QUIZ_GAPS':
                $content = '';
                $matches = array();
                foreach ($language as $key => $lang)
                {
                    preg_match_all('/\[(.*?)\]/', $this->get_string_between($code, "text_" . $lang['iso_code_6391'] . '="', '"'),
	                    $matches);
                    $count = count($matches[1]);
                    $content .= $this->basicInformation($code, $lang['iso_code_6391'], isset($language[$key++]));
                    $content .= ',"fields": [' . $this->toArrayString($matches[1]) .'],';
                    $content .= '"nFields": "'. $count .'",';
                    $content .= '"caseSensitive": "'. $this->get_string_between($code, "caseSensitive_" . $lang['iso_code_6391'] . '="', '"') .'"';
                    $content .= '}' . "\n";
                    $content .= isset($language[$key++]) ? ',' : null;
                }
                $js .= 'blocks["quiz-'. $block->getId() .'"] = { '. $content .' }' . "\n";
                $js .= 'var question = new CLEQuizCloze();' . "\n";
                $js .= $this->basicDescription($block) . "\n";
                for ($i = 0; $i < $count; $i++)
                {
                    $js .= 'question.answers[' . $count . '] = 
                    {
                        name: "answer_'.$block->getId().'_' . $count . '",
                        value: blocks["quiz-'. $block->getId() .'"][lang][' . $i . '],
                        label: blocks["quiz-'. $block->getId() .'"][lang][' . $i . '],
                        score: '. $this->get_string_between($code, "correct_" . $i . '="', '"') == 0 ? '-1' : '1' .'
                    };' . "\n";
                }

                $js .= 'quizManager.addQuestion(question);' . "\n";
                break;
            case '_QUIZ_LIKERT':
                $content = '';
                foreach ($language as $key => $lang)
                {
                    preg_match_all('/item_([0-9])_'.$lang['iso_code_6391'].'="(.*?)"/', $code, $likers);
                    $content .= $this->basicInformation($code, $lang['iso_code_6391'], isset($language[$key++]));
                    $content .= ',"items": ['. $this->toArrayString($likers[2]) .']';
                    $content .= '}' . "\n";
                    $content .= isset($language[$key++]) ? ',' : null;
                }
                $js .= 'blocks["quiz-'. $block->getId() .'"] = { '. $content .' }' . "\n";
                $js .= 'var question = new CLEQuizLikert();' . "\n";
                $js .= $this->basicDescription($block);
                $js .= '
                let items = blocks["quiz-'. $block->getId() .'"][lang]["items"]
                for(var i = 0; i < items.lenght; i++)
                {
                    question.answers[i] = 
                    {
                        name: "item_"+question.identifier+"_"+i,
                        value: items[i],
                        score: 1
                    };
                }
                ' . "\n";
                $js .= 'quizManager.addQuestion(question);' . "\n";
                break;
            case '_QUIZ_SEQUENCE':
                $content = '';
                foreach ($language as $key => $lang)
                {
                    preg_match_all('/item_([0-9])_'.$lang['iso_code_6391'].'="(.*?)"/', $code, $likers);
                    $content .= $this->basicInformation($code, $lang['iso_code_6391'], isset($language[$key++]));
                    $content .= ',"items": ['. $this->toArrayString($likers[2]) .']';
                    $content .= '}'. "\n";
                    $content .= isset($language[$key++]) ? ',' : null;
                }

                $js .= 'blocks["quiz-'. $block->getId() .'"] = { '. $content .' }' . "\n";
                $js .= 'var question = new CLEQuizSequence();' . "\n";
                $js .= $this->basicDescription($block);
                $js .= '
                let items = blocks["quiz-'. $block->getId() .'"][lang]["items"]
                for(var i = 0; i < items.lenght; i++)
                {
                    question.answers[i] = 
                    {
                        name: "item_"+question.identifier+"_"+i,
                        value: items[i],
                        label: "" + items[i],
                        score: 1
                    };
                }
                ' . "\n";
                $js .= 'quizManager.addQuestion(question);' . "\n";
                break;

            case '_QUIZ_MATCH':
                $content = '';
                foreach ($language as $key => $lang)
                {
                    preg_match_all('/exemplar_([0-9])_'.$lang['iso_code_6391'].'="(.*?)"/', $code, $likers);
                    preg_match_all('/match_([0-9])_'.$lang['iso_code_6391'].'="(.*?)"/', $code, $matches);
                    $count = $this->get_string_between($code, "nExemplar_" . $lang['iso_code_6391'] . '="', '"');
                    $content .= $this->basicInformation($code, $lang['iso_code_6391'], isset($language[$key++]));
                    $content .= ',"nItems": '. $count .',';
                    $content .= '"matchesLabels": ['. $this->toArrayString($likers[2]) .'],';
                    $content .= '"matches": ['. $this->toArrayString($matches[2], 2) .']';
                    $content .= '}' . "\n";
                    $content .= isset($language[$key++]) ? ',' : null;
                }
                $js .= 'blocks["quiz-'. $block->getId() .'"] = { '. $content .' }' . "\n";
                $js .= 'var question = new CLEQuizMatch();' . "\n";
                $js .= $this->basicDescription($block, $count);
                $js .= '
                let matches = blocks["quiz-' . $block->getId() . '"][lang]["matches"];
                let matchesLabels = blocks["quiz-' . $block->getId() . '"][lang]["matchesLabels"];
                let nItems = blocks["quiz-' . $block->getId() . '"][lang]["nItems"]
                for(var i = 0; i < nItems; i++)
                {
                    question.answers[i] = 
                    {
                        name: question.identifier+"_"+i,
                        value: matches[i],
                        label: "" + matchesLabels[i],
                        score: 1
                    };
                    $("#" + question.identifier + "_" + i).data("oldSelection", "");
                }
                ' . "\n";
                $js .= 'quizManager.addQuestion(question);' . "\n";
                break;
            default:
                break;
        }
        return $js;
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