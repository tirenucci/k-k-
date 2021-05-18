<?php

namespace App\Service;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Contracts\Translation\TranslatorInterface;

class MailerService
{
    private $userRepository;

    private $entityManagerInterface;

    private $mailer;

    private $security;
    private $translator;

    public function __construct(
                                    UserRepository $userRepository, 
                                    EntityManagerInterface $entityManagerInterface, 
                                    MailerInterface $mailer,
                                    Security $security,
                                    TranslatorInterface $translator
                                )
    {
        $this->userRepository = $userRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->mailer = $mailer;
        $this->security = $security;
        $this->translator = $translator;
    }

    /**
     * Initialise un token puis envoi un mail pour redéfinir son mdp
     *
     * @param array $data
     * @param MailerInterface $mailer
     * @return void
     */
    public function sendMailRecovery(array $data, MailerInterface $mailer)
    {
        $user = $this->userRepository->findOneBy(['email' => $data['email']]);
        $userToken = bin2hex(random_bytes(20));

        $currentLanguage = $user->getLanguage()->getLanguageCode();

        $title = $this->translator->trans('recovery.title', [], 'text', $currentLanguage);

        $hello = $this->translator->trans('recovery.hello', [], 'text', $currentLanguage);
        $recoveryMessage = $this->translator->trans('recovery.message', [], 'text', $currentLanguage);
        $clicMessage = $this->translator->trans('recovery.clic', [], 'text', $currentLanguage);
        $resetButton = $this->translator->trans('recovery.btn', [], 'text', $currentLanguage);
        $copyableLink = $this->translator->trans('recovery.copyableLink', [], 'text', $currentLanguage);
        $expirationMessage = $this->translator->trans('recovery.expiration', [], 'text', $currentLanguage);

        $terms = $this->translator->trans('terms', [], 'text', $currentLanguage);
        $termsLink = $this->translator->trans('terms.link', [], 'text', $currentLanguage);
        $legal = $this->translator->trans('legal', [], 'text', $currentLanguage);
        $legalLink = $this->translator->trans('legal.link', [], 'text', $currentLanguage);
        $contact = $this->translator->trans('contact', [], 'text', $currentLanguage);
        $contactLink = $this->translator->trans('contact.link', [], 'text', $currentLanguage);

        $user->setToken($userToken);
        $this->entityManagerInterface->persist($user);
        $this->entityManagerInterface->flush();
        $email = (new TemplatedEmail())
        ->from($_ENV['MAILER_FROM'])
        ->to($data['email'])
        ->subject($title)

        ->htmlTemplate('emails/forgotPassword.html.twig')

        ->context([
            'expiration_date' => ('24h'),
            'user' => $user,
            'token' => $userToken,
            'hello' => $hello, 
            'recoveryMessage' => $recoveryMessage,
            'clicMessage' => $clicMessage,
            'resetButton' => $resetButton,
            'copyableLin'=> $copyableLink,
            'expirationMessage' => $expirationMessage,
            'terms' => $terms,
            'termsLink' => $termsLink,
            'legal' => $legal,
            'legalLink' => $legalLink,
            'contact' => $contact,
            'contactLink' => $contactLink
        ]);

        $mailer->send($email);
    }

    /**
     * Récupère les données user pour les envoyer dans un mail de contact à l'équipe commerciale
     *
     * @param array $data
     * @param MailerInterface $mailer
     * @return void
     */
    public function sendMailTL(array $data, MailerInterface $mailer)
    {
        $user = $this->userRepository->findOneBy(['id' => $data['id']]);

        $cancel = false;

        $email = (new TemplatedEmail())
        ->from($_ENV['MAILER_FROM'])
        ->to($user->getEmail())
        ->subject("Open Crea - Changement d'offre")
        ->htmlTemplate('emails/contact.html.twig')
        ->context(
            [
            'user' => $user,
        ]);

        $mailer->send($email);
    }

    /**
     * Envoi d'une demande de résiliation à l'équipe commerciale
     *
     * @param array $data
     * @param MailerInterface $mailer
     * @return void
     */
    public function sendCancelRequestToTL(array $data, MailerInterface $mailer)
    {
        $user = $this->userRepository->findOneBy(['id' => $data['id']]);

        $cancel = true;

        $email = (new TemplatedEmail())
        ->from($_ENV['MAILER_FROM'])
        ->to($user->getEmail())
        ->subject('Open Crea - Demande de résiliation')
        ->htmlTemplate('emails/contact.html.twig')
        ->context(
            [
            'user' => $user,
            'cancel' => $cancel
        ]);

        $mailer->send($email);
    }

