<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BlockGrainRepository")
 * @ORM\Table(name="cle_block_grain")
 */
class BlockGrain
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $position;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $type;

    /**
     * @ORM\Column(type="float", nullable=true, options={"default": 0})
     */
    private $coef = 0;

    /**
     * @ORM\Column(type="float", nullable=true, options={"default": 0})
     */
    private $question_score = 0;

    /**
     * @ORM\Column(type="text")
     */
    private $code;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\grain", inversedBy="blockGrains")
     * @ORM\JoinColumn(name="grain_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $grain;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getCoef(): ?float
    {
        return $this->coef;
    }

    public function setCoef(float $coef): self
    {
        $this->coef = $coef;

        return $this;
    }

    public function getQuestionScore(): ?float
    {
        return $this->question_score;
    }

    public function setQuestionScore(float $question_score): self
    {
        $this->question_score = $question_score;

        return $this;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getGrain(): ?grain
    {
        return $this->grain;
    }

    public function setGrain(?grain $grain): self
    {
        $this->grain = $grain;

        return $this;
    }

    public function toArray() : array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'question_score' => $this->question_score,
            'coef' => $this->coef,
            'type' => $this->type,
            'position' => $this->position
        ];
    }
}
