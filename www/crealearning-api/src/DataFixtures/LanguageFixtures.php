<?php

namespace App\DataFixtures;

use App\Entity\Language;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class LanguageFixtures extends Fixture
{
    public const LANGUAGE_REFERENCE_FR = 'FR';
    public const LANGUAGE_REFERENCE_EN = 'EN';


    public function load(ObjectManager $manager)
    {
        $fr = new Language();
        $fr->setLanguageCode('fr');
        $fr->setLanguage('Français');
        $fr->setActive('1');
        $fr->setPosition('1');
        $manager->persist($fr);

        $manager->flush();

        $en = new Language();
        $en->setLanguageCode('en');
        $en->setLanguage('Anglais');
        $en->setActive('0');
        $en->setPosition('2');
        $manager->persist($en);

        $manager->flush();
        $this->addReference(self::LANGUAGE_REFERENCE_EN, $en);
        $this->addReference(self::LANGUAGE_REFERENCE_FR, $fr);
    }
}