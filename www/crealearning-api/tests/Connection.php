<?php

namespace App\Tests;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;



trait Connection
{
    
    private $client;
    private $apiKey;


    private function logIn(User $user, string $firewallName, KernelBrowser $client = null): void
    {
        $client = $this->getMyClient($client);

        $container = $client->getContainer();
        $session = $container->get('session');

        $token = new UsernamePasswordToken($user, null, $firewallName, $user->getRoles());

        $session->set('_security_' . $firewallName, serialize($token));

        $session->save();

        $cookie = new Cookie($session->getName(), $session->getId());
        $client->getCookieJar()->set($cookie);
    }

    /**
     * retourne le client
     * soit le client en paramètre, soit celui dans $this->client
     *
     * @param KernelBrowser $client
     * @return void
     */
    private function getMyClient(KernelBrowser $client = null)
    {
        if (!is_null($client)) {
            return $client;
        }
        return $this->client;
    }

    public function getContainer(KernelBrowser $client = null): ContainerInterface
    {
        return $this->getMyClient($client)->getContainer();
    }

    /**
     * retourne le manager
     *
     * @param KernelBrowser $client
     * @return EntityManager
     */
    public function getManager(KernelBrowser $client = null): EntityManager
    {
        return $this->getContainer($client)->get('doctrine')->getManager();
    }

    /**
     * retourne le kernel
     *
     * @param KernelBrowser $client
     * @return Kernel
     */
    public function getKernel(KernelBrowser $client = null): Kernel
    {
        return $this->getContainer($client)->get('kernel');
    }

    /**
     * retourne le repository de l'entité
     *
     * @param string $entity
     * @param KernelBrowser $client
     * @return EntityRepository
     */
    public function getRepository(string $entity, KernelBrowser $client = null)
    {
        $manager = $this->getManager($client);
        $repository = $manager->getRepository($entity);
        return $repository;
    }

    /**
     * identifie l'utilisateur administrateur sur le client
     *
     * @param KernelBrowser $clientFactory
     * @return void
     */
    private function createAuthorizedClient(KernelBrowser $clientFactory = null): void
    {
        $repository = $this->getRepository(User::class, $clientFactory);
        $user = $repository->findOneBy(array('username' => 'admin'));

        $this->apiKey = $user->getConnectionToken();


        $this->logIn($user, 'back_office', $clientFactory);
    }
}
