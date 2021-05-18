<?php

namespace App\DataFixtures;

use DateTime;
use App\Entity\Grain;
use App\Entity\Training;
use App\Entity\TrainingAuthor;
use App\DataFixtures\SkinFixtures;
use App\DataFixtures\UserFixtures;
use App\DataFixtures\SocietyFixtures;
use App\DataFixtures\TrainingFixture;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class GrainFixtures extends Fixture  implements DependentFixtureInterface
{
    public const GRAIN_REFERENCE = 'grain';

    public function load(ObjectManager $manager)
    {
        $grain = new Grain();

        $grain->setTraining($this->getReference(TrainingFixture::TRAINING_REFERENCE));
        $grain->setName("<?xml version=\"1.0\" encoding=\"UTF-8\"?>
        <name fr=\"Grain test\"/>
        ");
        $grain->setScoreTotal("100");
        $grain->setCreatedAt(new DateTime());
        $grain->setUpdatedAt(new DateTime());
        $grain->setDuration(0);
        $grain->setPosition(0);
        $grain->setThreshold(0);
        $grain->setContentValidation("_INVALID");
        $grain->setGraphicValidation("_INVALID");
        $grain->setShowCorrectAnswers(true);
        $grain->setMinimumTime(new DateTime("00:00:00"));
        $grain->setMaximumTime(new DateTime("00:00:00"));
        $grain->setActionTimeLimit("no exit,message");


        $manager->persist($grain);
        $manager->flush();
        
        $this->addReference(self::GRAIN_REFERENCE, $grain);
    }

    public function getDependencies()
    {
        return array(
            TrainingFixture::class
        );
    }
}