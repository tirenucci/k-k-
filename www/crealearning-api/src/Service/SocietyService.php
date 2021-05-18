<?php

namespace App\Service;

use App\Entity\Society;
use App\Repository\SkinRepository;
use App\Repository\SocietyRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\ActivatedLanguageService;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\File\File;

class SocietyService
{

    private $societyRepository;
    private $entityManagerInterface;
    private $security;
    private $skinRepository;
    private $activatedLanguageService;

    function __construct(
                            SkinRepository $skinRepository, 
                            SocietyRepository $societyRepository, 
                            EntityManagerInterface $entityManagerInterface, 
                            Security $security,
                            ActivatedLanguageService $activatedLanguageService
                        )
    {
        $this->societyRepository = $societyRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->security = $security;
        $this->skinRepository = $skinRepository;
        $this->activatedLanguageService = $activatedLanguageService;
    }

    /**
     * Permet d'afficher toutes les sociétés
     *
     * @param array
     * @return array
     */
    public function getSocieties(array $data) : array
    {
        $societies = $this->societyRepository->findByName($data['wordSearch']);

        $data = [];
        foreach ($societies as $society)
        {
            $data[] = $society->toArray();
        }

        return $data;
    }

    /**
     * Permet de créer une société
     *
     * @param array
     * @return Society 
     */
    public function createSociety(array $data) : array
    {
        $fileSysteme = new Filesystem();
        $society = new Society();
        $society->setName($data['societyName']);
        $society->setQuota($data['societyQuota']);
        $society->setDiskSpace(0);
        $society->setOpencrea($data['opencrea']);
        $society->setSkinDefault((int)$data['default_skin']);
        $society->setAgoraSmart($data['agoraLink']);
        $society->setShareMail($data['shareMail']);
        $society->setMonograinScorm($data['monograin']);

        $this->entityManagerInterface->persist($society);
        $this->entityManagerInterface->flush();

        $this->activatedLanguageService->generateDefault($society);

        $fileSysteme->mkdir($_ENV['UPLOAD_PATH'] . '/' . $society->getId());

        return $society->toArray();
    }

    /**
     * Récupère les infos d'une société par son id
     *
     * @param array $data
     * @return array
     */
    public function getDataSociety(array $data) : array
    {
        $society = $this->societyRepository->findOneBy(['id' => $data['id'] !== "null" ? $data['id'] :
	        $this->security->getUser()->getSociety()->getId()]);

        return $society->toArray();
    }

    /**
     * Met à jour les infos 
     *
     * @param array $data
     * @return array
     */
    public function updateSociety(array $data) :array
    {
        $society = $this->societyRepository->findOneBy(['id' => $data['id']]);

        $society->setName($data['societyName']);
        $society->setQuota($data['societyQuota']);
        $society->setOpencrea($data['opencrea']);
        $society->setSkinDefault($data['default_skin']);
        $society->setAgoraSmart($data['agoraLink']);
        $society->setShareMail($data['shareMail']);
        $society->setMonograinScorm($data['monograin']);

        $this->entityManagerInterface->persist($society);
        $this->entityManagerInterface->flush();
        
        return $society->toArray();
    }

    /**
     * Supprime une société
     *
     * @param array $data
     * @return array
     */
    public function deleteSociety(array $data): array
    {
        $society = $this->societyRepository->findOneBy(['id' => $data['id']]);
        $this->entityManagerInterface->remove($society);
        $this->entityManagerInterface->flush();

        return $society->toArray();
    }

    /**
     * Permet d'avoir le pourcent de disk utiliser par le client
     *
     * @param array $data
     * @return integer
     */
    public function getQuotaPercent(array $data) : array
    {
        if (isset($data['id']))
            $society = $this->societyRepository->findOneBy(['id' => $data['id']]);
        else
            $society = $this->security->getUser()->getSociety();

        $percent = $society->getDiskSpace() * 100 / $society->getQuota();
        $quota = $society->getQuota();
        if ($quota === -1.0){
            $quota = '∞';
        }
        else {
            $quota = (number_format($society->getQuota(), 0));
        }

        return ["percent" => number_format($percent,2), "quota" => $quota, "used" => (number_format($society->getDiskSpace(),2))];
    }

    public function getConfig(array $data) : array
    {
        $config = $this->societyRepository->findOneBy(['id' => $data['id']]);

        return $config->toArray();
    }

    public function uploadLogo(File $file, int $society_id) : bool
    {
        $file->move($_ENV['ASSETS_PATH'] . 'img/avatar/'.$this->security->getUser()->getSociety()->getId(), $file->getClientOriginalName());

        $society = $this->societyRepository->findOneBy(['id' =>  $society_id]);

        $society->setLogoName($file->getClientOriginalName());

        $this->entityManagerInterface->persist($society);
        $this->entityManagerInterface->flush();

        return true;
    }

    public function agoraLink()
    {
        return $this->security->getUser()->getSociety()->getAgoraSmart();
    }

    public function editSociety(array $data)
    {
    	$society = $this->security->getUser()->getSociety();

	    $society->setShareMail($data['share_mail']);
	    $society->setAgoraSmart($data['agora_smart']);
	    $society->setSkinDefault($data['skin_default']);
	    $society->setMonograinScorm($data['monograin_scorm']);

	    $this->entityManagerInterface->persist($society);
	    $this->entityManagerInterface->flush();
    }
}
