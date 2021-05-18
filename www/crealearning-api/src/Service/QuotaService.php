<?php

namespace App\Service;

use App\Entity\Society;
use App\Entity\User;
use Exception;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use App\Repository\SocietyRepository;
use App\Repository\TrainingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;

class QuotaService
{
    private $security;

    private $societyRepository;
    private $trainingRepository;

    private $entityManagerInterface;

    public function __construct(Security $security, 
                                SocietyRepository $societyRepository, 
                                TrainingRepository $trainingRepository,
                                EntityManagerInterface $entityManagerInterface)
    {
        $this->security =  $security;
        $this->societyRepository = $societyRepository;
        $this->trainingRepository = $trainingRepository;
        $this->entityManagerInterface = $entityManagerInterface;
    }

    /**
     * Fonction qui récupere la taille en octet de tous les fihciers dans des dossiers
     *
     * @param string $path le chemin que l'on souhaite avoir la taille
     * @return float
     */
    private function getSpaceDiskUsed(string $path) : float
    {
        $bytes_total = 0;
        $path = \realpath($path);
        if ($path !== false && is_dir($path))
        {
            foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path)) as $object)
            {
                try
                {
                    if ($object->getFilename() !== "." && $object->getFilename() !== "..")
                        $bytes_total += $object->getSize();
                }
                catch (Exception $e)
                {
                    dump($e->getMessage());
                    return 0;
                }
            }
        }

        return $bytes_total;
    }

    /**
     * Fonction permmetant de faire un explode avec plusieur délimiter dans une array
     *
     * @param array $delimiters
     * @param string $string
     * @return array
     */
    private function multiexplode (array $delimiters,string $string) : array
    {
   
        $ready = str_replace($delimiters, $delimiters[0], $string);
        $launch = explode($delimiters[0], $ready);
        return  $launch;
    }

    /**
     * Retourne la taille d'un dossier d'une societer en octet
     *
     * @param string $currentPath
     * @return float
     */
    public function setSpaceDiskUsedSociety(string $currentPath) : float
    {
        $wordInPath = $this->multiexplode(["/","%7C"], $currentPath);
        $society = null;
        $training = null;
        $i = 0;
        $j = 0;
        
        while ($society === null && $i < count($wordInPath))
        {
            $word = $wordInPath[$i];
            $society = $this->societyRepository->findOneBy(['id' => $word]);
            $i++;
        }

        while ($training === null && $j < count($wordInPath))
        {
            $word = $wordInPath[$j];
            $training = $this->trainingRepository->findOneBy(['uuid' => $word]);
            $j++;
        }

        $size = $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'uploads/librairies/' . $society->getId());
        $size += $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'skin/' . $society->getId());
        $size += $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'uploads/avatars/' . $society->getId());
        $size += $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'trainings/' . $society->getId());

        if ($training !== null)
        {
            $training_size = $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'trainings/' . $society->getId() . '/' . $training->getUuid());
            $training->setDiskSpace($training_size);
            $this->entityManagerInterface->persist($training);
        }

        $society->setDiskSpace(number_format($size/1048576,2));

        $this->entityManagerInterface->persist($society);
        $this->entityManagerInterface->flush();

        if ($society->getDiskSpace() >= $society->getQuota() && $society->getQuota() > -1)
            return false;
        

        return true;
    }

    /**
     * Retourne la taille d'un traning en octet
     *
     * @param integer $training_uuid
     * @return int
     */
    public function setSpaceDiskUsedTraining(string $training_uuid, ?User $user = null)
    {
    	if ($user === null)
            $user = $this->security->getUser();
        $size = $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . '/trainings/' . $user->getSociety()->getId().'/' . $training_uuid);

        $training = $this->trainingRepository->findOneBy(['uuid' => $training_uuid]);

        $training->setDiskSpace(number_format($size/1048576,2));
        $this->setSpaceDiskUsedSociety($_ENV['ASSETS_PATH'] . '/trainings/' . $user->getSociety()->getId().'/' . $training_uuid);

        $this->entityManagerInterface->persist($training);
        $this->entityManagerInterface->flush(); 

        return $size;
    }

    /**
     * Retourne la taille de tous les trainings
     *
     * @return float
     */
    public function setSpaceDiskUsedAllTraining()
    {
        return $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'trainings/' . $this->security->getUser()->getSociety()->getId());
    }

    /**
     * Permet de recalculer à n'importe qu'elle moment l'espace pris par une entreprise.
     *
     * @param integer $society_id
     * @return boolean Si l'entreprise a plus d'espace pour elle
     */
    public function noSpace(int $society_id) : bool
    {
        $society = $this->societyRepository->findOneBy(['id' => $society_id]);

        $size = $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'uploads/librairies/' . $society->getId());
        $size += $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'skin/' . $society->getId());
        $size += $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'uploads/avatars/' . $society->getId());
        $size += $this->getSpaceDiskUsed($_ENV['ASSETS_PATH'] . 'trainings/' . $society->getId());

        // 1 048 576 est le nombre de bits en un méga
        $society->setDiskSpace(number_format($size/1048576,2));

        $this->entityManagerInterface->persist($society);
        $this->entityManagerInterface->flush();

        if ($society->getDiskSpace() >= $society->getQuota() && $society->getQuota() > -1)
            return false;
        

        return true;
    }
}