    /**
     * Envoi du mail pour le partage d'un module 
     *
     * @param array $data
     * @param MailerInterface $mailer
     * @return void
     */
    public function sendShareMail(array $data, MailerInterface $mailer)
    {
        $to = explode(';', $data['to']);
        $currentLanguage = $this->security->getUser()->getLanguage()->getLanguageCode();

        $emailText = $data['emailText'];
        $title = $this->translator->trans('share.title', [], 'text', $currentLanguage);
        $terms = $this->translator->trans('terms', [], 'text', $currentLanguage);
        $termsLink = $this->translator->trans('terms.link', [], 'text', $currentLanguage);
        $legal = $this->translator->trans('legal', [], 'text', $currentLanguage);
        $legalLink = $this->translator->trans('legal.link', [], 'text', $currentLanguage);
        $contact = $this->translator->trans('contact', [], 'text', $currentLanguage);
        $contactLink = $this->translator->trans('contact.link', [], 'text', $currentLanguage);

        $email = (new TemplatedEmail())
        ->from($this->security->getUser()->getSociety()->getShareMail() === "" ? $_ENV['MAILER_FROM'] : $this->security->getUser()->getSociety()->getShareMail());

        foreach($to as $user)
        {
            $email->addTo($user);
        }
        $email->subject($title)

        ->htmlTemplate('emails/shareMail.html.twig')

        ->context([
            'emailText' => $emailText,
            'terms' => $terms,
            'termsLink' => $termsLink,
            'legal' => $legal,
            'legalLink' => $legalLink,
            'contact' => $contact,
            'contactLink' => $contactLink
        ]);


        $mailer->send($email);
    }

    /**
     * Envoi du mail pour la première connexion d'un auteur
     *
     * @param array $data
     * @return void
     */
    public function sendFirstConnectionMail(int $id)
    {
        $author = $this->userRepository->findOneBy(['id' => $id]);
        $token = \bin2hex(\random_bytes(20));
        $author->setToken($token);
        $author->setTokenGenerateAt(new \DateTime());
        $authorRole= $author->getRole();

        $currentLanguage = $this->security->getUser()->getLanguage()->getLanguageCode();

        $title1 = $this->translator->trans('connection.title1', [], 'text', $currentLanguage);
        $title2 = $this->translator->trans('connection.title2', [], 'text', $currentLanguage);
        $hello = $this->translator->trans('connection.hello', [], 'text', $currentLanguage);
        $connectionRegistration = $this->translator->trans('connection.registration', [], 'text', $currentLanguage);
        $connectionA = $this->translator->trans('connection.a', [], 'text', $currentLanguage);
        $connectionAn = $this->translator->trans('connection.an', [], 'text', $currentLanguage);
        $connectionID = $this->translator->trans('connection.id', [], 'text', $currentLanguage);
        $connectionMessage = $this->translator->trans('connection.message', [], 'text', $currentLanguage);
        $connectionButton = $this->translator->trans('connection.btn', [], 'text', $currentLanguage);
        $expirationMessage = $this->translator->trans('connection.expiration', [], 'text', $currentLanguage);
        $authorRoleTranslate = $this->translator->trans($authorRole, [], 'text', $currentLanguage);

        $terms = $this->translator->trans('terms', [], 'text', $currentLanguage);
        $termsLink = $this->translator->trans('terms.link', [], 'text', $currentLanguage);
        $legal = $this->translator->trans('legal', [], 'text', $currentLanguage);
        $legalLink = $this->translator->trans('legal.link', [], 'text', $currentLanguage);
        $contact = $this->translator->trans('contact', [], 'text', $currentLanguage);
        $contactLink = $this->translator->trans('contact.link', [], 'text', $currentLanguage);

        $this->entityManagerInterface->persist($author);
        $this->entityManagerInterface->flush();

        $role = $this->translator->trans($author->getRole(), [], 'text', $this->security->getUser()->getLanguage()->getLanguageCode());

        $email = (new TemplatedEmail())
            ->from($_ENV['MAILER_FROM'])
            ->addTo($author->getEmail())
            ->subject($author->getRole() == 'ROLE_USER' ? $title1 . $authorRoleTranslate : $title2 . $authorRoleTranslate)
            ->htmlTemplate('emails/firstConnectionMail.html.twig')

            ->context([
                'author' => $author,
                'role' => $authorRoleTranslate,
                'token' => $token,
                'expiration_date' => ('24h'),
                'hello' => $hello,
                'connectionRegistration' => $connectionRegistration,
                'connectionA' => $connectionA,
                'connectionAn' => $connectionAn,
                'connectionID' => $connectionID,
                'connectionMessage' => $connectionMessage,
                'connectionButton' => $connectionButton,
                'expirationMessage' => $expirationMessage,
                'terms' => $terms,
                'termsLink' => $termsLink,
                'legal' => $legal,
                'legalLink' => $legalLink,
                'contact' => $contact,
                'contactLink' => $contactLink,
            ]);

        $this->mailer->send($email);
    }
}
        