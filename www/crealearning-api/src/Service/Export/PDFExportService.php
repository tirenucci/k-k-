<?php

namespace App\Service\Export;

use Dompdf\Dompdf;
use App\Repository\TrainingRepository;

use App\Entity\Grain;
use App\Service\GrainService;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;

class PDFExportService
{

    private $trainingRepository;
    private $grainService;

    private $filesystem;

    public function __construct(TrainingRepository $trainingRepository, GrainService $grainService, Filesystem $filesystem)
    {
        $this->trainingRepository = $trainingRepository;
        $this->grainService = $grainService;
        $this->filesystem = $filesystem;
    }

    public function exportOnPDF(array $data)
    {
        $training = $this->trainingRepository->findOneBy([ 'id' => $data['id']]);
        $trainingName = $training->getName();
        $colorCode = $training->getSkin()->getColorCode();
        $html = '';

        /**Pour plus tard quand on souhaitera personnaliser le pdf avec le style de l'habillage complet
        /$styleSheet = $_ENV['ASSETS_PATH'] . 'skins/' . $training->getSkin()->getSkinTheme()->getFolderName() . '/' . $training->getSkin()->getFolderName() . '/style.css';*/

        $grains = $training->getGrains();
        $html .= '<html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                        <style>
                            @page {
                                margin: 100px 25px;
                            }

                            header {
                                position: fixed;
                                top: -60px;
                                left: 0px;
                                right: 0px;
                                height: 50px;
                                background-color:' . $colorCode . ';
                                color: white;
                                text-align: center;
                                line-height: 40px;
                                font-size: 1.6rem;
                            }

                            .cle-block-list{
                                list-style: none;
                            }

                            .footer {
                                position: fixed; 
                                bottom: -60px; 
                                left: 0px; 
                                right: 0px;
                                height: 50px; 
                                background-color:' . $colorCode . ';
                                color: white;
                                text-align: center;
                                line-height: 35px;
                            }
                        </style>
                    </head>';
        foreach ($grains as $key => $grain) 
        {
            $html .= '
                    <body> ';
            if ($data['pdfOption']['header'])
                $html .=            '<header>'. $grain->getName() .'</header>';
                            $htmls = $this->grainService->generateHtml(['grain_id' => $grain->getId(), 'language' => 'fr']);
                            foreach ($htmls[0] as $h)
                            {
                                $html .= '
                                    <main>
                                        <ul id="cle-block-list" class="ui-sortable ui-droppable">
                                            <li class="cle-block-list li ui-corner-all cle-block-unselected">'
                                            . $h['htmlCode'] .
                                            '</li>
                                        </ul>
                                    </main>';
                            }
                            if($data['pdfOption']['footer'])
                                $html .= '<footer class="footer">' . ($key + 1) . ' / '. count($grains) .'</footer>';
                            else
                                $html .= '<footer></footer>';
                            
                    $html .= '</body>';
        }
        $html .= '</html>';

        $dompdf = new Dompdf();
        $dompdf->set_option("isRemoteEnabled", true);
        $contxt = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);
        $dompdf->setHttpContext($contxt);
        $dompdf->loadHtml($html, "UTF-8");
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        $this->filesystem->mkdir(Utils::satanizeFileName($training->getSociety()->getId() . "/" . $training->getUuid() . '/pdf/'));
        file_put_contents(Utils::satanizeFileName($training->getSociety()->getId() . "/" . $training->getUuid() . '/pdf/' . $trainingName) . '.pdf', $dompdf->output());
        $dompdf->stream(Utils::satanizeFileName($trainingName) . '.pdf', [
            "Attachment" => true
        ]);

        return $dompdf;
    }

    public function isDownloaded(array $data) : string
    {
        $training = $this->trainingRepository->findOneBy(['id' => $data['id']]);
        if (file_exists(Utils::satanizeFileName($training->getSociety()->getId() . '/' . $training->getUuid() . '/pdf/' . $training->getName()) . '.pdf') === true)
        {
            return Utils::satanizeFileName($_ENV['BACK_ORIGIN_URL'] . $training->getSociety()->getId() . '/' . $training->getUuid() . '/pdf/' .  $training->getName()) . '.pdf';
        }
        else
        {
            return "";
        }
    }
}
