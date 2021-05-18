<?php

namespace App\Service;

use DateTime;
use App\Entity\User;
use App\Entity\Avatar;
use App\Repository\UserRepository;
use App\Repository\OfferRepository;
use App\Repository\AvatarRepository;
use App\Repository\SocietyRepository;
use App\Repository\LanguageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserService
{

    private $userRepository;
    private $passwordEncoder;
    private $avatarRepository;
    private $languageRepository;
    private $entityManagerInterface;
    private $societyRepository;
    private $offerRepository;
    private $security;

    public function __construct(UserRepository $userRepository, 
                                UserPasswordEncoderInterface $passwordEncoder,
                                AvatarRepository $avatarRepository,
                                LanguageRepository $languageRepository,
                                EntityManagerInterface $entityManagerInterface,
                                SocietyRepository $societyRepository,
                                OfferRepository $offerRepository,
                                Security $security)
    {
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
        $this->avatarRepository = $avatarRepository;
        $this->languageRepository = $languageRepository;
        $this->entityManagerInterface = $entityManagerInterface;
        $this->societyRepository = $societyRepository;
        $this->offerRepository = $offerRepository;
        $this->security = $security;
    }

    public function checkIfResetPossible(string $token) : string
    {
        $user = $this->userRepository->findOneBy(['token' => $token]);

        $now = new DateTime();
        // Ceci sera lors du portage pour qu'il n'y ai pas de limite vus que c'est a grand échelle et contre leurs gré
        if ($user->getTokenGenerateAt() === null)
        {
            return $user->getAvatar() === null ? 'valid/0/' . $user->getId(). '/' . $user->getUsername(). '/infinity' : 'valid/1/' . $user->getId() . '/' . $user->getUsername() . '/infinity';
        }
        $time1 = \strtotime($user->getTokenGenerateAt()->format('Y-m-d H:i:s'));
        $time2 = \strtotime($now->format('Y-m-d H:i:s'));

        if (abs($time2 - $time1)/(60*60) >= 24)
        {
            return $user->getAvatar() === null ? 'expired/0/' . $user->getId() : 'expired/1/' . $user->getId();
        }
        else
        {
            return $user->getAvatar() === null ? 'valid/0/' . $user->getId() : 'valid/1/' . $user->getId();
        }

        return 'error';
    }


    /**
     * Cette fonction permet de mettre le token à null et de changer le mot de passe
     *
     * @param string password Le mot de passe en claire qui à été saisie par l'utilisateur
     * @param string token Le token de l'utilisateur
     *
     * @return array|null
     */
    public function changePassword(array $information, string $token) : ?array
    {
        $user = $this->userRepository->findOneBy(['token' => $token]);
        if ($user->getUsername() === $information['username'])
        {
            $user->setToken(null);
            $user->setTokenGenerateAt(null);
            $user->setStatus("_USER_ACTIF");         
            $user->setConnectionToken(bin2hex(random_bytes(20)));
            $user->setPassword($this->passwordEncoder->encodePassword($user, $information['password']));

            $this->entityManagerInterface->persist($user);
            $this->entityManagerInterface->flush();
            return ['ssid' => $user->getConnectionToken()];
        }
        else
        {
            return null;
        }
    }


    /**
     * Cette fonction permet de mettre le token à null et de changer le mot de passe
     * @param string password Le mot de passe en claire qui à été saisie par l'utilisateur
     * @param string token Le token de l'utilisateur
     * @return bool
     */
    public function changePasswordUser(array $data) : bool
    {
        $user = $this->userRepository->findOneBy(['id' => $this->security->getUser()->getId()]);
        if ($this->passwordEncoder->isPasswordValid($user, $data['current_password']))
        {
            $user->setPassword($this->passwordEncoder->encodePassword($user, $data['password']));
    
            $this->entityManagerInterface->persist($user);
            $this->entityManagerInterface->flush();
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * Cette fonction permet de voir si le mot de passe est bon
     *
     * @param string $password le mot de passe en claire que l'utilisateur a taper
     * @param string $email l'adresse mail que l'utilisateur a tapper
     * @return mixed false si une erreur sinon retourne l'utilisateur avec un token de connection
     */
    public function loginCheck(string $password, string $email)
    {
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (empty($user))
            $user = $this->userRepository->findOneBy(['username' => $email]);

        if (empty($user))
            return false;


        if ($this->passwordEncoder->isPasswordValid($user, $password) && $user->getStatus() === "_USER_ACTIF")
        {
            return $user->getConnectionToken();
        }
        else
        {
            return false;
        }
    }

    /**
     * Permet de récuperer tous les avatar de l'utilisateur et par défaut
     *
     * @param integer $user_id
     * @return array les avatars
     */
    public function takeAllAvatars() : array
    {
        $avatars = array();

        $tmp_avatars = $this->avatarRepository->getAllAvatar($this->security->getUser()->getId());

        foreach ($tmp_avatars as $avatar)
        {
            $avatars[] = $avatar->toArray();
        }

        return $avatars;
    }

    /**
     * Change l'avatar du user
     *
     * @param integer $avatar l'id de l'avatar
     * @param integer $user_id l'id de l'utilisateur
     * @return array On retourne le user
     */
    public function changeAvatar(int $avatar) : array
    {
        $user = $this->userRepository->findOneBy(['id' => $this->security->getUser()->getId()]);
        $avatar = $this->avatarRepository->findOneBy(['id' => $avatar]);

        $user->setAvatar($avatar);

        $this->entityManagerInterface->persist($user);
        $this->entityManagerInterface->flush();
            
        return $user->toArray();
    }
    /**
     * Permet de faire move l'image dans le bon dossier
     *
     * @param File $file le fichier
     * @return array l'avatar
     */
    public function uploadAvatar(File $file) : array
    {
        $file->move($_ENV['ASSETS_PATH'] . 'img/avatar/' . $this->security->getUser()->getSociety()->getId() . '/' . $this->security->getUser()->getUuid(), $file->getClientOriginalName());

        $avatar = new Avatar();
        $avatar->setImagePath('/assets/img/avatar/' . $file->getClientOriginalName());
        $avatar->setPosition($this->avatarRepository->getCountAvatar($this->security->getUser()->getId())[1]);
        $avatar->setName($file->getClientOriginalName());

        $this->entityManagerInterface->persist($avatar);
        $this->entityManagerInterface->flush();
        return $avatar->toArray();
    }

    /**
     * Mettre le l'id du user dans avatar et l'avatar dans le user
     *
     * @param integer $user_id l'id du user
     * @param integer $avatar_id l'id du avatar
     * @return array Le user
     */
    public function changeAvatarUploaded(int $user_id, int $avatar_id) : array
    {
        $user = $this->userRepository->findOneBy(['id' => $user_id]);
        $avatar = $this->avatarRepository->findOneBy(['id' => $avatar_id]);

        $user->setAvatar($avatar);
        $avatar->setUser($user);

        $this->entityManagerInterface->persist($user);
        $this->entityManagerInterface->persist($avatar);
        $this->entityManagerInterface->flush();

        return $user->toArray();
    }

    /**
     * Fonction permettant de faire les modification de l'utilisateur
     *
     * @param array $data les information
     * @return array Le user
     */
    public function updateWithoutPassword(array $data) : array
    {
        $tmpUser = $this->userRepository->findOneBy(['id' => $data['id']]);
        $language = $this->languageRepository->findOneBy(['language' => $data['lang']]);
        
        $tmpUser->setLanguage($language);
        $tmpUser->setFirstName($data['firstname']);
        $tmpUser->setLastName($data['lastname']);

        $this->entityManagerInterface->persist($tmpUser);
        $this->entityManagerInterface->flush();

        return $tmpUser->toArray();
    }

    /**
     * Permet de récuperer en tableau avec tous les users
     *
     * @param array $data
     * @return array
     */
    public function getAllUserBySociety(array $data) : array
    {
        $society = $this->societyRepository->findOneBy(['id' => $this->security->getUser()->getSociety()->getId()]);

        $tmpUsers = $society->getUsers();

        $user = array();

        foreach ($tmpUsers as $tmpUser)
        {
            $user[] = $tmpUser->toArray();
        }

        return ['authors' => $user, 'number_account' => $society->getAccountNumber()];
    }

    /**
     * Permet de récuperer en tableau tout les users de l'appli
     *
     * @param array $data
     * @return array
     */
    public function getAllUser(array $data) : array
    {
        $users = $this->userRepository->getAllUser($data['searchWord'], $data['status'],$data['offer']);

        $data = [];
        foreach ($users as $user)
        {
            $data[] = $user->toArray();
        }
        return $data;
    }

	/**
	 * Permet de créer un utilisateur
	 *
	 * @param array
	 *
	 * @return array
	 * @throws \Exception
	 */
    public function createUser(array $data) : array
    {
        $user = new User();
        $user->setCivility($data['userCivility']);
        $user->setLastName($data['userLastName']);
        $user->setFirstName($data['userFirstName']);
        $user->setAddress($data['userAddress']);
        $user->setZip($data['userZip']);
        $user->setCity($data['userCity']);
        $user->setCountry($data['userCountry']);
        $user->setPhone($data['userPhone']);
        $user->setEmail($data['userMail']);
        $user->setUsername($data['userName'] !== null ? $data['userName'] : $data['userMail']);
        $user->setPassword($this->passwordEncoder->encodePassword($user, $data['password']));
        $user->setRegistration(new \DateTime());
        $user->setUuid(uuid_create(UUID_TYPE_RANDOM));
        $user->setSociety($this->societyRepository->findOneBy(['id' => $data['userSociety']]));
        $user->setFunc($data['userFunction']);
        $user->setOffer($this->offerRepository->findOneBy(['id' => $data['userOffer']]));
        $user->setLanguage($this->languageRepository->findOneBy(['language_code' => $data['userLang']]));
        $user->setStatus($data['userStatus']);
        $user->setRole($data['userRole']);
        $user->setConnectionToken(bin2hex(random_bytes(20)));

        $this->entityManagerInterface->persist($user);
        $this->entityManagerInterface->flush();

        return $user->toArray();
    }

	/**
	 * Permet de créer un auteur dans une société + envoi mail pour première identification
	 *
	 * @param array
	 *
	 * @return array|null
	 * @throws \Exception
	 */
    public function createAuthor(array $data) : ?array
    {
        if (count($this->security->getUser()->getSociety()->getUsers()) < $this->security->getUser()->getSociety()->getAccountNumber() || $this->security->getUser()->getSociety()->getAccountNumber() === -1)
        {
            $user = new User();
            $user->setCivility('');
            $user->setLastName($data['name']);
            $user->setFirstName($data['firstName']);
            $user->setAddress('');
            $user->setZip('');
            $user->setCity('');
            $user->setCountry('');
            $user->setPhone('');
            $user->setEmail($data['email']);
            $user->setUsername($data['email'] !== null ? $data['email'] : $data['email']);
            $user->setRegistration(new \DateTime());
            $user->setUuid(uuid_create(UUID_TYPE_RANDOM));
            $user->setSociety($this->societyRepository->findOneBy(['id' => $this->security->getUser()->getSociety()->getId()]));
            $user->setFunc('');
            $user->setOffer($this->security->getUser()->getOffer());
            $user->setLanguage($this->security->getUser()->getLanguage());
            $user->setStatus('_USER_INACTIVE');
            $user->setRole($data['role']);
            $user->setConnectionToken(bin2hex(random_bytes(20)));

            $this->entityManagerInterface->persist($user);
            $this->entityManagerInterface->flush();

            return $user->toArray();
        }
        return null;
    }

     /**
     * Récupère les infos d'un user par son id
     *
     * @param array $data
     * @return array
     */
    public function getUserData(array $data) : array
    {
        $user = $this->userRepository->findOneBy(['id' => $data['id']]);

        return $user->toArray($data['security']);
    }

    /**
     * Supprime un utilisateur
     *
     * @param array $data
     * @return array
     */
    public function deleteUser(array $data): array
    {
        $user = $this->userRepository->findOneBy(['id' => $data['id']]);
        $this->entityManagerInterface->remove($user);
        $this->entityManagerInterface->flush();

        return $user->toArray();
    }

	/**
	 * @param array $data
	 */
    public function edit(array $data) : void
    {
        $user = $this->userRepository->findOneBy(['id' => $data['id']]);
        $user->setCivility($data['userCivility']);
        $user->setLastName($data['userLastName']);
        $user->setFirstName($data['userFirstName']);
        $user->setAddress($data['userAddress']);
        $user->setZip($data['userZip']);
        $user->setCity($data['userCity']);
        $user->setCountry($data['userCountry']);
        $user->setPhone($data['userPhone']);
        $user->setEmail($data['userMail']);
        $user->setUsername($data['userName'] !== null ? $data['userName'] : $data['userMail']);
        $data['password'] !== '' ? $user->setPassword($this->passwordEncoder->encodePassword($user, $data['password'])) : null;
        $user->setSociety($this->societyRepository->findOneBy(['id' => $data['userSociety']]));
        $user->setFunc($data['userFunction']);
        $user->setOffer($this->offerRepository->findOneBy(['id' => $data['userOffer']]));
        $user->setLanguage($this->languageRepository->findOneBy(['language_code' => $data['userLang']]));
        $user->setStatus($data['userStatus']);
        $user->setRole($data['userRole']);

        $this->entityManagerInterface->persist($user);
        $this->entityManagerInterface->flush();
    }

	/**
	 * @param array $data
	 */
    public function editRole(array $data) : void
    {
        $user = $this->userRepository->findOneBy(['id' => $data['id']]);

        $user->setRole($data['role']);
        $user->setStatus($data['status']);

        $this->entityManagerInterface->persist($user);
        $this->entityManagerInterface->flush();
    }

    /**
     * Permet de récuperer toute les informations du user connecter
     *
     * @return array
     */
    public function getInformation() : array
    {
        return $this->security->getUser()->toArray();
    }

    public function isLogipro(array $data) : bool
    {
    	$user = $this->userRepository->findOneBy(['connection_token' => base64_decode($data['user'])]);

    	return $user->getRole() === "ROLE_LOGIPRO";
    }
}