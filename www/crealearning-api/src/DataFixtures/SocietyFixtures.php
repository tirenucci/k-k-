<?php

namespace App\DataFixtures;

use App\Entity\Society;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\Filesystem\Filesystem;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class SocietyFixtures extends Fixture
{
    public const SOCIETY_REFERENCE = '1';

    public function load(ObjectManager $manager)
    {
        $society = new Society();
        $filesystem = new Filesystem();
        $society->setName('Logipro');
        $society->setQuota('-1');
        $society->setDiskSpace('0');
        $society->setOpencrea(false);
        $society->setShareMail('');
        $society->setSkinDefault(1);
        $society->setMonograinScorm(true);
        $society->setAgoraSmart("");
        
        $this->setReference(self::SOCIETY_REFERENCE, $society);

        $manager->persist($society);

        $manager->flush();

        if (!is_dir($_ENV['UPLOAD_PATH'] . '/' . $society->getId()))
        {
            $filesystem->mkdir($_ENV['UPLOAD_PATH'] . '/' . $society->getId(), 0777, true);
        }
        else
        {
            $filesystem->remove($_ENV['UPLOAD_PATH'] . '/' . $society->getId());
            $filesystem->mkdir($_ENV['UPLOAD_PATH'] . '/' . $society->getId(), 0777, true);
        }
    }
    
}