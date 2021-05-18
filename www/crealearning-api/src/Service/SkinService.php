<?php

namespace App\Service;

//utlisation de l'entity Skin
use App\Entity\Skin;

use App\Service\LibService;
use Doctrine\ORM\EntityManager;
use App\Service\SkinThemeService;
use App\Repository\SkinRepository;
use App\Repository\SocietyRepository;
use App\Repository\SkinThemeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;


class SkinService 
{

    private $skinRepository;
    private $skinThemeRepository;
    private $skinThemeService;
    private $societyRepository;
    private $entityManagerInterface;
    private $security;


    public function __construct (   SkinRepository $skinRepository,
                                    SkinThemeService $skinThemeService,
                                    SkinThemeRepository $skinThemeRepository,
                                    SocietyRepository $societyRepository,
                                    EntityManagerInterface $entityManagerInterface,
                                    Security $security
                                    )
    {
        $this->skinRepository = $skinRepository;
        $this->skinThemeService = $skinThemeService;
        $this->skinThemeRepository = $skinThemeRepository;
        $this->societyRepository = $societyRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->security = $security;
    }


    /**
     * Méthode qui renvoie tous les skins correspondants à une société   PEUT ETRE USELESS JE TROUVE PAS L'UTILITÉ
     *
     * @param integer $society_id l'id de la sociète
     * @return array Renvois tous les habillages
     */
    public function takeAllSkins (int $society_id) : array
    {
        dd($_ENV['ASSETS_PATH']);
        $skins = $this->skinRepository->findBy(
            ['society' => $society_id], //critère : la société
            ['position' => 'ASC']   //Tri sur l'ordre
        );

        $themes = $this->skinThemeRepository->findAll();

        $dataSkin = []; //Tableau contenant les skins
        $dataTheme = []; //Tableau contenant la liste des thèmes
        $data = [];//Tableau final à retourner

        //On récupère les thèmes pour alimenter la liste déroulante Theme
        foreach ($themes as $theme)
        {
            $dataTheme[] = $this->skinThemeService->themeToArray($theme,null);
        }

        //Tableau des habillages
        foreach ($skins as $skin)
        {
            $dataSkin[] = [
                'id' => $skin->getId(),
                'name' => $skin->getName(),
                'color_name' => $skin->getColorName(),
                'color_code' => $skin->getColorCode(),
                'position' => $skin->getPosition()
            ];
        }

        //La liste des thèmes se trouve en fin de tableau
        $data = [$dataSkin, $dataTheme];

        return $data;
    }

    /**
     * Méthode qui renvoie la liste des thèmes et le nombre de couleurs pour le thème sélectionné
     *
     * @return array les habillages du thème et le total d'habillage dans le thème
     */
    public function takeTotalSkinByTheme(array $data) : array
    {
        $society = $this->societyRepository->findOneBy(['id' => $this->security->getUser()->getSociety()->getId()]);
        $themes = $this->skinThemeRepository->findBy(['society' => $society, 'society' => null]);
 
        $dataTheme = []; //Tableau contenant la liste des thèmes

        foreach ($themes as $theme)
        {
            $skins = $this->skinRepository->findBy(['skin_theme' => $theme->getId()]);
            $dataTheme[] = $this->skinThemeService->themeToArray($theme,$skins);
        }

        $totalColorOfTheme = count($this->skinRepository->findTotalSkinByTheme($this->security->getUser()->getSociety()->getId(), $data['theme'])) + 1;//On ajoute un pour la création de la nouvelle couleur

        return [ $dataTheme, $totalColorOfTheme ];
    }

    /**
     * Méthode qui insère un skin en Base de donnée
     *
     * @param array $data les information envoyer par React
     * @return array renvois le dossier du theme et du skin
     */
    public function insertSkin(array $data) : array
    {
        $filesystem = new Filesystem();
        

        $society = $this->societyRepository->findOneBy(['id' => $this->security->getUser()->getSociety()->getId()]);

        $theme = $this->skinThemeRepository->findOneBy(['id' => $data['theme_id']]);
        
        $skin = new Skin();

        $skin->setName($data['name']);
        $skin->setFolderName(preg_replace('/[^x00-x08x0Bx0Cx0E-x1Fx80-x9F|.]/u', '', strtolower($data['colorName'])));
        $skin->setAuthor($data['author']);        
        $skin->setDescription($data['description']);
        $skin->setUuid('UUID');
        $skin->setVersion($data['version']);
        $skin->setColorName($data['colorName']);
        $skin->setColorCode($data['colorCode']);
        $skin->setPosition($data['position']);
        $skin->setStatus('_ACTIVE');
        $skin->setSkinTheme($theme); 
        $skin->setSociety($society); 

        $this->entityManagerInterface->persist($skin);
        $this->entityManagerInterface->flush();

        $filesystem->mkdir($_ENV['ASSETS_PATH'] . 'skins/' . $theme->getFolderName() . '/' . $skin->getFolderName());

        return $newSkin = ['theme_folder' => $theme->getFolderName(), 'skin_folder' => $skin->getFolderName()];
    }

