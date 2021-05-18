<?php

namespace App\Service;

use App\Entity\SkinTheme;
use App\Service\LibService;
use App\Repository\SkinRepository;
use App\Repository\SocietyRepository;
use App\Repository\SkinThemeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;


class SkinThemeService
{
    
    private $skinThemeRepository;
    private $skinRepository;
    private $societyRepository;
    private $entityManagerInterface;
    private $security;


    function __construct(
                            SkinThemeRepository $skinThemeRepository,
                            SkinRepository $skinRepository,
                            SocietyRepository $societyRepository,
                            EntityManagerInterface $entityManagerInterface,
                            Security $security
                        )
    {
        $this->skinThemeRepository = $skinThemeRepository;
        $this->skinRepository = $skinRepository;
        $this->societyRepository = $societyRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->security = $security;
    }

	/**
	 * Recupère tous les thème existant
	 *
	 * @param string $society_id
	 * @param bool   $skin
	 *
	 * @return array
	 */
    public function getAllTheme(string $society_id, bool $skin) : array
    {

        $tmpSkinTheme = $this->skinThemeRepository->getAllTheme($society_id === "null" ? $this->security->getUser()
	        ->getSociety()->getId() : $society_id);
        
        $allTheme = [];

        foreach($tmpSkinTheme as $theme)
        {
            if ($skin)
            {
                $skins = $this->skinRepository->findBy(['skin_theme' => $theme->getId()], ['position' => 'DESC']);

                if (!empty($skins))
                {
                    $allTheme[] = $this->themeToArray($theme, $skins);
                }
                else
                {
                    $allTheme[] = $this->themeToArray($theme, null);
                }
            }
            else
            {
                $allTheme[] = $this->themeToArray($theme, null);
            }
        }

        return $allTheme;
    }

    /**
     * Recupère tous les thème existant pour la creation de training
     *
     * @return array
     */
    public function getAllThemeForTraining(array $data) : array
    {
        $tmpSkinTheme = $this->skinThemeRepository->getAllThemeActif($this->security->getUser()->getSociety()->getId());
        
        $allTheme = [];

        foreach($tmpSkinTheme as $theme)
        {
            $skins = $this->skinRepository->findBy(['skin_theme' => $theme->getId(), 'status' => '_ACTIVE'], ['position' => 'DESC']);

            if (!empty($skins))
            {
                $allTheme[] = $this->themeToArray($theme, $skins);
            }
        }

        return $allTheme;
    }


    /**
     * Activer ou Désativer un theme est les skins
     *
     * @return void RIEN
     */
    public function updateSkinTheme(array $data) : void
    {
        $theme = $this->skinThemeRepository->findOneBy(['id' => $data['skin_theme_id']]);
        $theme->setStatus($data['skin_theme_status']);

        $skins = $this->skinRepository->findBy(['skin_theme' => $data['skin_theme_id']]);

        foreach($skins as $skin)
        {
            $skin->setStatus($data['skin_theme_status']);
            $this->entityManagerInterface->persist($skin);
        }
        $this->entityManagerInterface->persist($theme);
        $this->entityManagerInterface->flush();
    }
    
    /**
     * Change le theme
     *
     * @return void RIEN
     */
    public function updateTheme(array $data)
    {
        $theme = $this->skinThemeRepository->findOneBy(['id' => $data['id']]);
        $theme->setTitle($data['title']);
        $theme->setPosition($data['position']);
        $this->entityManagerInterface->persist($theme);
        $this->entityManagerInterface->flush();
    }

    /**
     * Donne la position d'un nouveau theme
     *
     * @param integer $society_id l'id de la societer
     * @return integer
     */
    public function getHowManySkinTheme(int $society_id) : int
    {
        $themes = $this->skinThemeRepository->getAllTheme($society_id);
        return count($themes) + 1;
    }

    public function getOneThemeById(int $id) : array
    {
        $theme = $this->skinThemeRepository->findOneBy(['id' => $id]);
        $skins = $this->skinRepository->findBy(['skin_theme' => $id]);
        
        if (!empty($skins))
            $arrayTheme = $this->themeToArray($theme, $skins);
        else
            $arrayTheme = $this->themeToArray($theme, null);
        
        return $arrayTheme;
    }

    /**
     * Création d'un thème en base de donnée
     *
     * @param mixed Les information envoyer par le client
     * @return array le thème
     */
    public function createNewTheme(array $data) : array
    {
        $filesystem = new Filesystem();
        $society = $this->societyRepository->findOneBy(['id' => $data['society']]);
        
        $newTheme = new SkinTheme();
        $newTheme->setTitle($data['title']);
        $newTheme->setFolderName(preg_replace('/[^x00-x08x0Bx0Cx0E-x1Fx80-x9F|.]/u', '', strtolower($data['title'])));
        $newTheme->setPosition($data['position']);
        $newTheme->setStatus('_ACTIVE');
        $newTheme->setSociety($society);
        $this->entityManagerInterface->persist($newTheme);
        $this->entityManagerInterface->flush();
        $filesystem->mkdir($_ENV['ASSETS_PATH'] . 'skins/' . $newTheme->getFolderName());
        return $this->themeToArray($newTheme, null);
    }

    public function delete(array $data) : bool
    {
        $filesystem = new Filesystem();
        $skinTheme = $this->skinThemeRepository->findOneBy(['id' => $data['id']]);
        $skins = $this->skinRepository->findOneBy(['skin_theme' => $data['id']]);
        $filesystem->remove($_ENV['ASSETS_PATH'] . 'skins/' . $skinTheme->getFolderName());

        if (!empty($skins))
            return false;

        $this->entityManagerInterface->remove($skinTheme);
        $this->entityManagerInterface->flush();

        return true;
    }

    /**
     * Transforme les theme en Array pour l'envoi en JSON
     *
     * @param SkinTheme $theme les theme a mettre en Array
     * @param array|null $skins les skin des theme
     * @return array Le theme avec les habillage
     */
    public function themeToArray(SkinTheme $theme, ?array $skins) : array
    {
        $arrayTheme = array();

        if ($skins === null)
        {
            $arrayTheme = [
                'id' => $theme->getId(),
                'title' => $theme->getTitle(),
                'position' => $theme->getPosition(),
                'status' => $theme->getStatus(),
                'folder_name' => $theme->getFolderName()
            ];
        }
        else
        {
            $skin = [];
            foreach ($skins as $s)
            {
                $skin[] = [
                    'id' => $s->getId(),
                    'title' => $s->getName(),
                    'color_code' => $s->getColorCode(),
                    'color' => $s->getColorName(),
                    'status' => $s->getStatus(),
                    'folder_name' => $s->getFolderName()
                ];
            }
            
            $arrayTheme = [
                'id' => $theme->getId(),
                'title' => $theme->getTitle(),
                'position' => $theme->getPosition(),
                'status' => $theme->getStatus(),
                'skin' => $skin,
                'folder_name' => $theme->getFolderName(),
                'default_skin' => 0
            ];
        }

        return $arrayTheme;
    }

}