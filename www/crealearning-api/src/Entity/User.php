<?php

namespace App\Entity;

use App\Entity\Society;
use App\Entity\Language;
use App\Entity\Type\EnumRoleType;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="cle_user",indexes={@ORM\Index(name="username", columns={"username"})})
 */
class User implements UserInterface
{
	/**
	 * @ORM\Id()
	 * @ORM\GeneratedValue()
	 * @ORM\Column(type="integer")
	 */
	private $id;

	/**
	 * @ORM\Column(type="string", length=180)
	 */
	private $email;

	/**
	 * @ORM\Column(type="string", nullable=false)
	 */
	private $role = EnumRoleType::ROLE_AUTHOR;

	/**
	 * @var string The hashed password
	 * @ORM\Column(type="string", nullable=true)
	 */
	private $password;

	/**
	 * @ORM\Column(type="string", length=255, unique=true, nullable=false)
	 */
	private $username;

	/**
	 * @ORM\Column(type="date")
	 */
	private $registration;

	/**
	 * @ORM\Column(type="string", length=36)
	 */
	private $uuid;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $token;

	/**
	 * @ORM\Column(type="string", length=255)
	 */
	private $first_name;

	/**
	 * @ORM\Column(type="string", length=255)
	 */
	private $last_name;

	/**
	 * @ORM\Column(type="string", length=25)
	 */
	private $civility;

	/**
	 * @ORM\Column(type="date", nullable=true)
	 */
	private $birthday;

	/**
	 * @ORM\Column(type="string", length=200, nullable=true)
	 */
	private $address;

	/**
	 * @ORM\Column(type="string", length=10, nullable=true)
	 */
	private $zip;

	/**
	 * @ORM\Column(type="string", length=100, nullable=true)
	 */
	private $city;

	/**
	 * @ORM\Column(type="string", length=30, nullable=true)
	 */
	private $country;

	/**
	 * @ORM\Column(type="string", length=30, nullable=true)
	 */
	private $cell_phone;

	/**
	 * @ORM\Column(type="string", length=30, nullable=true)
	 */
	private $phone;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $func;

	/**
	 * @ORM\Column(type="string", length=60, nullable=true)
	 */
	private $website;

	/**
	 * @ORM\Column(type="text", nullable=true)
	 */
	private $personal_config;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\NoteGrain", mappedBy="user", cascade={"remove"})
	 * @ORM\JoinColumn(name="note_grain", referencedColumnName="id", onDelete="CASCADE")
	 */
	private $noteGrains;

	/**
	 * @ORM\ManyToOne(targetEntity="App\Entity\Society", inversedBy="users")
	 */
	private $society;

