<?php


namespace App\Service;


use App\Repository\TrainingRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\Security;

class FileManagerService
{

    private $security;
    private $quotaService;
    private $trainingRepository;
    private $tree = [];

    public function __construct(
        Security $security,
        QuotaService $quotaService,
        TrainingRepository $trainingRepository
    )
    {
        $this->security = $security;
        $this->quotaService = $quotaService;
        $this->trainingRepository = $trainingRepository;
    }

    public function getInformationResource(string $path64)
    {

        $path = base64_decode($path64);

        $path_explode = explode('/', $path);

        array_shift($path_explode);
        $real_path = $this->getRealPath($path_explode[0]);

        array_shift($path_explode);

        $real_path .= implode('/',$path_explode);

        $stat = stat($real_path);

        $mode = substr(decoct($stat['mode']), -3, 2);

        return [
            'id' => $path64,
            'thund' => @getimagesize($real_path) ? $real_path : null,
            'name' => '',
            'createdTime' => date('d/m/Y H:i:s',$stat['mtime']),
            'modifiedTime' => date('d/m/Y H:i:s',$stat['mtime']),
            'capabilities' => [
                'canDelete' => $mode > 44,
                'canRename' => $mode > 44,
                'canEdit' => $mode > 44,
                'canCopy' => $mode > 44,
                'canDownload' => $mode > 22,
                'canListChildren' => $mode > 44,
                'canAddChildren' => $mode > 44,
                'canRemoveChildren' => $mode > 44,
            ]
        ];
    }



    public function getInformationResourceChildren(string $path64, array $data = ['orderDirection' => 'ASC'])
    {
        $path = base64_decode($path64);
        $path_explode = explode('/', $path);

        array_shift($path_explode);

        $real_path = $this->getRealPath($path_explode[0]);

        $type = array_shift($path_explode);

        $real_path .= implode('/', $path_explode);

        $all_file = scandir($real_path);

        $return_files = [];

        if ($data['orderDirection'] == 'ASC')
        {
            sort($all_file,SORT_FLAG_CASE);
        }
        else
        {
            rsort($all_file, SORT_FLAG_CASE);
        }

        for ($i = 0; $i < count($all_file); $i++)
        {
            $file = $all_file[$i];
            if ($file != '.' && $file != '..')
            {
            	if ($data['onlyType'] !== 'null')
	            {
		            if (strpos(mime_content_type($real_path . '/' . $file), $data['onlyType']) !== false || is_dir($real_path . '/' . $file))
		            {
			            $return_files[] = $this->getFileInformation($real_path, $file, $path_explode, $type, $path64);
		            }
	            }
	            else
	            {
		            $return_files[] = $this->getFileInformation($real_path, $file, $path_explode, $type, $path64);
	            }
            }

        }


        return $return_files;
    }

	/**
	 * @param string $real_path
	 * @param string $file
	 * @param array  $path_explode
	 * @param string $type
	 * @param string $path64
	 *
	 * @return array
	 */
    private function getFileInformation(string $real_path, string $file, array $path_explode, string $type, string
    $path64) : array
    {
	    $stat = stat($real_path . '/' . $file);

	    $bit = $stat['size'];
	    $octet = $bit / 8;
	    $kilo = $octet / 1024;
	    $mode = substr(decoct($stat['mode']), -3, 2);
	    return [
		    'id' => implode('/', $path_explode) !== "" ? base64_encode('/'.$type.'/'  . implode('/', $path_explode)  . '/' . $file) : base64_encode('/'.$type.'/'   .  $file),
		    'name' => $file,
		    'createdTime' => date('d/m/Y H:i:s',$stat['mtime']),
		    'modifiedTime' => date('d/m/Y H:i:s',$stat['mtime']),
		    is_dir($real_path . '/' . $file) ? null : 'size' => number_format($kilo,2),
		    'thund' => substr($real_path   . '/' . $file,strpos($real_path   . '/'. $file, '/assets')),
		    'capabilities' => [
			    'canDelete' => $mode > 44,
			    'canRename' => $mode > 44,
			    'canEdit' => $mode > 44,
			    'canCopy' => $mode > 44,
			    'canDownload' => $mode > 22,
			    'canListChildren' => $mode > 44,
			    'canAddChildren' => $mode > 44,
			    'canRemoveChildren' => $mode > 44,
		    ],
		    'type' => is_dir($real_path . '/' . $file) ? 'dir' : 'file',
		    'parentId' => $path64,
		    'ancestors' => $this->getInformationResource($path64)
	    ];
    }

