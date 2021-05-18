<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\IntegratedObjectThemeRepository")
 * @ORM\Table(name="cle_integrated_object_theme")
 */
class IntegratedObjectTheme
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
     * @ORM\OneToMany(targetEntity="App\Entity\IntegratedObject", mappedBy="integrated_object_theme")
     */
    private $integratedObjects;

    public function __construct()
    {
        $this->integratedObjects = new ArrayCollection();
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
     * @return Collection|IntegratedObject[]
     */
    public function getIntegratedObjects(): Collection
    {
        return $this->integratedObjects;
    }

    public function addIntegratedObject(IntegratedObject $integratedObject): self
    {
        if (!$this->integratedObjects->contains($integratedObject)) {
            $this->integratedObjects[] = $integratedObject;
            $integratedObject->setIntegratedObjectTheme($this);
        }

        return $this;
    }

    public function removeIntegratedObject(IntegratedObject $integratedObject): self
    {
        if ($this->integratedObjects->contains($integratedObject)) {
            $this->integratedObjects->removeElement($integratedObject);
            // set the owning side to null (unless already changed)
            if ($integratedObject->getIntegratedObjectTheme() === $this) {
                $integratedObject->setIntegratedObjectTheme(null);
            }
        }

        return $this;
    }

    public function toArray() : array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'position' => $this->position,
        ];
    }
}