    /**
     * Met a jour habillage
     *
     * @param array $data
     * @return array
     */
    public function updateSkin(array $data) : array
    {
        $filesystem = new Filesystem();
        
        $theme = $this->skinThemeRepository->findOneBy(['id' => $data['theme_id']]);
        $skin = $this->skinRepository->findOneBy(['society' => $this->security->getUser()->getSociety()->getId(), 'color_name' => $data['colorName'], 'skin_theme' => $data['theme_id']]);
        $oldFolder = $skin->getFolderName();
        $skin->setName($data['name']);
        $skin->setFolderName(preg_replace('/[^x00-x08x0Bx0Cx0E-x1Fx80-x9F|.]/u', '', strtolower($data['colorName'])));
        $skin->setAuthor($data['author']);        
        $skin->setDescription($data['description']);
        $skin->setUuid('UUID');
        $skin->setVersion($data['version']);
        $skin->setColorName($data['colorName']);
        $skin->setColorCode($data['colorCode']);
        $skin->setPosition($data['position']);
        $skin->setStatus('_ACTIVE');
        $skin->setSkinTheme($theme);//le setter a besoin de l'objet et non de l'id 
        $this->entityManagerInterface->persist($skin);
        $this->entityManagerInterface->flush();

        return $newSkin = ['theme_folder' => $theme->getFolderName(), 'skin_folder' => $skin->getFolderName()];
    }

    /**
     * Méthode qui vérifie si un skin existe déjà dans la BDD
     *
     * @param $data
     * @return boolean
     */
    public function verifySkin(array $data) : bool
    {
        $skin = $this->skinRepository->findOneBy(['skin_theme' => $data['theme_id'], 'color_name' => $data['color_name']]);

        if (!empty($skin))
            return true;
        
        return false;
    }

    /**
     * Active ou désactive un seul skin
     *
     * @param $data cette variable contient l'id du skin est le status à mettre
     * @return void
     */
    public function enableDisableOneSkin(array $data)
    {
        $skin = $this->skinRepository->findOneBy(['id' => $data['id']]);

        $skin->setStatus($data['status']);

        $this->entityManagerInterface->persist($skin);
        $this->entityManagerInterface->flush();
    }

    /**
     * Active ou désactive tous les skins 
     *
     * @param $data cette variable contient l'id du theme des skin est le status à mettre
     * @return void
     */
    public function enableDisableAllSkin(array $data)
    {
        $skins = $this->skinRepository->findBy(['skin_theme' => $data['id']]);

        foreach($skins as $skin)
        {
            $skin->setStatus($data['status']);
            $this->entityManagerInterface->persist($skin);
        }

        $this->entityManagerInterface->flush();
    }
    
    /**
     * Dezip le zip dans le bon dossier
     *
     * @param $skin Le zip
     * @param $theme_folder le dossier du theme
     * @param $skin_folder le dossier du skin
     * @return bool
     */
    public function unzip($skin, $theme_folder, $skin_folder) : bool
    {
        $za = new \ZipArchive();

        $za->open($skin->getRealPath());

        if ($za->extractTo($_ENV['ASSETS_PATH'] . 'skins/' . $theme_folder . '/' . $skin_folder))
        {
            $za->close();
            return true;
        }
        
        $za->close();
        return false;
        
    }

    /**
     * Récupère un skin selon l'id
     *
     * @param array $data
     * @return array
     */
    public function getOnSkin(array $data) : array
    {
        $skin = $this->skinRepository->findOneBy(['id' => $data['id']]);

        return $this->skinToArray($skin);
    }

    /**
     * Supprime un skin
     *
     * @param array $data qui auras l'id du skin le dossier du skin et du theme
     * @return void
     */
    public function delete(array $data)
    {
        $fs = new Filesystem();
        $skin = $this->skinRepository->findOneBy(['id' => $data['id']]);
        $this->entityManagerInterface->remove($skin);
        $this->entityManagerInterface->flush();
        $fs->remove($_ENV['ASSETS_PATH'] . 'skins/' . $data['theme_folder'] . '/' . $data['skin_folder']);
    }

    /**
     * L'update fait avec le formulaire quand on clique sur un habillage
     *
     * @param array $data
     * @return void
     */
    public function updateFromForm(array $data)
    {
        $theme = $this->skinThemeRepository->findOneBy(['id' =>  $data['theme_id']]);
        $skin = $this->skinRepository->findOneBy(['id' => $data['id']]);

        $skin->setSkinTheme($theme);
        $skin->setPosition($data['position']);
        $skin->setColorName($data['colorName']);
        $skin->setColorCode($data['colorCode']);
        $search = [' ', 'é', 'à', 'è', 'ç', '&'];
        $replace = ['_', 'e', 'a', 'e', 'c', 'et'];
        $skin->setFolderName(str_replace($search, $replace, strtolower($data['colorName'])));

        $this->entityManagerInterface->persist($skin);
        $this->entityManagerInterface->flush();


        $filesystem = new Filesystem();
        $filesystem->rename($_ENV['ASSETS_PATH'] . 'skins/' . $data['oldThemeFolder'] . '/' . $data['oldSkinFolder'] .'/', $_ENV['ASSETS_PATH'] . 'skins/' . $skin->getSkinTheme()->getFolderName() . '/' . $skin->getFolderName() .'/');

    }

    public function getAllSkin() : array
    {
        $tmpSkin = $this->skinRepository->findAll();

        $skin = [];
        foreach ($tmpSkin as $s)
        {
            $skin[] = $s->toArray();
        }

        return $skin;
    }



    /**
     * Tranforme un skin en array avec les information dont on a besoin
     *
     * @param Skin|null $skin
     * @return array
     */
    public function skinToArray(?Skin $skin) : array
    {
        $arraySkin = [
            'id' => $skin->getId(),
            'author' => $skin->getAuthor(),
            'description' => $skin->getDescription(),
            'version' => $skin->getVersion(),
            'name' => $skin->getName(),
            'theme_id' => $skin->getSkinTheme()->getId(),
            'theme_folder' => $skin->getSkinTheme()->getFolderName(),
            'position' => $skin->getPosition(),
            'skin_folder' => $skin->getFolderName(),
            'colorName' => $skin->getColorName(),
            'colorCode' => $skin->getColorCode() 
        ];

        return $arraySkin;
    }

}