<?php

namespace App\DataFixtures;

use App\Entity\Skin;
use App\Entity\SkinTheme;
use App\DataFixtures\SkinThemeFixtures;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class SkinFixtures extends Fixture
{

    public const SKIN_REFERENCE = 'skin';

    public function load(ObjectManager $manager)
    {
        $skinThemeName = [
            '3D',
            'Arts graphiques',
            'Bien-être',
            'Marketing',
            'Connaissances',
            'Cuisine',
            'Entreprise',
            'Finances',
            'Informatique',
            'Internet',
            'Langues',
            'Management RH',
            'Médias',
            'Moderne',
            'Musique',
            'Neutre',
            'Oblique',
            'Santé',
            'Sciences',
            'Sécurité',
            'Sport',
            'Transports',
            'Village',
            'Voyage nature',
            'Aide à domicile'
        ];

        $skinThemeFolder = [
            '3d',
            'graphic_arts',
            'well_being',
            'marketing',
            'knowledge',
            'cooked',
            'enterprise',
            'finances',
            'informatique',
            'internet',
            'languages',
            'management',
            'media',
            'modern',
            'music',
            'neutral',
            'oblique',
            'health',
            'sciences',
            'security',
            'sport',
            'transport',
            'village',
            'nature_travel',
            'home_help'
        ];
        
        $name = [
            '3D (bleu)','3D (gris)','3D (rouge)','3D (vert)','3D (violet)',
            'Arts graphiques (bleu)','Arts graphiques (orange)','Arts graphiques (rouge)','Arts graphiques (vert)','Arts graphiques (violet)',
            'Bien-être (bleu)','Bien-être (orange)','Bien-être (rouge)','Bien-être (vert)','Bien-être (violet)',
            'Marketing (bleu)','Marketing (orange)','Marketing (rose)','Marketing (vert)','Marketing (violet)',
            'Connaissances (bleu)','Connaissances (marron)','Connaissances (orange)','Connaissances (rose)','Connaissances (vert)',
            'Cuisine (bleu)','Cuisine (jaune)','Cuisine (orange)','Cuisine (rouge)','Cuisine (vert)',
            'Entreprise (bleu)','Entreprise (rose)',
            'Finances (orange)','Finances (rouge)','Finances (turquoise)','Finances (vert)','Finances (violet)',
            'Informatique (noir)','Informatique (orange)',
            'Internet',
            'Langues (orange)','Langues (vert)',
            'Management RH (bleu)','Management RH (orange)','Management RH (rouge)','Management RH (vert)','Management RH (violet)',
            'Médias (bleu)','Médias (orange)','Médias (rouge)','Médias (vert)','Médias (violet)',
            'Moderne (bleu)','Moderne (bordeaux)','Moderne (orange)','Moderne (vert)','Moderne (violet)',
            'Musique (bleu)','Musique (orange)','Musique (vert)','Musique (violet)',
            'Neutre',
            'Oblique',
            'Santé (bleu)','Santé (orange)','Santé (rouge)','Santé (vert)','Santé (violet)',
            'Sciences',
            'Sécurité (bleu)','Sécurité (jaune)','Sécurité (orange)','Sécurité (rouge)','Sécurité (vert)',
            'Sport (bleu)','Sport (orange)','Sport (rose)','Sport (vert)','Sport (violet)',
            'Transports (bleu)','Transports (orange)','Transports (rose)','Transports (rouge)','Transports (vert)',
            'Village',
            'Voyage nature (neige)','Voyage nature (pique-nique)','Voyage nature (montagne)','Voyage nature (plage)','Voyage nature (voyage)',
            'Aide à domicile (enfant)','Aide à domicile (ménage)','Aide à domicile (travaux)','Aide à domicile (repas)','Aide à domicile (personne agée)'
        ];
        $description = [
            'Template 3D (bleu)','Template 3D (gris)','Template 3D (rouge)','Template 3D (vert)','Template 3D (violet)',
            'Template Arts graphiques (bleu)','Template Arts graphiques (orange)','Template Arts graphiques (rouge)','Template Arts graphiques (vert)','Template Arts graphiques (violet)',
            'Template Bien-être (bleu)','Template Bien-être (orange)','Template Bien-être (rouge)','Template Bien-être (vert)','Template Bien-être (violet)',
            'Template Marketing (bleu)','Template Marketing (orange)','Template Marketing (rose)','Template Marketing (vert)','Template Marketing (violet)',
            'Template Connaissances (bleu)','Template Connaissances (marron)','Template Connaissances (orange)','Template Connaissances (rose)','Template Connaissances (vert)',
            'Template Cuisine (bleu)','Template Cuisine (jaune)','Template Cuisine (orange)','Template Cuisine (rouge)','Template Cuisine (vert)',
            'Template entreprise (bleu)','Template entreprise (rose)',
            'Template Finances (orange)','Template Finances (rouge)','Template Finances (turquoise)','Template Finances (vert)','Template Finances (violet)',
            'Template informatique (noir)','Template informatique (orange)',
            'Template Internet',
            'Template Langues (orange)','Template Langues (vert)',
            'Template Management RH (bleu)','Template Management RH (orange)','Template Management RH (rouge)','Template Management RH (vert)','Template Management RH (violet)',
            'Template Médias (bleu)','Template Médias (orange)','Template Médias (rouge)','Template Médias (vert)','Template Médias (violet)',
            'Template Moderne (bleu)','Template Moderne (bordeaux)','Template Moderne (orange)','Template Moderne (vert)','Template Moderne (violet)',
            'Template Musique (bleu)','Template Musique (orange)','Template Musique (vert)','Template Musique (violet)',
            'Template Neutre',
            'Template Oblique',
            'Template Santé (bleu)','Template Santé (orange)','Template Santé (rouge)','Template Santé (vert)','Template Santé (violet)',
            'Template Sciences',
            'Template Sécurité (bleu)','Template Sécurité (jaune)','Template Sécurité (orange)','Template Sécurité (rouge)','Template Sécurité (vert)',
            'Template Sport (bleu)','Template Sport (orange)','Template Sport (rose)','Template Sport (vert)','Template Sport (violet)',
            'Template Transports (bleu)','Template Transports (orange)','Template Transports (rose)','Template Transports (rouge)','Template Transports (vert)',
            'Template Village',
            'Template Voyage nature (neige)','Template Voyage nature (pique-nique)','Template Voyage nature (montagne)','Template Voyage nature (plage)','Template Voyage nature (voyage)',
            'Template Aide à domicile (enfant)','Template Aide à domicile (ménage)','Template Aide à domicile (travaux)','Template Aide à domicile (repas)','Template Aide à domicile (personne agée)'
        ];
        $colorName = [
            'Bleu','Gris','Rouge','Vert','Violet',
            'Bleu','Orange','Rouge','Vert','Violet',
            'Bleu','Orange','Rouge','Vert','Violet',
            'Bleu','Orange','Rose','Vert','Violet',
            'Bleu','Marron','Orange','Rose','Vert',
            'Bleu','Jaune','Orange','Rouge','Vert',
            'Bleu','Rose',
            'Orange','Rouge','Turquoise','Vert','Violet',
            'Noir','Orange',
            'Rose',
            'Orange','Vert',
            'Bleu','Orange','Rouge','Vert','Violet',
            'Bleu','Orange','Rouge','Vert','Violet',
            'Bleu','Bordeaux','Orange','Vert','Violet',
            'Bleu','Orange','Vert','Violet',
            'Noir',
            'Fuchsia',
            'Bleu','Orange','Rouge','Vert','Violet',
            'Violet',
            'Bleu','Jaune','Orange','Rouge','Vert',
            'Bleu','Orange','Rose','Vert','Violet',
            'Bleu','Orange','Rose','Rouge','Vert',
            'Orange',
            'Persan','Rouge','Gris','Bleu','Marron',
            'Rouge','Rose','Marron','Gris','Bleu',
        ];
        $colorCode = [
            '#275bc0','#b7b7b7','#c44445','#41bb42','#8846de',
            '#73b7f7','#f08213','#e61c48','#67b346','#960594',
            '#1c35f0','#ff7200','#f23737','#04ae20','#ca00cc',
            '#73b7f7','#f08213','#e8568e','#67b346','#960594',
            '#05abc0','#734b27','#f05b01','#e90096','#009600',
            '#30b2f5','#f6d209','#fe7506','#e90c1c','#099f30',
            '#699a9a','#ff208c',
            '#f67309','#e61c48','#2cebc5','#27ae60','#ce07f9',
            '#37251b','#ffaf00',
            '#f72198',
            '#ff6f07','#9ec028',
            '#30b2f5','#f08213','#fd4848','#19b509','#b50966',
            '#1bccca','#ff8502','#e82a2c','#47d239','#cc02ff',
            '#5973a9','#4d202c','#ce6d13','#7b9c8c','#a22be0',
            '#1f2fc5','#ff7200','#12a300','#d30497',
            '#000',
            '#cd2e59',
            '#00b4ec','#fc8f07','#d81c1c','#16d576','#ae42c4',
            '#d496e3',
            '#2956e9','#ebd01d','#f99513','#c00d2a','#55b11d',
            '#61d5ee','#f1872e','#e66198','#4bad6a','#774495',
            '#2c87bc','#f98911','#e721f3','#f33021','#30bc2c',
            '#ce6d13',
            '#649BA9','#BA2222','#808186','#02B6F9','#8E7455',
            '#E74232','#D64564','#9F623B','#756F6F','#00A5B8'
        ];
        $folderName = [
            'blue','gray','red','green','purple',
            'blue','orange','red','green','purple',
            'blue','orange','red','green','purple',
            'blue','orange','pink','green','purple',
            'blue','brown','orange','pink','green',
            'blue','yellow','orange','red','green',
            'blue','pink',
            'orange','red','turquoise','green','purple',
            'black','orange',
            'pink',
            'orange','green',
            'blue','orange','red','green','purple',
            'blue','orange','red','green','purple',
            'blue','bordeaux','orange','green','purple',
            'blue','orange','green','purple',
            'black',
            'fuchsia',
            'blue','orange','red','green','purple',
            'purple',
            'blue','yellow','orange','red','green',
            'blue','orange','pink','green','purple',
            'blue','orange','pink','red','green',
            'orange',
            'persan','red','gray','blue','brown',
            'red','pink','brown','gray','blue'
        ];
        $uuid = [
            'a0f84240-a1c6-47f8-baff-5f47a3279870','c192ddb2-f50a-4a89-872b-43c9f27e5584','2500a4c4-0356-4c4c-ad81-ebe1df90e9a2','bd31182b-8259-44ac-8a40-9b2b2d061e6c','99d9ca66-2b51-4384-a493-38282b1ddbe1',
            '862eee37-a79f-4a6c-b7cd-313f9f919005','5efa2502-4f55-4249-8b2c-dfdf176dc940','71f665ba-8d66-4f66-8801-c36597903c84','3c0c12b2-2bcb-4cb5-9493-c54e624fc949','2c346fc2-2129-4207-9369-e024490c8db8',
            '37de7151-b52d-4756-bc90-168af3117d3s','33f701af-ccd5-41ff-a5a2-5ec74b0abc54','be392cd2-7063-4bbe-aa33-791e6253e003','f5910579-0803-47f8-b447-bde545fbd5e0','5c9cfdb0-ac75-4f20-8f08-64dabdb9fb30',
            'e19a319b-fe17-4b12-8cd9-97a2e14ba17f','8c13a5d6-7196-433d-8f17-9b75991ab37d','3b90e81b-68fc-4288-8a3a-6f1c1c585559','49447cea-c541-4d47-accd-b37481de7cbc','160f1b83-6b17-4171-bfb7-0a13e15619fe',
            '6fab23fe-ac2f-4061-910f-3cd2cf05ec1b','5fbb23fe-ac2f-4061-910f-3cd2cf05ec1c','4obb23fe-ac2f-4061-910f-3cd2cf05ec1c','a7a9be66-fc32-43e6-84d3-406a2bf1ceea','v7a9be66-fc32-43e6-84d3-406a2bf1c62a',
            '7f0c2c89-b09b-42d5-8ea0-1f020d2420b6','c1f1d195-cd1d-4594-aec8-22ba3f66a337','58b0b8b7-24cc-4d0b-9667-733611753cb3','fcafe994-c199-4c42-85a4-b220a5d6bda0','08b40608-ba50-4528-858c-a443158e7d5d',
            '1b85baa4-76d4-408c-b8cb-c4e71c7e5fd0','2b85bwa4-76d4-408c-b8cb-c4e71c7e5f30',
            '963a23a-6113-4d27-a464-13471efe4ecd','6f2def2e-5fa4-4e11-ab01-4ac4504bad69','17b7cd77-077d-4840-b6b7-c98a48ea249b','cf592674-e2fd-4db5-b0ac-0f5dd53a4495','e33c93d4-5cd8-4701-b253-17c57def15b8',
            'db7d4884-2727-4a7c-bfaf-79cd69e1d105','f133434a-bf76-4ecc-954b-3b9056d7d397',
            '8c5a922f-5610-48e2-9728-5bdf925bb4e1',
            'd0c667da-3e94-4391-b1bb-9048c06276d2','0c737fa8-73b5-4aad-b6f6-fda29e4d3837',
            '5833bf08-dbe6-464c-8ef8-15797e13d61c','fd136c8b-e408-4ec2-98c3-8f3ff85a0298','09724bb1-64ac-47e0-89ed-536756d209b5','faf7354f-e9f3-419b-9536-4d57dfb383c1','aab0bcd5-3d54-4638-b299-bd49c0306bde',
            '19275c87-a52b-4bda-9b7f-a60f83f79650','0ec0ff63-7ad8-4d98-8b17-470bd4640e75','5bbdcaf8-10a1-445d-be83-02074169d42c','7a0f6407-618e-43a1-ba9c-24f537fa7a8e','af0ed54c-09cc-4ee0-8408-d13ef00f12f1',
            '2016509a-1323-41d5-bc36-ea73d0f13771','6c766042-ca50-44ab-929c-299dfae0e10e','607b0252-5898-447d-b5cf-c03f8067bdc4','30b82446-5ab5-4cd0-aef2-78d7f9500e04','176d3ebc-e721-419e-909e-5f40d315c61c',
            'b53350c8-7ad1-4077-a49b-d42f1af9a6fc','853350c8-7ad1-4077-a49b-d42f1af9a6fc','9197b608-e708-4e34-82f0-4b8d8126a3b5','850831ed-0864-4f96-bf81-0bdf14b96fa8',
            '7d0bbe45-dff1-48ad-9d1f-8bb6186dd743',
            'fcs66042-ca50-44ab-929c-299dfae0e1so',
            'b3c09dc9-0907-495a-8b1b-cc2a6c738718','fa5f85cc-95c2-4e12-803c-eea514d6f6a3','16368bb2-ef3f-4856-86e5-e5241b1624ea','5a60142f-5527-440b-b62d-9d8bc9564ecf','7fbf17cb-32e1-4aec-95ec-a93bb2a7c16f',
            '3s582446-5ab5-4so0-aef2-78d7f9500e04',
            '7c316fff-eb6f-4647-aeb9-f6392b53a421','f720f81a-f34d-474d-a77d-3f4843297850','7b90b3ae-44e7-4c44-b0ca-a96be1b3443a','075e5dfb-1df8-4876-8c9e-fa283025ed4d','d1c60cca-5e60-49a2-b33d-8518256f7169',
            '0d9f2913-383e-4edc-99ea-b518d42671ee','fb444bea-ee50-4dd7-b886-5a8b95e17d93','389760dd-80d9-46aa-bc0d-863911ffad7d','e3f39393-4985-4a55-a397-1f679dcf1e80','1b4b9791-1add-4656-be02-f76069f1b4c8',
            '8abe3265-f338-4b11-99dd-7562bad99297','91781852-5f40-4174-96c3-f4f650d8249a','82ebcd3c-8c80-4eee-8237-fdbdca52b8f6','a839aa70-2b58-4b2d-8a68-ceda99149029','b22b4128-c945-4597-b737-af39efa5a6c7',
            'a01300af-214e-461a-b4ef-b78d5dd8ebac',
            'f5d93f5c-d868-45f0-b409-b84e09da4bd4','308a4c65-e911-4cc9-bd91-301f61652023','11cf9c88-79c3-4c12-9058-ccd8ff4d39fd','3b0a4536-25d2-474a-bd18-2d313ca05b42','74af044b-f93c-4e55-aa52-7d3f385038fc',
            'bbaeb2cc-c51a-4426-89d9-ace8d6535af8','daa5ff4c-06bb-4fdb-b9de-f4549401b9e4','5384e913-d861-4ccc-a9e4-e3d5525201f5','5384e913-d861-4ccc-a9e4-e3d5525201f5','5c909a21-d6c9-4b1b-8dfe-841ab6d1bfef'
        ];
        
        for ($i = 0; $i < count($skinThemeName); $i++)
        {

            $skinTheme = new SkinTheme();
            $skinTheme->setTitle($skinThemeName[$i]);
            $skinTheme->setPosition($i);
            $skinTheme->setStatus('_ACTIVE');
            $skinTheme->setFolderName($skinThemeFolder[$i]);
            $color = preg_grep('~' . $skinThemeName[$i] . '~', $name);

            $key = 1;
            foreach($color as $c)
            {
                $index = array_keys($name, $c);

                $skin = new Skin();
                $skin->setSkinTheme($skinTheme);
                $skin->setName($c);
                $skin->setAuthor('Logipro');
                $skin->setDescription($description[$index[0]]);
                $skin->setUuid($uuid[$index[0]]);
                $skin->setVersion('1.0');
                $skin->setColorName($colorName[$index[0]]);
                $skin->setColorCode($colorCode[$index[0]]);
                $skin->setStatus('_ACTIVE');
                $skin->setPosition($key);
                $skin->setFolderName($folderName[$index[0]]);
                $manager->persist($skin);
                $this->setReference(self::SKIN_REFERENCE, $skin);
                $key++;
            }
            $manager->persist($skinTheme);
        }

        $manager->flush();
    }
}