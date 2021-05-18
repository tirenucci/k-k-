<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Index; 

/**
 * @ORM\Entity(repositoryClass="App\Repository\LabelRepository")
 * @ORM\Table(name="cle_label", indexes={@ORM\Index(name="id", columns={"id"})})
 */
class Label
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    private $text;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\language", inversedBy="labels")
     */
    private $language;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getLanguage(): ?language
    {
        return $this->language;
    }

    public function setLanguage(?language $language): self
    {
        $this->language = $language;

        return $this;
    }
}