    public function uploadCreate(array $data, ?File $file = null) : bool
    {
        $path = base64_decode($data['parentId']);

        $path_explode = explode('/', $path);
        array_shift($path_explode);

        $real_path = $this->getRealPath($path_explode[0]);

        array_shift($path_explode);

        $real_path .= implode('/', $path_explode);
        $real_path = str_replace('//', '/', $real_path);



        if ($data['type'] == 'dir')
        {
            $fs = new Filesystem();
            $fs->mkdir($real_path . '/' . $data['name']);
            return true;
        }
        else if($data['type'] == 'file' && $this->quotaService->noSpace($this->security->getUser()->getSociety()->getId()))
        {
            $file->move(str_replace("//","/", $real_path), $file->getClientOriginalName());
            $this->quotaService->noSpace($this->security->getUser()->getSociety()->getId());
            return true;
        }

        return false;
    }

    public function deleteFileFolder(string $path64)
    {
        $path = base64_decode($path64);

        $path_explode = explode('/', $path);

        $real_path = $this->getRealPath($path_explode[0]);
        array_shift($path_explode);
        $real_path .= implode('/', $path_explode);
        $fs = new Filesystem();
        $fs->remove($real_path);

        return true;
    }

    public function renameFileFolder(string $path64, string $new_name) : bool
    {
        $path = base64_decode($path64);

        $path_explode = explode('/', $path);
        array_shift($path_explode);

        $real_path = $this->getRealPath($path_explode[0]);
        $rename = $this->getRealPath($path_explode[0]);

        array_shift($path_explode);
        $real_path .=  implode('/', $path_explode);

        array_pop($path_explode);
        $rename .= implode('/', $path_explode) . '/' . $new_name;
        $fs = new Filesystem();
        $fs->rename($real_path, $rename);

        return true;
    }

    /**
     * @param string $path64
     * @param int $position
     * @param string|null $base_path
     * @return array
     */
    public function getTreeFolder(string $path64, int $position = 0, ?string $base_path = null) : array
    {

        $path = base64_decode($path64);

        $path_explode = explode('/', $path);

        array_shift($path_explode);

        if ($base_path === null)
            $real_path = $this->getRealPath($path_explode[0]);
        else
            $real_path = $base_path . $path_explode[$position] . '/';

        $scandir = scandir($real_path);

        $this->tree['main'] = $path_explode[0];

        if ($path_explode[count($path_explode) - 1] === "")
            array_pop($path_explode);

        $this->tree['current'] = $path_explode[count($path_explode) - 1];

        foreach ($scandir as $s)
        {
            $next = $position + 1;
            if (is_dir($real_path . '/' . $s) && $s !== "." && $s !== "..")
            {
                $this->tree['sub'][] = [
                    'folderName' => $s,
                    'open' => false,
                    'position' => $position,
                    'folder' => '/' . implode('/', array_slice($path_explode,0,$next)) .'/' . $s
                ];

                if (!empty($path_explode[$next]) && $path_explode[$next] !== "")
                {
                    if ($s === $path_explode[$next])
                    {
                        $this->getTreeFolder(base64_encode('/' . implode('/', $path_explode) .'/'), $next, $real_path);
                    }
                }
            }
        }


        if (empty($this->tree['sub']))
            $this->tree['sub'] = [];

        return $this->tree;
    }

    private function getRealPath(string $base_path) : string
    {

        if ($base_path === "general")
        {
            return $_ENV['ASSETS_PATH'] . 'uploads/librairies/' . $this->security->getUser()->getSociety()->getId() . '/';
        }
        else if($base_path === "free")
        {
            return $_ENV['FREE_LIB_PATH'];
        }
        else
        {
            return $_ENV['ASSETS_PATH'] . 'trainings/'  . $this->security->getUser()->getSociety()->getId() .'/' . $base_path . '/';
        }

    }

}