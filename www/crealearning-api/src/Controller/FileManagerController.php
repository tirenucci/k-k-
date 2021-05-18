<?php


namespace App\Controller;

use App\Service\FileManagerService;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


class FileManagerController extends LibController
{
    /**
     * @Route("/files/{path}", methods={"GET"})
     * @param string $path
     * @param FileManagerService $fileManagerService
     * @return JsonResponse
     */
    public function getResource(string $path, FileManagerService $fileManagerService) : JsonResponse
    {
        $resource = $fileManagerService->getInformationResource($path);

        return $this->setReturn(self::OK, $resource);
    }


    /**
     *
     * @Route("files/{path}/children", methods={"GET"})
     * @param string $path
     * @param FileManagerService $fileManagerService
     * @param Request $request
     * @return JsonResponse
     */
    public function getChildrenResource(string $path, FileManagerService  $fileManagerService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $files = $fileManagerService->getInformationResourceChildren($path, $data);

        return $this->setReturn(self::OK, ['items' => $files]);
    }

    /**
     * @Route("/files", methods={"POST"})
     * @param Request $request
     * @param FileManagerService $fileManagerService
     * @return JsonResponse
     */
    public function uploadCreateFile(Request $request, FileManagerService $fileManagerService)
    {
        $file = $this->getFiles($request, 'file');
        $parentId = $this->getGet($request, 'parentId');
        $type = $this->getGet($request, 'type');
        $name = $this->getGet($request, 'name');
        if ($parentId == "" || $parentId == null)
        {
            $data = $this->getBody($request);
            $parentId = $data['parentId'];
            $type = $data['type'];
            $name = $data['name'];
        }

        if ($fileManagerService->uploadCreate(['parentId' => $parentId, 'type' => $type, 'name' => $name],$file))
            return $this->setReturn(self::CREATED);

        return $this->setReturn(self::CONFLICT);
    }

    /**
     *
     * @Route("/files/{path}", methods={"DELETE"})
     *
     * @param string $path
     * @param Request $request
     * @param FileManagerService $fileManagerService
     * @return JsonResponse
     */
    public function delete(string $path, Request $request, FileManagerService $fileManagerService) : JsonResponse
    {
        if ($fileManagerService->deleteFileFolder($path))
        {
            return $this->setReturn(self::OK);
        }

        return $this->setReturn(self::NOT_FOUND);

    }

    /**
     * @Route("/files/{path}", methods={"PUT"})
     *
     * @param string $path
     * @param Request $request
     * @param FileManagerService $fileManagerService
     * @return JsonResponse
     */
    public function rename(string $path, Request $request, FileManagerService $fileManagerService) : JsonResponse
    {
        $data = $this->getBody($request);

        if ($fileManagerService->renameFileFolder($path, $data['name']))
        {
            return $this->setReturn(self::OK);
        }
    }

    /**
     * @Route("/download/{path}", methods={"PUT"})
     *
     * @param string $path
     * @param Request $request
     * @param FileManagerService $fileManagerService
     * @return JsonResponse
     */
    public function download(string $path, Request $request, FileManagerService $fileManagerService) : JsonResponse
    {
        // @FIXME La fonction n'est pas appelais par le client
        $data = $this->getBody($request);

        if ($fileManagerService->renameFileFolder($path, $data['name']))
        {
            return $this->setReturn(self::OK);
        }
    }

    /**
     * @Route("/get_tree/{path}", methods={"GET"})
     *
     * @param string $path
     * @param Request $request
     * @param FileManagerService $fileManagerService
     * @return JsonResponse
     */
    public function getTree(string $path, FileManagerService $fileManagerService, Request $request) : JsonResponse
    {
        $tree = $fileManagerService->getTreeFolder($path);

        return $this->setReturn(self::OK, $tree);
    }

}