	/**
	 * @ORM\ManyToOne(targetEntity="App\Entity\Language", inversedBy="users")
	 */
	private $language;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\CustomerBilling", mappedBy="user")
	 */
	private $customerBillings;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true, unique=true)
	 */
	private $connection_token;

	/**
	 * @ORM\ManyToOne(targetEntity="App\Entity\Offer", inversedBy="users")
	 */
	private $offer;

	/**
	 * @ORM\ManyToOne(targetEntity="App\Entity\Avatar", inversedBy="users")
	 * @ORM\joinColumn(onDelete="SET NULL")
	 */
	private $avatar;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\Avatar", mappedBy="user")
	 */
	private $avatars;

	/**
	 * @ORM\Column(type="string", length=30)
	 */
	private $status;

	/**
	 * @ORM\Column(type="datetime", nullable=true)
	 */
	private $token_generate_at;

	public function __construct()
	{
		$this->noteGrains = new ArrayCollection();
		$this->customerBillings = new ArrayCollection();
		$this->avatars = new ArrayCollection();
	}

	public function getId(): ?int
	{
		return $this->id;
	}

	public function getEmail(): ?string
	{
		return $this->email;
	}

	public function setEmail(string $email): self
	{
		$this->email = $email;

		return $this;
	}

	/**
	 * A visual identifier that represents this user.
	 *
	 * @see UserInterface
	 */
	public function getUsername(): string
	{
		return $this->username;
	}

	/**
	 * @see UserInterface
	 */
	public function getRoles(): array
	{
		$roles[] = $this->role;

		return array_unique($roles);
	}

	public function getRole(): string
	{
		$role = $this->role;

		return $role;
	}

	public function setRole(string $role): self
	{
		$this->role = $role;

		return $this;
	}

	/**
	 * @see UserInterface
	 */
	public function getPassword(): string
	{
		return (string)$this->password;
	}

	public function setPassword(string $password): self
	{
		$this->password = $password;

		return $this;
	}

	/**
	 * @see UserInterface
	 */
	public function getSalt()
	{
		// not needed when using the "bcrypt" algorithm in security.yaml
	}

	/**
	 * @see UserInterface
	 */
	public function eraseCredentials()
	{
		// If you store any temporary, sensitive data on the user, clear it here
		// $this->plainPassword = null;
	}

	public function setUsername(string $username): self
	{
		$this->username = $username;

		return $this;
	}

	public function getRegistration(): ?\DateTimeInterface
	{
		return $this->registration;
	}

	public function setRegistration(\DateTimeInterface $registration): self
	{
		$this->registration = $registration;

		return $this;
	}

	public function getUuid(): ?string
	{
		return $this->uuid;
	}

	public function setUuid(string $uuid): self
	{
		$this->uuid = $uuid;

		return $this;
	}

	public function getToken(): ?string
	{
		return $this->token;
	}

	public function setToken(?string $token): self
	{
		$this->token = $token;

		return $this;
	}

	public function getFirstName(): ?string
	{
		return $this->first_name;
	}

	public function setFirstName(string $first_name): self
	{
		$this->first_name = $first_name;

		return $this;
	}

	public function getLastName(): ?string
	{
		return $this->last_name;
	}

	public function setLastName(string $last_name): self
	{
		$this->last_name = $last_name;

		return $this;
	}

	public function getCivility(): ?string
	{
		return $this->civility;
	}

	public function setCivility(string $civility): self
	{
		$this->civility = $civility;

		return $this;
	}

	public function getBirthday(): ?\DateTimeInterface
	{
		return $this->birthday;
	}

	public function setBirthday(?\DateTimeInterface $birthday): self
	{
		$this->birthday = $birthday;

		return $this;
	}

	public function getAddress(): ?string
	{
		return $this->address;
	}

	public function setAddress(?string $address): self
	{
		$this->address = $address;

		return $this;
	}

	public function getZip(): ?string
	{
		return $this->zip;
	}

	public function setZip(?string $zip): self
	{
		$this->zip = $zip;

		return $this;
	}

	public function getCity(): ?string
	{
		return $this->city;
	}

	public function setCity(?string $city): self
	{
		$this->city = $city;

		return $this;
	}

	public function getCountry(): ?string
	{
		return $this->country;
	}

	public function setCountry(?string $country): self
	{
		$this->country = $country;

		return $this;
	}

	public function getCellPhone(): ?string
	{
		return $this->cell_phone;
	}

	public function setCellPhone(?string $cell_phone): self
	{
		$this->cell_phone = $cell_phone;

		return $this;
	}

	public function getPhone(): ?string
	{
		return $this->phone;
	}

	public function setPhone(?string $phone): self
	{
		$this->phone = $phone;

		return $this;
	}

	public function getFunc(): ?string
	{
		return $this->func;
	}

	public function setFunc(?string $func): self
	{
		$this->func = $func;

		return $this;
	}

	public function getWebsite(): ?string
	{
		return $this->website;
	}

	public function setWebsite(?string $website): self
	{
		$this->website = $website;

		return $this;
	}

	public function getStatus(): ?string
	{
		return $this->status;
	}

	public function setStatus(string $status): self
	{
		$this->status = $status;

		return $this;
	}

	public function getPersonalConfig(): ?string
	{
		return $this->personal_config;
	}

	public function setPersonalConfig(?string $personal_config): self
	{
		$this->personal_config = $personal_config;

		return $this;
	}

	/**
	 * @return Collection|NoteGrain[]
	 */
	public function getNoteGrains(): Collection
	{
		return $this->noteGrains;
	}

	public function addNoteGrain(NoteGrain $noteGrain): self
	{
		if (!$this->noteGrains->contains($noteGrain)) {
			$this->noteGrains[] = $noteGrain;
			$noteGrain->setUser($this);
		}

		return $this;
	}

	public function removeNoteGrain(NoteGrain $noteGrain): self
	{
		if ($this->noteGrains->contains($noteGrain)) {
			$this->noteGrains->removeElement($noteGrain);
			// set the owning side to null (unless already changed)
			if ($noteGrain->getUser() === $this) {
				$noteGrain->setUser(null);
			}
		}

		return $this;
	}

	public function getSociety(): ?Society
	{
		return $this->society;
	}

	public function setSociety(?Society $society): self
	{
		$this->society = $society;

		return $this;
	}

	public function getLanguage(): ?Language
	{
		return $this->language;
	}

	public function setLanguage(?Language $language): self
	{
		$this->language = $language;

		return $this;
	}

	/**
	 * @return Collection|CustomerBilling[]
	 */
	public function getCustomerBillings(): Collection
	{
		return $this->customerBillings;
	}

	public function addCustomerBilling(CustomerBilling $customerBilling): self
	{
		if (!$this->customerBillings->contains($customerBilling)) {
			$this->customerBillings[] = $customerBilling;
			$customerBilling->setUser($this);
		}

		return $this;
	}

	public function removeCustomerBilling(CustomerBilling $customerBilling): self
	{
		if ($this->customerBillings->contains($customerBilling)) {
			$this->customerBillings->removeElement($customerBilling);
			// set the owning side to null (unless already changed)
			if ($customerBilling->getUser() === $this) {
				$customerBilling->setUser(null);
			}
		}

		return $this;
	}

	public function getConnectionToken(): ?string
	{
		return $this->connection_token;
	}

	public function setConnectionToken(?string $connection_token): self
	{
		$this->connection_token = $connection_token;

		return $this;
	}

	public function getOffer(): ?Offer
	{
		return $this->offer;
	}

	public function setOffer(?Offer $offer): self
	{
		$this->offer = $offer;

		return $this;
	}

	public function getAvatar(): ?Avatar
	{
		return $this->avatar;
	}

	public function setAvatar(?Avatar $avatar): self
	{
		$this->avatar = $avatar;

		return $this;
	}

	/**
	 * @return Collection|Avatar[]
	 */
	public function getAvatars(): Collection
	{
		return $this->avatars;
	}

	public function addAvatar(Avatar $avatar): self
	{
		if (!$this->avatars->contains($avatar)) {
			$this->avatars[] = $avatar;
			$avatar->setUser($this);
		}

		return $this;
	}

	public function removeAvatar(Avatar $avatar): self
	{
		if ($this->avatars->contains($avatar)) {
			$this->avatars->removeElement($avatar);
			// set the owning side to null (unless already changed)
			if ($avatar->getUser() === $this) {
				$avatar->setUser(null);
			}
		}

		return $this;
	}

	public function toArray(bool $security  = false): array
	{
	    $user = [
	        'id' => $this->id,
            'civility' => $this->civility,
            'email' => $this->email,
            'username' => $this->username !== null ? $this->username : $this->email,
            'firstname' => ucfirst($this->first_name),
            'lastname' => ucfirst($this->last_name),
            'address' => $this->address,
            'zip' => $this->zip === null ? '' : $this->zip,
            'city' => $this->city === null ? '' : $this->city,
            'country' => $this->country === null ? '' : $this->country,
            'phone' => $this->phone === null ? '' : $this->phone,
            'registration' => $this->registration->format('d/m/Y'),
            'society_id' => $this->society->getId(),
            'society_name' => $this->society->getName(),
            'function' => $this->func === null ? '' : $this->func,
            'role' => $this->role,
            'offer' => $this->offer->getName(),
            'offer_id' => $this->offer->getId(),
            'avatar' => $this->avatar !== null ? $this->avatar->toArray() : null,
            'lang' => $this->language->getLanguage(),
            'status' => $this->status,
            'token' => $this->token

        ];

	    if($security)
	    {
            $user['connection_token'] = $this->connection_token;
            return $user;
        }

	    else
        {
            return $user;
        }
	}

	public function getTokenGenerateAt(): ?\DateTimeInterface
	{
		return $this->token_generate_at;
	}

	public function setTokenGenerateAt(?\DateTimeInterface $token_generate_at): self
	{
		$this->token_generate_at = $token_generate_at;

		return $this;
	}
}
