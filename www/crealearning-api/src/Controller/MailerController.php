<?php

namespace App\Controller;

use App\Service\MailerService;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class MailerController
{
    /**
     * @Route("/mail/recovery", methods={"POST"})
     *
     * @param Request $request
     * @param MailerService $mailerService
     * @param MailerInterface $mailer
     * @return JsonResponse
     */
    public function sendRecoveryMail(Request $request, MailerService $mailerService, MailerInterface $mailer) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $mailerService->sendMailRecovery($data, $mailer);

        return new JsonResponse(Response::HTTP_OK);
    }

    /**
     * @Route("/mail/contact", methods={"POST"})
     *
     * @param Request $request
     * @param MailerService $mailerService
     * @param MailerInterface $mailer
     * @return JsonResponse
     */
    public function sendMailToTL(Request $request, MailerService $mailerService, MailerInterface $mailer) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $mailerService->sendMailTL($data, $mailer);

        return new JsonResponse(Response::HTTP_OK);
    }

    /**
     * @Route("/mail/send_share_mail", methods={"POST"})
     *
     * @param Request $request
     * @param MailerService $mailerService
     * @param MailerInterface $mailer
     * @return JsonResponse
     */
    public function sendShareMail(Request $request, MailerService $mailerService, MailerInterface $mailer) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $mailerService->sendShareMail($data, $mailer);

        return new JsonResponse(Response::HTTP_OK);
    }

    /**
     * @Route("/mail/cancel", methods={"POST"})
     *
     * @param Request $request
     * @param MailerService $mailerService
     * @param MailerInterface $mailer
     * @return JsonResponse
     */
    public function cencelOffer(Request $request, MailerService $mailerService, MailerInterface $mailer) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $mailerService->sendCancelRequestToTL($data, $mailer);

        return new JsonResponse(Response::HTTP_OK);
    }
}