<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SkinThemeRepository")
 * @ORM\Table(name="cle_skin_theme")
 */
class SkinTheme
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
    private $title;

    /**
     * @ORM\Column(type="integer")
     */
    private $position;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Skin", mappedBy="skin_theme")
     */
    private $skins;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $status = "_ACTIVE";

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Society", inversedBy="skinThemes")
     */
    private $society;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $folder_name;

    public function __construct()
    {
        $this->skins = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

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
            $skin->setSkinTheme($this);
        }

        return $this;
    }

    public function removeSkin(Skin $skin): self
    {
        if ($this->skins->contains($skin)) {
            $this->skins->removeElement($skin);
            // set the owning side to null (unless already changed)
            if ($skin->getSkinTheme() === $this) {
                $skin->setSkinTheme(null);
            }
        }

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

    public function getSociety(): ?Society
    {
        return $this->society;
    }

    public function setSociety(?Society $society): self
    {
        $this->society = $society;

        return $this;
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
