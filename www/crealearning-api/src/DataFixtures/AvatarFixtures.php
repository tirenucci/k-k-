<?php

namespace App\DataFixtures;

use App\Entity\Avatar;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AvatarFixtures extends Fixture 
{
    public function load(ObjectManager $manager)
    {

        $path = [
            '/assets/img/avatar/default.svg',
            '/assets/img/avatar/local.svg',
            '/assets/img/avatar/femme1.svg',
            '/assets/img/avatar/homme1.svg',
            '/assets/img/avatar/femme2.svg',
            '/assets/img/avatar/homme2.svg',
            '/assets/img/avatar/femme3.svg',
            '/assets/img/avatar/homme3.svg',
            '/assets/img/avatar/chapeaufemme.svg',
            '/assets/img/avatar/chapeauhomme.svg',
            '/assets/img/avatar/chat.svg',
            '/assets/img/avatar/chien.svg',
            '/assets/img/avatar/geometrie1.svg',
            '/assets/img/avatar/geometrie2.svg',
            '/assets/img/avatar/geometrie3.svg',
            '/assets/img/avatar/geometrie4.svg',
            '/assets/img/avatar/geometrie5.svg',
            '/assets/img/avatar/geometrie6.svg',
            '/assets/img/avatar/geometrie7.svg',
            '/assets/img/avatar/geometrie8.svg',
            '/assets/img/avatar/geometrie9.svg',
            '/assets/img/avatar/geometrie10.svg',
            '/assets/img/avatar/licorne.svg',
            '/assets/img/avatar/panda.svg',
            '/assets/img/avatar/phoenix.svg',
            '/assets/img/avatar/renard.svg',
            '/assets/img/avatar/sirene.svg'
        ];

        $name = [
            '_DEFAULT',
            '_LOCAL',
            '_W_1',
            '_M_1',
            '_W_2',
            '_M_2',
            '_W_3',
            '_M_3',
            '_HAT_W',
            '_HAT_M',
            '_CAT_PAWS',
            '_DOG_PAWS',
            '_GEOMETRY_1',
            '_GEOMETRY_2',
            '_GEOMETRY_3',
            '_GEOMETRY_4',
            '_GEOMETRY_5',
            '_GEOMETRY_6',
            '_GEOMETRY_7',
            '_GEOMETRY_8',
            '_GEOMETRY_9',
            '_GEOMETRY_10',
            '_UNICORN',
            '_PANDA',
            '_PHOENIX',
            '_FOX',
            '_MERMAID'
        ];
        
        for ($i = 0; $i < count($name); $i++){
            $avatar = new Avatar();
            $avatar->setImagePath($path[$i]);
            $avatar->setPosition($i);
            $avatar->setName($name[$i]);
            $avatar->setUser(null);
            $manager->persist($avatar);
        }

        $manager->flush();
    }
}