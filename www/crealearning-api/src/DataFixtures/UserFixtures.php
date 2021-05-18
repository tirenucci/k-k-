<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\DataFixtures\LanguageFixtures;
use App\DataFixtures\SocietyFixtures;
use App\DataFixtures\OfferFixtures;
use App\DataFixtures\AvatarFixtures;
use App\Entity\Type\EnumRoleType;
use App\Repository\SocietyRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture implements DependentFixtureInterface
{
    public const USER_REFERENCE = 'user';

    private $encoder;
    private $societyRepository;

    public function __construct(UserPasswordEncoderInterface $encoder, SocietyRepository $societyRepository)
    {
        $this->encoder = $encoder;
        $this->societyRepository = $societyRepository;
    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $uuid = uuid_create(UUID_TYPE_RANDOM);
        $password = $this->encoder->encodePassword($user, 'admin');

        $user->setEmail('admin@logipro.com');
        $user->setRole(EnumRoleType::ROLE_LOGIPRO);
        $user->setPassword($password);
        $user->setUsername('admin');
        $user->setCivility("M");
        $user->setRegistration(new \DateTime('now'));
        $user->setUuid($uuid);
        $user->setFirstName('Logipro');
        $user->setLastName('Admin');
        $user->setCivility('Monsieur');
        $user->setAvatar(null);
        $user->setConnectionToken(bin2hex(random_bytes(20)));
        $user->setOffer($this->getReference(OfferFixtures::OFFER_REFERENCE));
        $user->setLanguage($this->getReference(LanguageFixtures::LANGUAGE_REFERENCE_FR));
        $user->setSociety($this->societyRepository->findOneBy(['id' => 1]));
        $user->setStatus("_USER_ACTIF");
        $this->setReference(self::USER_REFERENCE, $user);

        $manager->persist($user);

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            SocietyFixtures::class
        );
    }

}
