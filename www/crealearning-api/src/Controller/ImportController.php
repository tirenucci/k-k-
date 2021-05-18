<?php

namespace App\Controller;

use App\Service\ImportCreaService;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class ImportController extends LibController
{

	/**
	 * @Route("/import/training_information", methods={"POST"})
	 *
	 * @param ImportCreaService $importCreaService
	 * @param Request           $request
	 *
	 * @return JsonResponse
	 * @throws \Exception
	 */
    public function getInformation(ImportCreaService $importCreaService, Request $request) : JsonResponse
    {
        $file = $this->getFiles($request, "moduleZip");

        $information = $importCreaService->getInformation($file);

        return $this->setReturn(self::OK, $information);
    }

	/**
	 * @Route("/import/crea", methods={"POST"})
	 *
	 * @param ImportCreaService $importCreaService
	 * @param Request           $request
	 *
	 * @return JsonResponse
	 */
    public function importCrea(ImportCreaService $importCreaService, Request $request) : JsonResponse
    {
        $file = $this->getFiles($request, "moduleZip");
        $action_training = $request->request->get('action_training');
        $exist_skin = $request->request->get('exist_skin');

        if ($importCreaService->importZip($action_training, $exist_skin))
        {
            return $this->setReturn(self::OK);
        }

        return $this->setReturn(self::NOT_FOUND);
    }


}
