<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class TokenAuthenticator extends AbstractGuardAuthenticator
{
    private $em;

    private $request;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Est appelais a chaque requete vois si l'authetification doit être appelais sinon return false
     *
     * @param Request $request
     * @return mixed
     */
    public function supports(Request $request)
    {
        return $request->headers->has('X-CREA-KEY');
    }

	/**
	 * Est appelais dans le getUser (credentials)
	 *
	 * @param Request $request
	 *
	 * @return array
	 */
    public function getCredentials(Request $request) : array
    {
		if (!empty($request->query->all()))
		{
			$get = implode('&', array_map(
				function ($v, $k) { return sprintf("%s=%s", $k, $v); },
				$request->query->all(),
				array_keys($request->query->all())
			));
			$realPath = $request->getPathInfo() . "?" . $get;
		}
		else
		{
			$realPath = $request->getPathInfo();
		}


        $allInformation = explode(':', $request->headers->get('X-CREA-KEY'));

        if ($allInformation[0] == hash_hmac('sha256', $realPath, $_ENV['HASH_KEY']))
        {
            return [
                'token' => $allInformation[1] == 'undefined' ? null : $allInformation[1],
            ];
        }

        return [
            'token' => -1
        ];
    }


    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $apiToken = $credentials['token'];

        if (null === $apiToken)
        {
            return;
        }
        return $this->em->getRepository(User::class)->findOneBy(['connection_token' => $apiToken]);
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        return true;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // Success on laisse la request continuer
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $data = [
            'message' => 'Votre compte n\'est pas valable, tenter un reconnexion.'
        ];

        return new JsonResponse($data, Response::HTTP_FORBIDDEN);
    }

    /**
     * Called when authentication is needed, but it's not sent
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return JsonResponse
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        $data = [
            // you might translate this message
            'message' => 'Une authentification est requise pour visualiser cette espace'
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    public function supportsRememberMe()
    {
        return false;
    }
}
