<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @ORM\Entity(repositoryClass="App\Repository\GrainRepository")
 * @ORM\Table(name="cle_grain")
 */
class Grain
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
    private $name;

    /**
     * @ORM\Column(type="string", length=10, options={"default": 100})
     */
    private $score_total = 100;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;


    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\Column(type="integer", options={"default": 0})
     */
    private $duration = 0;

    /**
     * @ORM\Column(type="integer")
     */
    private $position;

    /**
     * @ORM\Column(type="float", options={"default": 0})
     */
    private $threshold = 0;

    /**
     * @ORM\Column(type="string", length=10, options={"default": "_INVALID"})
     */
    private $content_validation = "_INVALID";

    /**
     * @ORM\Column(type="string", length=10, options={"default": "_INVALID"})
     */
    private $graphic_validation = "_INVALID";

    /**
     * @ORM\Column(type="boolean", options={"default": true})
     */
    private $show_correct_answers = true;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\BlockGrain", mappedBy="grain")
     */
    private $blockGrains;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\NoteGrain", mappedBy="grain", cascade={"remove"})
     * @ORM\JoinColumn(name="note_grain", referencedColumnName="id", onDelete="CASCADE")
     */
    private $noteGrains;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Training", inversedBy="grains")
     * @ORM\JoinColumn(name="training", referencedColumnName="id", onDelete="CASCADE")
     */
    private $training;

    /**
     * @ORM\Column(type="time", options={"default": "00:00:00"})
     */
    private $minimum_time;

    /**
     * @ORM\Column(type="time", options={"default": "00:00:00"})
     */
    private $maximum_time;

    /**
     * @ORM\Column(type="string", length=255, options={"default": "exit,no message"})
     */
    private $action_time_limit = "exit,no message";

    public function __construct()
    {
        $this->noteGrains = new ArrayCollection();
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

    public function getScoreTotal(): ?string
    {
        return $this->score_total;
    }

    public function setScoreTotal(string $score_total): self
    {
        $this->score_total = $score_total;

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

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;

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

    public function getThreshold(): ?float
    {
        return $this->threshold;
    }

    public function setThreshold(float $threshold): self
    {
        $this->threshold = $threshold;

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

    public function getGraphicValidation(): ?string
    {
        return $this->graphic_validation;
    }

    public function setGraphicValidation(string $graphic_validation): self
    {
        $this->graphic_validation = $graphic_validation;

        return $this;
    }

    public function getShowCorrectAnswers(): ?bool
    {
        return $this->show_correct_answers;
    }

    public function setShowCorrectAnswers(bool $show_correct_answers): self
    {
        $this->show_correct_answers = $show_correct_answers;

        return $this;
    }

    /**
     * @return Collection|BlockGrain[]
     */
    public function getBlockGrains(): Collection
    {
        return $this->blockGrains;
    }

    public function addBlockGrain(BlockGrain $blockGrain): self
    {
        if (!$this->blockGrains->contains($blockGrain)) {
            $this->blockGrains[] = $blockGrain;
            $blockGrain->setGrain($this);
        }

        return $this;
    }

    public function removeBlockGrain(BlockGrain $blockGrain): self
    {
        if ($this->blockGrains->contains($blockGrain)) {
            $this->blockGrains->removeElement($blockGrain);
            // set the owning side to null (unless already changed)
            if ($blockGrain->getGrain() === $this) {
                $blockGrain->setGrain(null);
            }
        }

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
            $noteGrain->setGrain($this);
        }

        return $this;
    }

    public function removeNoteGrain(NoteGrain $noteGrain): self
    {
        if ($this->noteGrains->contains($noteGrain)) {
            $this->noteGrains->removeElement($noteGrain);
            // set the owning side to null (unless already changed)
            if ($noteGrain->getGrain() === $this) {
                $noteGrain->setGrain(null);
            }
        }

        return $this;
    }

    public function getTraining(): ?training
    {
        return $this->training;
    }

    public function setTraining(?training $training): self
    {
        $this->training = $training;

        return $this;
    }

    public function getMinimumTime(): ?\DateTimeInterface
    {
        return $this->minimum_time;
    }

    public function setMinimumTime(\DateTimeInterface $minimum_time): self
    {
        $this->minimum_time = $minimum_time;

        return $this;
    }

    public function getMaximumTime(): ?\DateTimeInterface
    {
        return $this->maximum_time;
    }

    public function setMaximumTime(\DateTimeInterface $maximum_time): self
    {
        $this->maximum_time = $maximum_time;

        return $this;
    }

    public function getActionTimeLimit(): ?string
    {
        return $this->action_time_limit;
    }

    public function setActionTimeLimit(string $action_time_limit): self
    {
        $this->action_time_limit = $action_time_limit;

        return $this;
    }

    public function toArray(?string $lang = null) : array
    {
        $array = [
            'id' => $this->id,
            'score_total' => $this->score_total,
            'id_training' => $this->training->getId(),
            'created_at' => $this->created_at->format('d/m/Y') . ' _GRAIN_HOUR ' . $this->created_at->format('H:i'),
            'updated_at' => $this->updated_at->format('d/m/Y') . ' _GRAIN_UPDATE_HOUR ' . $this->updated_at->format('H:i'),
            'duration' => $this->duration,
            'position' => $this->position,
            'threshold' => $this->threshold,
            'content_validation' => $this->content_validation,
            'graphic_validation' => $this->graphic_validation,
            'show_correct_answers' => $this->show_correct_answers,
            'minimum_time' => date_format($this->minimum_time, "H:i:s"),
            'maximum_time' => date_format($this->maximum_time, "H:i:s"),
            'action_time_limit' => $this->action_time_limit,
            'note_count' => count($this->noteGrains)
        ];
        if ($lang === null)
        {
            foreach ($this->training->getLanguage() as $lang)
            {
                $iso = $lang->getIsoCode6391();
                $array['name'][$iso] = $this->get_string_between($this->name, $iso . '="', '"');
            }
        }
        else
        {
            $array['name'] = $this->get_string_between($this->name, $lang . '="', '"');
        }

        return $array;
    }

    public function getNameByLang(string $lang) : string
    {
        return $this->get_string_between($this->name, $lang . '="', '"');
    }

    /**
     * Permet de récuperer un bout de chaine entre deux
     *
     * @param string $string
     * @param string $start
     * @param string $end
     * @return string
     */
    private function get_string_between(string $string, string $start, string $end) : string
    {
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }
}
