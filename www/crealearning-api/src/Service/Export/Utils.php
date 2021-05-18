<?php

namespace App\Service\Export;

use App\Entity\BlockGrain;
use App\Entity\Grain;
use App\Entity\TrainingLang;
use App\Service\BlockService;
use App\Service\QuestionService;
use Doctrine\Common\Collections\Collection;

class Utils 
{
    /**
     * Génére les message prédefinis dans les différente langue
     *
     * @param Collection $langs
     * @return string
     */
    public static function generateLang(Collection $langs) : string
    {
        $jsMessage = '';

        foreach($langs as $lang)
        {
            $jsMessage .= "JSmessages['". $lang->getIsoCode6391() . "'] = {
                'validate_button_label': '" .        $lang->getQuizValidateButtonLabel() . "',
                'quiz_confirmation':'" .             $lang->getQuizConfirmation() . "',
                'quiz_match_invalid': '" .           $lang->getQuizMatchInvalid() . "',
                'quiz_likert_invalid': '" .          $lang->getQuizLikertInvalid() . "',
                'quiz_numeric_invalid': '" .         $lang->getQuizNumericInvalid() . "',
                'quiz_cloze_invalid': '" .           $lang->getQuizClozeInvalid() . "',
                'quiz_qcm_invalid': '" .             $lang->getQuizQcmInvalid() . "',
                'quiz_truefalse_invalid': '" .       $lang->getQuizTruefalseInvalid() . "',
                'quiz_correct_answer_title': '" .    $lang->getQuizCorrectAnswerTitle() . "',
            }\n";
            
        }


        return $jsMessage;
    }

    /**
     * Fonction qui permet de générer les block pour le scorm et la preview
     *
     * @param Collection|array $blocks Attend sois une collection sois une array
     * @param Collection $languages
     * @param BlockService $blockService
     * @param QuestionService $questionService
     * @return string
     */
    public static function generateBlock($blocks, Collection $languages, BlockService $blockService, QuestionService $questionService) : string
    {
        $html = '';

        foreach($blocks as $block)
        {
            $html .= '
                <!--  Block Id "'. $block->getId() .'" Type " . $block->getType() . " -->
                <div id="block-'. $block->getId() .'" class="cle-block-container"> </div>';
            if (count($languages) > 1)
            {
                $html .= "<script type='text/javascript'>blocks['block-" . $block->getId() . "'] = {";
                foreach($languages as $key => $lang)
                {
                    $html .= $lang->getIsoCode6391() . " : ";
                    if (strpos($block->getType(), "QUIZ") !== false)
                    {
                        if (isset($languages[$key + 1]))
                            $html .= "`". $questionService->generateHtml($block, $lang->getIsoCode6391(), "", "", false, false)['code'] . '<div id="feedback_'. $block->getId() .'"></div></div>`,';
                        else
                            $html .= "`". $questionService->generateHtml($block, $lang->getIsoCode6391(), "", "", false, false)['code'] . '<div id="feedback_'. $block->getId() .'"></div></div>`';
                    }
                    else
                    {
                        
                        if (isset($languages[$key + 1]))
                            $html .= "`". $blockService->generateHtml($block, $lang->getIsoCode6391(), false)['code'] . '`,';
                        else
                            $html .= "`". $blockService->generateHtml($block, $lang->getIsoCode6391(), false)['code'] . '`';
                    }
                }
                
                $html .= "}</script>";
            }
            else
            {
                preg_match('/\w_(.*?)="(.*?)"/', $block->getCode(), $information);

                if (isset($information[1]))
                    $lang = $information[1];
                else
                    $lang = 'fr';
                
                if (strpos($block->getType(), "QUIZ") !== false)
                {
                    $html .= "
                    <script type='text/javascript'>blocks['block-" . $block->getId() . "'] = { '". $lang ."' : `". $questionService->generateHtml($block, $lang, "", "", false)['code'] . '<div id="feedback_'. $block->getId() .'"></div></div>` }</script>
                    ';  
                }
                else
                {
                 
                    $html .= "
                    <script type='text/javascript'>blocks['block-" . $block->getId() . "'] = { '". $lang ."' : `". $blockService->generateHtml($block, $lang)['code'] ."` }</script>
                    ";
                }
            }
        }

        return $html;
    }

    /**
     * Permet de mettre le temps au bon format grâce au second
     *
     * @param integer $seconds
     * @return void
     */
    public static function formatTime(int $seconds)
    {
        $hours = (int)($seconds / 3600);
        $minutes = (int)($seconds / 60 % 60);
        $seconds = (int)($seconds % 60);

        return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    }

    /**
     * Permet de créer le bouton valider dans la bonne langue
     *
     * @param string $previewLanguage
     * @return void
     */
    public static function generateButtonValidate(string $previewLanguage = null)
    {
        $js = "<script>
                $(document).ready(function() {
                    if (typeof JSmessages !== 'undefined'){ ";
                        if ($previewLanguage !== null)
                        {
                            $js .= "document.getElementById('btn_validate').value = JSmessages['$previewLanguage']['validate_button_label']";
                        }
                        else
                        {
                            $js .= "document.getElementById('btn_validate').value = JSmessages['lang']['validate_button_label']";
                        }
                        $js .= "
                    } else {
                        document.getElementById('btn_validate').value = 'Valider';
                    }
                })
            </script>
            <div class=\"cle-quiz-validation-box\" style=\"display: block; text-align: center;\">
                <input type=\"submit\" id=\"btn_validate\" value=\"\" /><br />
                <small id='warning-message' style='display: none;'>
                    Temps obligatoire restant
                    <small class='warning-hours'>00</small>:
                    <small class='warning-minutes'>00</small>:
                    <small class='warning-seconds'>00</small>
                </small>
            </div>
        </form>";

        return $js;
    }

    /**
     * Génére le JS des question 
     *
     * @param Grain $grain
     * @param QuestionService $blockService
     * @param array $languages
     * @return string
     */
    public static function generateAllQuestion(Grain $grain, QuestionService $blockService, array $languages) : string
    {
        $html = "
            quizManager 				= new CLEQuizManager(1,1);
        ";

        foreach ($grain->getBlockGrains() as $block)
        {
            $html .= $blockService->generateJs($block, $languages);
        }

        $html .= '
        $(document).ready(function()
        {
            $("form#QUIZ_'.$grain->getId().'").submit(function()
            {
                if (!quizManager.checkForm()){
                    return false;
                }
                if (confirm(JSmessages[lang]["quiz_confirmation"]))
                {
                    // On desactive les champs et le bouton de validation
                    quizManager.disable(true);

                    // calcul du score, feedback et enregistrement
                    quizManager.checkAnswers(false,0);
                }
                return false;
            });
        });
        ';

        return $html;
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

    /**
     * Reformate correctement les string
     *
     * @param string $subject
     * @param boolean $escape_space si on veux que les espace deviennent des _
     * @param boolean $escape_double_quota si on veux que les " deviennent des '
     * @return string
     */
    public static function satanizeFileName(string $subject, bool $escape_space = true, bool $escape_double_quota = true) : string
    {
        $unwanted_array = array(    'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
                            'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
                            'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
                            'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
                            'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y' );

        if ($escape_space)
        {
            $unwanted_array[' '] = '_';
        }

        if ($escape_double_quota)
        {
            $unwanted_array['"'] = "'";
        }
        $str = strtr( $subject, $unwanted_array );

        return $str;
    }
}