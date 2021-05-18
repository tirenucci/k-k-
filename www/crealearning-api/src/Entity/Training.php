<?php

namespace App\Entity;

use App\Entity\Tag;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TrainingRepository")
 * @ORM\Table(name="cle_training")
 */
class Training
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=250)
     */
    private $name;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\Column(type="string", length=3)
     */
    private $language_code;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $version;

    /**
     * @ORM\Column(type="string", length=36)
     */
    private $uuid;

    /**
     * @ORM\Column(type="string", length=15)
     */
    private $license = "_CC";

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    private $description = "";

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    private $objective = "";

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    private $educ_means = "";

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    private $tech_means = "";

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    private $management = "";

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    private $achievements = "";

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    private $public_target = "";

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    private $prerequisite = "";

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $status = "_UNDERCONSTRUCTION";

    /**
     * @ORM\Column(type="integer")
     */
    private $duration = 0;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $content_validation = "_INVALID";

    /**
     * @ORM\Column(type="float")
     */
    private $disk_space;

    /**
     * @ORM\Column(type="boolean")
     */
    private $show_ponderation;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $logo;

    /**
     * @ORM\Column(type="string", length=6)
     */
    private $logo_position;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Skin", inversedBy="trainings")
     */
    private $skin;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Society", inversedBy="trainings")
     */
    private $society;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Grain", mappedBy="training", cascade={"remove"})
     * @ORM\JoinColumn(name="training_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $grains;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\TrainingLang", inversedBy="trainings")
     * @ORM\JoinTable(name="cle_map_training_language")
     */
    private $language;

    /**
     * @ORM\Column(type="text")
     */
    private $tags;

    //Relation vers la table de mappage TrainingAuthor
    /**
     * @ORM\OneToMany(targetEntity="App\Entity\TrainingAuthor", mappedBy="training", cascade={"remove"})
     * @ORM\JoinColumn(name="training_author", referencedColumnName="training_id", onDelete="CASCADE")
     */
    private $author;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $eval_method;


    public function __construct()
    {
        $this->grains = new ArrayCollection();
        $this->language = new ArrayCollection();
        $this->tag = new ArrayCollection();
        $this->author = new ArrayCollection();//Collection des auteurs
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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeInterface $updated_at): self
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function getLanguageCode(): ?string
    {
        return $this->language_code;
    }

    public function setLanguageCode(string $language_code): self
    {
        $this->language_code = $language_code;

        return $this;
    }

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(string $version): self
    {
        $this->version = $version;

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

    public function getLicense(): ?string
    {
        return $this->license;
    }

    public function setLicense(string $license): self
    {
        $this->license = $license;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getObjective(): ?string
    {
        return $this->objective;
    }

    public function setObjective(string $objective): self
    {
        $this->objective = $objective;

        return $this;
    }

    public function getEducMeans(): ?string
    {
        return $this->educ_means;
    }

    public function setEducMeans(string $educ_means): self
    {
        $this->educ_means = $educ_means;

        return $this;
    }

    public function getTechMeans(): ?string
    {
        return $this->tech_means;
    }

    public function setTechMeans(string $tech_means): self
    {
        $this->tech_means = $tech_means;

        return $this;
    }

    public function getManagement(): ?string
    {
        return $this->management;
    }

    public function setManagement(string $management): self
    {
        $this->management = $management;

        return $this;
    }

    public function getAchievements(): ?string
    {
        return $this->achievements;
    }

    public function setAchievements(string $achievements): self
    {
        $this->achievements = $achievements;

        return $this;
    }

    public function getPublicTarget(): ?string
    {
        return $this->public_target;
    }

    public function setPublicTarget(string $public_target): self
    {
        $this->public_target = $public_target;

        return $this;
    }

    public function getPrerequisite(): ?string
    {
        return $this->prerequisite;
    }

    public function setPrerequisite(string $prerequisite): self
    {
        $this->prerequisite = $prerequisite;

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

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    public function getContentValidation(): ?string
    {
        return $this->content_validation;
    }

    public function setContentValidation(string $content_validation): self
    {
        $this->content_validation = $content_validation;

        return $this;
    }

    public function getDiskSpace(): ?float
    {
        return $this->disk_space;
    }

    public function setDiskSpace(float $disk_space): self
    {
        $this->disk_space = $disk_space;

        return $this;
    }

    public function getShowPonderation(): ?bool
    {
        return $this->show_ponderation;
    }

    public function setShowPonderation(bool $show_ponderation): self
    {
        $this->show_ponderation = $show_ponderation;

        return $this;
    }

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(string $logo): self
    {
        $this->logo = $logo;

        return $this;
    }

    public function getSkin(): ?skin
    {
        return $this->skin;
    }

    public function setSkin(?skin $skin): self
    {
        $this->skin = $skin;

        return $this;
    }

    public function getSociety(): ?society
    {
        return $this->society;
    }

    public function setSociety(?society $society): self
    {
        $this->society = $society;

        return $this;
    }

    public function getLogoPosition(): ?string
    {
        return $this->logo_position;
    }

    public function setLogoPosition(string $logo_position): self
    {
        $this->logo_position = $logo_position;

        return $this;
    }

    /**
     * @return Collection|Author[]
     */
    public function getAuthor(): Collection
    {
        return $this->author;
    }

    /**
     * @return Collection|Grain[]
     */
    public function getGrains(): Collection
    {
        return $this->grains;
    }

    public function addGrain(Grain $grain): self
    {
        if (!$this->grains->contains($grain)) {
            $this->grains[] = $grain;
            $grain->setTraining($this);
        }

        return $this;
    }

    public function removeGrain(Grain $grain): self
    {
        if ($this->grains->contains($grain)) {
            $this->grains->removeElement($grain);
            // set the owning side to null (unless already changed)
            if ($grain->getTraining() === $this) {
                $grain->setTraining(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|TrainingLang[]
     */
    public function getLanguage(): Collection
    {
        return $this->language;
    }

    public function addLanguage(TrainingLang $language): self
    {
        if (!$this->language->contains($language)) {
            $this->language[] = $language;
        }

        return $this;
    }

    public function removeLanguage(TrainingLang $language): self
    {
        if ($this->language->contains($language)) {
            $this->language->removeElement($language);
        }

        return $this;
    }

    /**
     * @return string
     */
    public function getTag(): string
    {
        return $this->tags;
    }

    public function setTag(string $tag): self
    {
        $this->tags = $tag;

        return $this;
    }

    public function getEvalMethod(): ?string
    {
        return $this->eval_method;
    }

    public function setEvalMethod(string $eval_method): self
    {
        $this->eval_method = $eval_method;

        return $this;
    }
}
