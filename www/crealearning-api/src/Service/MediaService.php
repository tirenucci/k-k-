<?php

namespace App\Service;

use App\Service\QuotaService;
use App\Repository\GrainRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\File\File;

class MediaService
{
    private $allImage = [];

    private $grainRepository;
    private $quotaService;
    private $security;

    public function __construct(GrainRepository $grainRepository, QuotaService $quotaService, Security $security)
    {
        $this->grainRepository = $grainRepository;
        $this->quotaService = $quotaService;
        $this->security = $security;
    }

    public function convert(array $data) : bool
    {
        $tempFile = explode('.', $data['url']);
        $extension = end($tempFile);
        $path = $_ENV['ROOT_PATH'] . $tempFile[0];
        $tempFile = $path . '-temp.mp4';
        exec("/usr/bin/ffmpeg -i ".$path . '.' . $extension ." ".$tempFile);

        if (unlink($path . '.' . $extension)) 
        {
            rename($tempFile, $path . '.mp4');
            return true;
        }
        else
        {
            return false;
        }

    }


    /**
     * Fonction qui permet de faire l'upload des media
     *
     * @param File $media
     * @param string $name
     * @param integer $id_grain
     * @return string
     */
    public function uploadMedia(File $media, string $name, int $id_grain) : string
    {
        $filesystem = new Filesystem();
        $grain = $this->grainRepository->findOneBy(['id' => $id_grain]);
        
        if ($this->quotaService->noSpace($this->security->getUser()->getSociety()->getId()))
        {
            
            $media->move($_ENV['ASSETS_PATH'] . 'trainings/' . $this->security->getUser()->getSociety()->getId() . '/' . $grain->getTraining()->getUuid(), $this->security->getUser()->getSociety()->getId() . $name);
            exec('ffmpeg -i "' . $_ENV['ASSETS_PATH'] . 'trainings/' . $this->security->getUser()->getSociety()->getId() . '/' . $grain->getTraining()->getUuid(). '/' . $this->security->getUser()->getSociety()->getId() . $name . '" -c:v copy -fflags +genpts "'. $_ENV['ASSETS_PATH'] . 'trainings/' . $this->security->getUser()->getSociety()->getId() . '/' . $grain->getTraining()->getUuid() . '/'. $name .'"');
            $filesystem->remove($_ENV['ASSETS_PATH'] . 'trainings/' . $this->security->getUser()->getSociety()->getId() . '/' . $grain->getTraining()->getUuid(). '/' . $this->security->getUser()->getSociety()->getId() . $name );
            $this->quotaService->setSpaceDiskUsedTraining($grain->getTraining()->getUuid());


            return $_ENV['ASSETS_URL'] . 'trainings/' . $this->security->getUser()->getSociety()->getId() . '/' . $grain->getTraining()->getUuid() . '/' . $name;
        }

        return "";
    }



    /**
     * Fonction qui permet de récuperer le base64 d'une frame voulus d'une vidéo
     *
     * @param array $data
     * @return string
     */
    public function getImage(array $data) : string
    {
        exec("/usr/bin/ffmpeg -ss ". $data['time'] ." -i " . $_ENV['ROOT_PATH'] . $data['url'] . " -s 400x300 -frames:v 1 " . $_ENV['TMP_TRAINING_PATH'] . $this->security->getUser()->getSociety()->getId() . '.png');

        $base64 = 'data:image/png;base64,' . \base64_encode(\file_get_contents($_ENV['TMP_TRAINING_PATH'] . $this->security->getUser()->getSociety()->getId() . '.png'));

        unlink($_ENV['TMP_TRAINING_PATH']. $this->security->getUser()->getSociety()->getId() . '.png');

        return $base64;
    }

    /**
     * Permet de couper une vidéo
     *
     * @param array $data
     * @return bool
     */
    public function trimVideo(array $data) : bool
    {
        $grain = $this->grainRepository->findOneBy(['id' => $data['id_grain']]);
        $tempFile = explode('.', $data['url']);
        if ($this->quotaService->setSpaceDiskUsedSociety($_ENV['ROOT_PATH'] . $tempFile[0]))
        {
            $extension = end($tempFile);
            $path = $_ENV['ROOT_PATH'] . $tempFile[0];
            $tempFile = $path . '-temp.' . $extension;
    
            if ($extension === "mp4")
            {
                exec("/usr/bin/ffmpeg -ss " . $data['begin'] . " -i " . $path . '.' . $extension . " -t " . $data['end'] . ' -c:v libx264 -c:a aac -strict experimental -b:a 16k ' . $tempFile . ' -f null 2>&1');
            }
            else
            {
                exec("/usr/bin/ffmpeg -i \"".$path . '.' . $extension ."\" -ss ".$data['begin']." -to " . $data['end'] . " -async 1 -c:a copy \"".$tempFile."\" -f null - 2>&1");
            }
    
            if (unlink($path . '.' . $extension)) 
            {
                rename($tempFile, $path . '.' . $extension);
                $this->quotaService->setSpaceDiskUsedTraining($grain->getTraining()->getUuid());
                return true;
            }
            else
            {
                return false;
            }
        }

        return false;
    }

    public function getFreeImage(array $data, string $folder = '')
    {
        $folderName = $_ENV['FREE_LIB_PATH'] . $folder;

        $items = \scandir($folderName);

        foreach($items as $item)
        {
            if (is_dir($folderName . '/' . $item) && $item !== "." && $item !== "..")
            {
                $this->allImage += $this->getFreeImage($data, $item);
            }
            elseif(is_file($folderName . '/' . $item) && strpos($item, $data['word']))
            {
                $this->allImage[] = ['path' => '/' . substr($folderName, strpos($folderName, "assets")) . '/' . $item, 'name' => $item];
            }
        }
        return $this->allImage;
    }
}
