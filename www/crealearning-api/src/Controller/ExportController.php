<?php

namespace App\Controller;

use App\Service\SocietyService;
use App\Controller\LibController;

use App\Service\Export\PDFExportService;
use App\Service\Export\ScormExportService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;


class ExportController extends LibController
{

    /**
     * @Route("/training/download/scorm", methods={"GET"})
     *
     * @return void
     */
    public function scormDownloaded(ScormExportService $scormExportService, SocietyService $societyService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $download = $scormExportService->isDownloaded($data);
        
        $agoraLink = $societyService->agoraLink();

        return $this->setReturn(self::OK, ['link' => $download, 'agora' => $agoraLink]);
    }

    /**
     * @Route("/training/export/scorm", methods={"POST"})
     *
     * Créer l'archive scorm
     * 
     * @return JsonResponse
     */
    public function scorm(ScormExportService $scormExportService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $scormExportService->getTraining($data);
        $scormExportService->isMonograinExport($data);
        $scormExportService->initialize();
        $scormExportService->pack();

        return $this->setReturn(self::CREATED);
    }

    /**
     * @Route("/training/export/pdf", methods={"POST"})
    *
    * CRéer le PDF
    * @param PDFExportService $pdfExportService
    * @return JsonResponse
    */
    public function exportTrainingOnPDF(PDFExportService $pdfExportService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $pdfExportService->exportOnPDF($data);

        return $this->setReturn(self::CREATED);       
    }

    /**
     * @Route("/training/download/pdf", methods={"GET"})
    *
    * @param PDFExportService $pdfExportService
    * @return JsonResponse
    */
    public function pdfDownloaded(PDFExportService $pdfExportService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $link = $pdfExportService->isDownloaded($data);

        return $this->setReturn(self::OK, ['link' => $link]);       
    }

    /**
     * @Route("/training/export/agora/{id}", methods={"GET"})
     *
     * @return void
     */
    public function exportAgora(ScormExportService $scormExportService, Request $request) : bool
    {
        $data = $this->getBody($request);

        $download = $scormExportService->isDownloaded($data);

		header("Location: " . $download);
		
		return true;
    }
}
