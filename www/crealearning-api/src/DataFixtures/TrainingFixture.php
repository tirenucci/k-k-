<?php

namespace App\DataFixtures;

use DateTime;
use App\Entity\Training;
use App\Entity\TrainingAuthor;
use App\DataFixtures\SkinFixtures;
use App\DataFixtures\UserFixtures;
use App\DataFixtures\SocietyFixtures;
use App\Entity\Society;
use App\Repository\TrainingLanguageRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Symfony\Component\Filesystem\Filesystem;

class TrainingFixture extends Fixture  implements DependentFixtureInterface
{
    public const TRAINING_REFERENCE = '1';


    private $trainingLanguagerRepository;

    public function __construct(TrainingLanguageRepository $trainingLanguageRepository)
    {
        $this->trainingLanguagerRepository = $trainingLanguageRepository;
    }

    public function load(ObjectManager $manager)
    {
        $training = new Training();
        $author = new TrainingAuthor();
        $training->setName("Bien débuter");
        $training->setSkin($this->getReference(SkinFixtures::SKIN_REFERENCE));
        $training->setSociety($this->getReference(UserFixtures::USER_REFERENCE)->getSociety());
        $training->setCreatedAt(new DateTime());
        $training->setUpdatedAt(new DateTime());
        $training->setLanguageCode("fr");
        $training->setVersion("1.0");
        $training->setUuid(uuid_create(UUID_TYPE_RANDOM));
        $training->setLicense("_CC");
        $training->setDescription("Ceci est un module générer pour faire des tests il n'a donc aucun sens");
        $training->setStatus("_UNDERCONSTRUCTION");
        $training->setDuration("0");
        $training->setContentValidation("INVALID");
        $training->setDiskSpace("0");
        $training->setShowPonderation("1");
        $training->setLogo("0");
        $training->setLogoPosition("left");
        $training->setTag("GitGud, Tag");
        $training->setEvalMethod("");
        $training->addLanguage($this->trainingLanguagerRepository->findOneBy(['id' => 2]));
        $manager->persist($training);
        $this->setReference(self::TRAINING_REFERENCE, $training);

        $author->setTraining($training);
        $author->setAuthor($this->getReference(UserFixtures::USER_REFERENCE));
        $author->setIsOwner(true);
        $author->setIsEditor(true);

        $fs = new Filesystem();
        $fs->mkdir($_ENV['ASSETS_PATH'] . 'trainings/1' . '/' . $training->getUuid(), 0774, true);

        $manager->persist($author);
        
        

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            TrainingLanguageFixture::class,
            SkinFixtures::class,
            UserFixtures::class,
        );
    }
}