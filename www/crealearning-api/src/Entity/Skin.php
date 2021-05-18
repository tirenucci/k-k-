<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SkinRepository")
 * @ORM\Table(name="cle_skin")
 */
class Skin
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $author;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=36)
     */
    private $uuid;

    /**
     * @ORM\Column(type="string", length=5)
     */
    private $version;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $color_name;

    /**
     * @ORM\Column(type="string", length=7)
     */
    private $color_code;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $status;

    /**
     * @ORM\Column(type="integer")
     */
    private $position;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SkinTheme", inversedBy="skins")
     */
    private $skin_theme;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Training", mappedBy="skin")
     */
    private $trainings;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Society", inversedBy="skins")
     */
    private $society;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $folder_name;

    public function __construct()
    {
        $this->trainings = new ArrayCollection();
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

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

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

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(string $version): self
    {
        $this->version = $version;

        return $this;
    }

    public function getColorName(): ?string
    {
        return $this->color_name;
    }

    public function setColorName(string $color_name): self
    {
        $this->color_name = $color_name;

        return $this;
    }

    public function getColorCode(): ?string
    {
        return $this->color_code;
    }

    public function setColorCode(string $color_code): self
    {
        $this->color_code = $color_code;

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

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }

    public function getSkinTheme(): ?skinTheme
    {
        return $this->skin_theme;
    }

    public function setSkinTheme(?skinTheme $skin_theme): self
    {
        $this->skin_theme = $skin_theme;

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
            $training->setSkin($this);
        }

        return $this;
    }

    public function removeTraining(Training $training): self
    {
        if ($this->trainings->contains($training)) {
            $this->trainings->removeElement($training);
            // set the owning side to null (unless already changed)
            if ($training->getSkin() === $this) {
                $training->setSkin(null);
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

    public function toArray() : array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'author' => $this->author,
            'description' => $this->description,
            'color_code' => $this->color_code,
            'color' => $this->color_name,
            'status' => $this->status,
            'skin_folder' => $this->folder_name,
            'theme_name' => $this->skin_theme->getTitle(),
            'theme_id' => $this->skin_theme->getId(),
            'theme_folder' => $this->skin_theme->getFolderName(),
            'position' => $this->position,
            'version' => $this->version
        ];
    }

    public function getFolderName(): ?string
    {
        return $this->folder_name;
    }

    public function setFolderName(string $folder_name): self
    {
        $this->folder_name = $folder_name;

        return $this;
    }
}
