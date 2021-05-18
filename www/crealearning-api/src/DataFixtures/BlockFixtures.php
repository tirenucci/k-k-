<?php

namespace App\DataFixtures;

use DateTime;
use App\Entity\Grain;
use App\Entity\Training;
use App\Entity\BlockGrain;
use App\Entity\TrainingAuthor;
use App\DataFixtures\SkinFixtures;
use App\DataFixtures\UserFixtures;
use App\DataFixtures\GrainFixtures;
use App\DataFixtures\SocietyFixtures;
use App\DataFixtures\TrainingFixture;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class BlockFixtures extends Fixture  implements DependentFixtureInterface
{

    public function load(ObjectManager $manager)
    {
        $title = new BlockGrain();
        $paragraphe = new BlockGrain();
        $image = new BlockGrain();
        $hr = new BlockGrain();

        $title->setGrain($this->getReference(GrainFixtures::GRAIN_REFERENCE));
        $paragraphe->setGrain($this->getReference(GrainFixtures::GRAIN_REFERENCE));
        $image->setGrain($this->getReference(GrainFixtures::GRAIN_REFERENCE));
        $hr->setGrain($this->getReference(GrainFixtures::GRAIN_REFERENCE));

        $title->setPosition(0);
        $paragraphe->setPosition(1);
        $hr->setPosition(2);
        $image->setPosition(3);

        $title->setType("_TITLE");
        $paragraphe->setType("_TEXT");
        $image->setType("_IMG");
        $hr->setType("_HR");

        $title->setCoef("0");
        $paragraphe->setCoef("0");
        $image->setCoef("0");
        $hr->setCoef("0");

        $title->setQuestionScore("0");
        $paragraphe->setQuestionScore("0");
        $image->setQuestionScore("0");
        $hr->setQuestionScore("0");

        $title->setCode("<?xml version=\"1.0\"?>\n<options level_fr=\"h1\" text_fr=\"C'est un grain pour les tests\" neutral=\"\" neutralImage=\"\" />");
        $paragraphe->setCode("<?xml version=\"1.0\"?>\n<options <options text_fr=\"&lt;p&gt;R&#xE9;pondre aux questions suivantes. Cliquer sur &quot;Valider&quot; une fois termin&#xE9;.&#xA0;&lt;/p&gt;\" neutral=\"\" neutralImage=\"\"/>
        />");
        $image->setCode("<?xml version=\"1.0\"?>\n<options url_fr=\"https://i.kym-cdn.com/entries/icons/facebook/000/014/792/unknown.jpg\" alt_fr=\"\" scale_fr=\"100\" neutral=\"\" neutralImage=\"\"");
        $hr->setCode("<?xml version=\"1.0\"?>\n<options neutral=\"\"/>");

        $manager->persist($title);
        $manager->persist($paragraphe);
        $manager->persist($image);
        $manager->persist($hr);
        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            GrainFixtures::class
        );
    }
}