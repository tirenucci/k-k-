<?php

namespace App\Entity;

use App\Repository\ActivatedLanguageRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ActivatedLanguageRepository::class)
 * @ORM\Table(name="cle_activated_language")
 */
class ActivatedLanguage
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Society::class, inversedBy="activatedLanguages", cascade={"remove"})
     * @ORM\JoinColumn(name="society_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $society;

    /**
     * @ORM\ManyToOne(targetEntity=TrainingLang::class, inversedBy="activatedLanguages")
     */
    private $language;

    /**
     * @ORM\Column(type="boolean")
     */
    private $activated;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getLanguage(): ?TrainingLang
    {
        return $this->language;
    }

    public function setLanguage(?TrainingLang $language): self
    {
        $this->language = $language;

        return $this;
    }

    public function getActivated(): ?bool
    {
        return $this->activated;
    }

    public function setActivated(bool $activated): self
    {
        $this->activated = $activated;

        return $this;
    }

    public function toArray()
    {
    	return [
		    'label_fr' => $this->language->getLabelFr(),
		    'label' => $this->language->getLabel(),
		    'iso_code_6393' => $this->language->getIsoCode6393(),
		    'iso_code_6391' => $this->language->getIsoCode6391(),
		    'image_name' => $this->language->getImageName(),
		    'encode' => $this->language->getEncode(),
		    'position' => $this->language->getPosition(),
		    'active' => $this->activated
	    ];
    }
}
