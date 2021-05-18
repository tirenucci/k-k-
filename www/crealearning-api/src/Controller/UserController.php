<?php

namespace App\Controller;

use App\Service\UserService;

use App\Service\MailerService;
use App\Service\UserStatService;
use App\Controller\LibController;
use App\Repository\AvatarRepository;
use PHPUnit\Util\Json;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserController extends LibController
{

	/**
	 * @Route("/user/connection/{token}", methods={"GET"})
	 *
	 * @param string      $token
	 * @param UserService $userService
	 *
	 * @return JsonResponse 200 si le token existe sinon 404 avec un message
	 */
	public function resetPassword(string $token, UserService $userService): JsonResponse
	{
		$user = $userService->checkIfResetPossible($token);

		if ($user === 'error') {
			return $this->setReturn(self::NOT_FOUND);
		} else {
			$send = explode('/', $user);
			return $this->setReturn(self::OK, ['status' => $send[0], 'avatar' => $send[1], 'id' => $send[2], 'username' => $send[3], 'infinity' => $send[4]]);
		}
	}


	/**
	 * @Route("/user/connection/{token}", methods={"POST"})
	 *
	 * @param UserService $userService
	 * @param string      $token
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function changePassword(UserService $userService, string $token, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		if (empty($data['information']) || empty($token))
			throw new NotFoundHttpException('Le mot de passse ou le token est vide');
		else
			$user = $userService->changePassword($data['information'], $token);

		if ($user !== null)
			return $this->setReturn(self::OK, $user);
		else
			return $this->setReturn(self::NOT_FOUND);
	}


	/**
	 * @Route("/user/change_password", methods={"PUT"})
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function changePasswordUser(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		if ($userService->changePasswordUser($data)) {
			return $this->setReturn(self::OK);
		} else {
			return $this->setReturn(self::NOT_FOUND);
		}

	}

	/**
	 * @Route("/user/connection", methods={"POST"})
	 *
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function login(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		if (empty($data['password']) || empty($data['email']))
			throw new NotFoundHttpException('Le mot de passe ou email est vide');

		$user = $userService->loginCheck($data['password'], $data['email']);

		if ($user === false) {
			return $this->setReturn(self::NOT_FOUND);
		}

		return $this->setReturn(self::OK, ['connection_token' => $user]);
	}


	/**
	 * @Route("/user/take_all_avatars", methods={"GET"})
	 *
	 * @param UserService $service le service de l'utilisateur pour voir si sont token est bon
	 * @param Request     $request
	 *
	 * @return JsonResponse SI le token est pas bon 404 si il est bon 200 avec les avatar
	 */
	public function takeAllAvatar(UserService $service, Request $request): JsonResponse
	{
		$avatar = $service->takeAllAvatars();

		return $this->setReturn(self::OK, $avatar);
	}

	/**
	 * @Route("/user/profile/change_avatar", methods={"PUT"})
	 *
	 * @param UserService $service
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function changeAvatar(UserService $service, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		if (empty($data['avatar_id']) && empty($data['user_id']))
			throw new NotFoundHttpException('Le user ou l\'avatar est vide');

		$data = $service->changeAvatar($data['avatar_id']);

		return $this->setReturn(self::OK, $data);
	}

	/**
	 * @Route("/user/profile/upload_avatar", methods={"POST"})
	 *
	 * @param UserService $service
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function uploadNewAvatar(UserService $service, Request $request): JsonResponse
	{
		$image = $this->getFiles($request, 'image');

		$newAvatar = $service->uploadAvatar($image);

		return $this->setReturn(self::OK, $newAvatar);
	}

	/**
	 * @Route("/user/profile/upload_new_avatar_post", methods={"POST"})
	 *
	 * @param UserService $service
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function uploadNewAvatarPost(UserService $service, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		$user = $service->changeAvatarUploaded($data['id_user'], $data['id_image']);

		return $this->setReturn(self::OK, $user);
	}


	/**
	 * @Route("/user/update", methods={"PUT"})
	 *
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function update(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		$user = $userService->updateWithoutPassword($data);

		return $this->setReturn(self::OK, $user);
	}

	/**
	 * @Route("/user/get_all", methods={"GET"})
	 *
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function getAllUserBySociety(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getAllGet($request);

		$users = $userService->getAllUserBySociety($data);

		return $this->setReturn(self::OK, $users);
	}

	/**
	 * @Route("/user/stat_module", methods={"GET"})
	 *
	 * @param UserStatService $userStatService
	 * @param Request         $request
	 *
	 * @return JsonResponse
	 */
	public function getStatModule(UserStatService $userStatService, Request $request): JsonResponse
	{
		$data = $this->getAllGet($request);

		$stat = $userStatService->getStatModule($data);

		return $this->setReturn(self::OK, $stat);
	}

	/**
	 * @Route("/user/all_user", methods={"GET"})
	 *
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function getAllUser(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getAllGet($request);
		$users = $userService->getAllUser($data);

		return $this->setReturn(self::OK, $users);
	}

	/**
	 * @Route("/user/create", methods={"POST"})
	 *
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function createUser(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		$user = $userService->createUser($data);

		return $this->setReturn(self::CREATED, $user);
	}

	/**
	 * @Route("/author/create", methods={"POST"})
	 *
	 * @param UserService   $userService
	 * @param MailerService $mailerService
	 * @param Request       $request
	 *
	 * @return JsonResponse
	 */
	public function createAuthorBySociety(UserService $userService, MailerService $mailerService, Request $request): JsonResponse
	{
		$data = $this->getBody($request);
		if (empty($data['firstName']) && empty($data['email']) && empty($data['role'])) {
			throw new NotFoundHttpException('Informations manquantes');
		}

		$user = $userService->createAuthor($data);
		if ($user !== null) {
			$mailerService->sendFirstConnectionMail($user['id']);
			return $this->setReturn(self::CREATED, $user);
		}

		return $this->setReturn(self::CONFLICT);
	}

	/**
	 * @Route("/user/resendmail", methods={"POST"})
	 *
	 * @param MailerService $mailerService
	 * @param Request       $request
	 *
	 * @return JsonResponse
	 */
	public function resendMail(MailerService $mailerService, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		$mailerService->sendFirstConnectionMail($data['id']);

		return $this->setReturn(self::OK);
	}

	/**
	 * @Route("/user/get_data", methods={"GET"})
	 *
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function getUserData(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getAllGet($request);

		$user = $userService->getUserData($data);

		return $this->setReturn(self::OK, $user);
	}

	/**
	 * @Route("/user/delete", methods={"DELETE"})
	 *
	 * @param Request     $request
	 * @param UserService $userService
	 *
	 * @return JsonResponse
	 */
	public function deleteUser(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		if ($userService->deleteUser($data)) {
			return $this->setReturn(self::OK);
		}
		return $this->setReturn(self::NOT_FOUND);
	}

	/**
	 * @Route("/user/edit", methods={"PUT"})
	 *
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function edit(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		$userService->edit($data);

		return $this->setReturn(self::OK);
	}

	/**
	 * @Route("/user/edit_user", methods={"PUT"})
	 *
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function editUser(UserService $userService, Request $request): JsonResponse
	{
		$data = $this->getBody($request);

		$userService->editRole($data);

		return $this->setReturn(self::OK);
	}


	/**
	 * @Route("/user/get_information", methods={"GET"})
	 *
	 * @param UserService $userService
	 * @param Request     $request
	 *
	 * @return JsonResponse
	 */
	public function getInformation(UserService $userService, Request $request): JsonResponse
	{
		$user = $userService->getInformation();

		return $this->setReturn(self::OK, $user);
	}

	/**
	 * @Route("/user/is_logipro")
	 * @param Request     $request
	 * @param UserService $userService
	 *
	 * @return JsonResponse
	 */
	public function isLogipro(Request $request, UserService $userService) : JsonResponse
	{
		$data = $this->getAllGet($request);

		if ($userService->isLogipro($data))
		{
			return $this->setReturn(self::OK, ['is_logipro' => true]);
		}
		else
		{
			return $this->setReturn(self::NOT_FOUND);
		}
	}
}