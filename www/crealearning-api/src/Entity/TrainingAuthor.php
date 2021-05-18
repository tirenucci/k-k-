<?php

namespace App\Entity;


use App\Entity\Tag;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @ORM\Table(name="cle_training_author")
 * @ORM\Entity(repositoryClass="App\Repository\TrainingRepository")
 */
class TrainingAuthor
{
    /**
     * @ORM\Id()
     * @ORM\ManyToOne(targetEntity="App\Entity\Training", inversedBy="training")
     */
    private $training;

    /**
     * @ORM\Id()
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="user")
     */
    private $author;

    /**
     * @ORM\Column(type="boolean")
     */
    private $is_owner;

    /**
     * @ORM\Column(type="boolean")
     */
    private $is_editor;

    public function __construct()
    {
        
    }

    public function getAuthor() : ?User
    {
        return $this->author;
    }

    public function setAuthor(User $user): self
    {
        $this->author = $user;
        return $this;
    }

    public function setTraining(Training $training): self
    {
        $this->training = $training;
        return $this;
    }
    


    public function getTraining(): ?Training
    {
        return $this->training;
    }

    

    public function toArray() : array
    {
        return [
            'id' => $this->author->getId(),
            'last_name' => $this->author->getLastName(),
            'first_name' => $this->author->getFirstName(),
            'role' => $this->author->getRole(),
            'is_owner' => $this->is_owner,
            'is_editor' => $this->is_editor,
            'id_training' => $this->training->getId()
        ];
    }

    public function getIsOwner(): ?bool
    {
        return $this->is_owner;
    }

    public function setIsOwner(bool $is_owner): self
    {
        $this->is_owner = $is_owner;

        return $this;
    }

    public function getIsEditor(): ?bool
    {
        return $this->is_editor;
    }

    public function setIsEditor(bool $is_editor): self
    {
        $this->is_editor = $is_editor;

        return $this;
    }


}