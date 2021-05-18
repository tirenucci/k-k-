<?php

namespace App\DataFixtures;

use App\Entity\IntegratedObject;
use App\Entity\IntegratedObjectTheme;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class EOFixtures extends Fixture 
{

    public function load(ObjectManager $manager)
    {
        $eoThemeName = [
            '_THEME_PRESENTATIONS',
            '_THEME_QCM',
            '_THEME_MAP',
            '_THEME_STREAMING',
            '_THEME_VIDEO',
            '_THEME_IMAGES'
        ];

        $eoTitle = [
            '(_THEME_PRESENTATIONS)Google Slide', '(_THEME_PRESENTATIONS)Slideshare', '(_THEME_PRESENTATIONS)Prezi', '(_THEME_PRESENTATIONS)Padlet', '(_THEME_PRESENTATIONS)InkleWriter', '(_THEME_PRESENTATIONS)Madmagz',
            '(_THEME_QCM)Google Form','(_THEME_QCM)Learning Apps','(_THEME_QCM)EdPuzzle','(_THEME_QCM)AnswerGarden',
            '(_THEME_MAP)MapChart','(_THEME_MAP)MindMup','(_THEME_MAP)Popplet',
            '(_THEME_STREAMING)Soundcloud','(_THEME_STREAMING)Vizia',
            '(_THEME_VIDEO)DailyMotion','(_THEME_VIDEO)Youtube','(_THEME_VIDEO)Viméo',
            '(_THEME_IMAGES)ThingLink','(_THEME_IMAGES)Flickr','(_THEME_IMAGES)Powtoon','(_THEME_IMAGES)Easel','(_THEME_IMAGES)Cacoo','(_THEME_IMAGES)Genially'
        ];

        $eoDescription = [
            '(_THEME_PRESENTATIONS)_EO_GOOGLE_SLIDE_DESC','(_THEME_PRESENTATIONS)_EO_SLIDE_DESC', '(_THEME_PRESENTATIONS)_EO_PREZI_DESC', '(_THEME_PRESENTATIONS)_EO_PADLET_DESC', '(_THEME_PRESENTATIONS)_EO_INKLE_DESC', '(_THEME_PRESENTATIONS)_EO_MAD_DESC',
            '(_THEME_QCM)_EO_GOOGLE_FORM_DESC','(_THEME_QCM)_EO_LEARNING_APPS_DESC','(_THEME_QCM)_EO_EDPUZZLE_DESC','(_THEME_QCM)_EO_ANSWER_GARDEN_DESC',
            '(_THEME_MAP)_EO_MAPCHART_DESC','(_THEME_MAP)_EO_MIND_DESC','(_THEME_MAP)_EO_POPPLET_DESC',
            '(_THEME_STREAMING)_EO_SOUNDCLOUD_DESC','(_THEME_STREAMING)_EO_VIZIA_DESC',
            '(_THEME_VIDEO)_EO_DAILYMOTION_DESC','(_THEME_VIDEO)_EO_YOUTUBE_DESC','(_THEME_VIDEO)_EO_VIMEO_DESC',
            '(_THEME_IMAGES)_EO_THINGLINK_DESC','(_THEME_IMAGES)_EO_FLICKR_DESC','(_THEME_IMAGES)_EO_POWTOON_DESC','(_THEME_IMAGES)_EO_EASEL_DESC','(_THEME_IMAGES)_EO_CACOO_DESC','(_THEME_IMAGES)_EO_GENIALLY_DESC'
        ];

        $eoUrl = [
            '(_THEME_PRESENTATIONS)https://www.google.fr/intl/fr/slides/about/', '(_THEME_PRESENTATIONS)http://fr.slideshare.net/', '(_THEME_PRESENTATIONS)http://www.prezi.com/fr/', '(_THEME_PRESENTATIONS)http://padlet.com', '(_THEME_PRESENTATIONS)http://www.inklestudios.com/inklewriter', '(_THEME_PRESENTATIONS) https://madmagz.com/fr',
            '(_THEME_QCM)https://www.google.com/intl/fr_fr/forms/about/','(_THEME_QCM)https://learningapps.org/','(_THEME_QCM)https://edpuzzle.com/','(_THEME_QCM)https://answergarden.ch/',
            '(_THEME_MAP)https://mapchart.net/','(_THEME_MAP)https://www.mindmup.com/','(_THEME_MAP)http://popplet.com/',
            '(_THEME_STREAMING)https://soundcloud.com/','(_THEME_STREAMING)https://vizia.co/',
            '(_THEME_VIDEO)https://www.dailymotion.com/fr','(_THEME_VIDEO)https://www.youtube.com/','(_THEME_VIDEO)https://vimeo.com/',
            '(_THEME_IMAGES)https://www.thinglink.com/','(_THEME_IMAGES)https://www.flickr.com/','(_THEME_IMAGES)https://www.powtoon.com/','(_THEME_IMAGES)https://www.easel.ly/','(_THEME_IMAGES)https://cacoo.com/','(_THEME_IMAGES)https://www.genial.ly/'
        ];

        $eoLogo = [
            '(_THEME_PRESENTATIONS)googleSlide-logo.png', '(_THEME_PRESENTATIONS)slideShare-logo.png', '(_THEME_PRESENTATIONS)prezi-logo.png', '(_THEME_PRESENTATIONS)padlet-logo.png', '(_THEME_PRESENTATIONS)inklewriter-logo.png', '(_THEME_PRESENTATIONS)madmagz-logo.png',
            '(_THEME_QCM)googleForm-logo.png','(_THEME_QCM)learningapps-logo.png','(_THEME_QCM)edpuzzle-logo.png','(_THEME_QCM)answergarden-logo.png',
            '(_THEME_MAP)mapchart-logo.png','(_THEME_MAP)mindmup-logo.png','(_THEME_MAP)popplet-logo.png',
            '(_THEME_STREAMING)soundcloud-logo.png','(_THEME_STREAMING)vizia-logo.png',
            '(_THEME_VIDEO)dailymotion-logo.png','(_THEME_VIDEO)youtube-logo.png','(_THEME_VIDEO)vimeo-logo.png',
            '(_THEME_IMAGES)thinglink-logo.png','(_THEME_IMAGES)flickr-logo.png','(_THEME_IMAGES)powtoon-logo.png','(_THEME_IMAGES)easel-logo.png','(_THEME_IMAGES)cacoo-logo.png','(_THEME_IMAGES)genially-logo.png/'
        ];


        $position = 0;
        for($i = 0; $i < count($eoThemeName); $i++)
        {
            $eoTheme = new IntegratedObjectTheme();
            $eoTheme->setTitle($eoThemeName[$i]);
            $eoTheme->setPosition(++$position);
            $eo = preg_grep('~' . $eoThemeName[$i] . '~', $eoTitle);

            $key = 1;

            foreach($eo as $e)
            {
                $index = array_keys($eoTitle, $e);

                $eoObject = new IntegratedObject();
                $eoObject->setIntegratedObjectTheme($eoTheme);
                $e = preg_replace("/\([^)]+\)/","",$e);
                $eoObject->setTitle($e);
                $eoDescription = preg_replace("/\([^)]+\)/","",$eoDescription);
                $eoObject->setDescription($eoDescription[$index[0]]);
                $eoUrl = preg_replace("/\([^)]+\)/","",$eoUrl);
                $eoObject->setUrl($eoUrl[$index[0]]);
                $eoObject->setPosition($key);
                $eoLogo = preg_replace("/\([^)]+\)/","",$eoLogo);
                $eoObject->setLogo($eoLogo[$index[0]]);
                $manager->persist($eoObject);
                ++$key;
            }

            $manager->persist($eoTheme);
        }

        $manager->flush();
    }
}