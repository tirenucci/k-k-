<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SocietyRepository")
 * @ORM\Table(name="cle_society")
 */
class Society
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=200)
     */
    private $name;

    /**
     * @ORM\Column(type="float")
     */
    private $quota;

    /**
     * @ORM\Column(type="float", length=20)
     */
    private $disk_space;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Training", mappedBy="society")
     */
    private $trainings;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="society", cascade={"remove"})
     * @ORM\JoinColumn(name="society_id", referencedColumnName="id", onDelete="CASCADE")
     */

    private $users;

    /**
     * @ORM\Column(type="boolean")
     */
    private $opencrea;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $share_mail;

    /**
     * @ORM\Column(type="boolean")
     */
    private $monograin_scorm;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $agora_smart;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $logo_name;

    /**
     * @ORM\Column(type="integer")
     */
    private $skin_default;

    /**
     * @ORM\OneToMany(targetEntity=Skin::class, mappedBy="society")
     */
    private $skins;

    /**
     * @ORM\OneToMany(targetEntity=SkinTheme::class, mappedBy="society")
     */
    private $skinThemes;

    /**
     * @ORM\Column(type="integer")
     */
    private $account_number = -1;

    public function __construct()
    {
        $this->trainings = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->skins = new ArrayCollection();
        $this->skinThemes = new ArrayCollection();
        $this->activatedLanguages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getQuota(): ?float
    {
        return $this->quota;
    }

    public function setQuota(float $quota): self
    {
        $this->quota = $quota;

        return $this;
    }

    public function getDiskSpace(): ?int
    {
        return $this->disk_space;
    }

    public function setDiskSpace(int $disk_space): self
    {
        $this->disk_space = $disk_space;

        return $this;
    }

    /**
     * @return Collection|Training[]
     */
    public function getTrainings(): Collection
    {
        return $this->trainings;
    }

    public function addTraining(Training $training): self
    {
        if (!$this->trainings->contains($training)) {
            $this->trainings[] = $training;
            $training->setSociety($this);
        }

        return $this;
    }

    public function removeTraining(Training $training): self
    {
        if ($this->trainings->contains($training)) {
            $this->trainings->removeElement($training);
            // set the owning side to null (unless already changed)
            if ($training->getSociety() === $this) {
                $training->setSociety(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setSociety($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getSociety() === $this) {
                $user->setSociety(null);
            }
        }

        return $this;
    }

    public function getOpencrea(): ?bool
    {
        return $this->opencrea;
    }

    public function setOpencrea(bool $opencrea): self
    {
        $this->opencrea = $opencrea;

        return $this;
    }

    public function getShareMail(): ?string
    {
        return $this->share_mail;
    }

    public function setShareMail(string $share_mail): self
    {
        $this->share_mail = $share_mail;

        return $this;
    }

    public function getMonograinScorm(): ?bool
    {
        return $this->monograin_scorm;
    }

    public function setMonograinScorm(bool $monograin_scorm): self
    {
        $this->monograin_scorm = $monograin_scorm;

        return $this;
    }

    public function getAgoraSmart(): ?string
    {
        return $this->agora_smart;
    }

    public function setAgoraSmart(?string $agora_smart): self
    {
        $this->agora_smart = $agora_smart;

        return $this;
    }

    public function getLogoName(): ?string
    {
        return $this->logo_name;
    }

    public function setLogoName(?string $logo_name): self
    {
        $this->logo_name = $logo_name;

        return $this;
    }

    public function toArray() : array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'quota' => $this->quota,
            'disk_space' => $this->disk_space,
            'logo_name' => $this->logo_name,
            'agora_smart' => $this->agora_smart,
            'monograin_scorm' => $this->monograin_scorm,
            'share_mail' => $this->share_mail,
            'open_crea' => $this->opencrea,
            'skin_default' => $this->skin_default
        ];
    }

    public function getSkinDefault(): ?int
    {
        return $this->skin_default;
    }

    public function setSkinDefault(int $skin_default): self
    {
        $this->skin_default = $skin_default;

        return $this;
    }

    /**
     * @return Collection|Skin[]
     */
    public function getSkins(): Collection
    {
        return $this->skins;
    }

    public function addSkin(Skin $skin): self
    {
        if (!$this->skins->contains($skin)) {
            $this->skins[] = $skin;
            $skin->setSociety($this);
        }

        return $this;
    }

    public function removeSkin(Skin $skin): self
    {
        if ($this->skins->contains($skin)) {
            $this->skins->removeElement($skin);
            // set the owning side to null (unless already changed)
            if ($skin->getSociety() === $this) {
                $skin->setSociety(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|SkinTheme[]
     */
    public function getSkinThemes(): Collection
    {
        return $this->skinThemes;
    }

    public function addSkinTheme(SkinTheme $skinTheme): self
    {
        if (!$this->skinThemes->contains($skinTheme)) {
            $this->skinThemes[] = $skinTheme;
            $skinTheme->setSociety($this);
        }

        return $this;
    }

    public function removeSkinTheme(SkinTheme $skinTheme): self
    {
        if ($this->skinThemes->contains($skinTheme)) {
            $this->skinThemes->removeElement($skinTheme);
            // set the owning side to null (unless already changed)
            if ($skinTheme->getSociety() === $this) {
                $skinTheme->setSociety(null);
            }
        }

        return $this;
    }

    public function getAccountNumber(): ?int
    {
        return $this->account_number;
    }

    public function setAccountNumber(int $account_number): self
    {
        $this->account_number = $account_number;

        return $this;
    }
 }
