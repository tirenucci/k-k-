<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TrainingLanguageRepository")
 * @ORM\Table(name="cle_training_language")
 */
class TrainingLang
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=25)
     */
    private $label_fr;

    /**
     * @ORM\Column(type="string", length=25)
     */
    private $label;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $iso_code_6393;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $iso_code_6391;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $encode;

    /**
     * @ORM\Column(type="integer")
     */
    private $position;

    /**
     * @ORM\Column(type="boolean")
     */
    private $active;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $image_name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $quiz_validate_button_label;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $quiz_correct_answer_title;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $quiz_truefalse_invalid;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $quiz_qcm_invalid;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $quiz_cloze_invalid;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $quiz_numeric_invalid;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $quiz_likert_invalid;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $quiz_match_invalid;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $quiz_confirmation;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $match_category_title;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $feedback_correct_label;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $feedback_incorrect_label;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $answer_true_label;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $answer_false_label;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $likert_label;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $likert_no_answer_label;

    

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Training", mappedBy="language")
     */
    private $trainings;

    /**
     * @ORM\OneToMany(targetEntity=TrainingLang::class, mappedBy="language")
     */
    private $trainingLang;

    public function __construct()
    {
        $this->trainings = new ArrayCollection();
        $this->trainingLang = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabelFr(): ?string
    {
        return $this->label_fr;
    }

    public function setLabelFr(string $label_fr): self
    {
        $this->label_fr = $label_fr;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function getIsoCode6393(): ?string
    {
        return $this->iso_code_6393;
    }

    public function setIsoCode6393(string $iso_code_6393): self
    {
        $this->iso_code_6393 = $iso_code_6393;

        return $this;
    }

    public function getIsoCode6391(): ?string
    {
        return $this->iso_code_6391;
    }

    public function setIsoCode6391(string $iso_code_6391): self
    {
        $this->iso_code_6391 = $iso_code_6391;

        return $this;
    }

    public function getEncode(): ?string
    {
        return $this->encode;
    }

    public function setEncode(string $encode): self
    {
        $this->encode = $encode;

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

    public function getActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    public function getImageName(): ?string
    {
        return $this->image_name;
    }

    public function setImageName(?string $image_name): self
    {
        $this->image_name = $image_name;

        return $this;
    }

    public function getQuizValidateButtonLabel(): ?string
    {
        return $this->quiz_validate_button_label;
    }

    public function setQuizValidateButtonLabel(string $quiz_validate_button_label): self
    {
        $this->quiz_validate_button_label = $quiz_validate_button_label;

        return $this;
    }

    public function getQuizCorrectAnswerTitle(): ?string
    {
        return $this->quiz_correct_answer_title;
    }

    public function setQuizCorrectAnswerTitle(string $quiz_correct_answer_title): self
    {
        $this->quiz_correct_answer_title = $quiz_correct_answer_title;

        return $this;
    }

    public function getQuizTruefalseInvalid(): ?string
    {
        return $this->quiz_truefalse_invalid;
    }

    public function setQuizTruefalseInvalid(string $quiz_truefalse_invalid): self
    {
        $this->quiz_truefalse_invalid = $quiz_truefalse_invalid;

        return $this;
    }

    public function getQuizQcmInvalid(): ?string
    {
        return $this->quiz_qcm_invalid;
    }

    public function setQuizQcmInvalid(string $quiz_qcm_invalid): self
    {
        $this->quiz_qcm_invalid = $quiz_qcm_invalid;

        return $this;
    }

    public function getQuizClozeInvalid(): ?string
    {
        return $this->quiz_cloze_invalid;
    }

    public function setQuizClozeInvalid(string $quiz_cloze_invalid): self
    {
        $this->quiz_cloze_invalid = $quiz_cloze_invalid;

        return $this;
    }

    public function getQuizNumericInvalid(): ?string
    {
        return $this->quiz_numeric_invalid;
    }

    public function setQuizNumericInvalid(string $quiz_numeric_invalid): self
    {
        $this->quiz_numeric_invalid = $quiz_numeric_invalid;

        return $this;
    }

    public function getQuizLikertInvalid(): ?string
    {
        return $this->quiz_likert_invalid;
    }

    public function setQuizLikertInvalid(string $quiz_likert_invalid): self
    {
        $this->quiz_likert_invalid = $quiz_likert_invalid;

        return $this;
    }

    public function getQuizMatchInvalid(): ?string
    {
        return $this->quiz_match_invalid;
    }

    public function setQuizMatchInvalid(string $quiz_match_invalid): self
    {
        $this->quiz_match_invalid = $quiz_match_invalid;

        return $this;
    }

    public function getQuizConfirmation(): ?string
    {
        return $this->quiz_confirmation;
    }

    public function setQuizConfirmation(string $quiz_confirmation): self
    {
        $this->quiz_confirmation = $quiz_confirmation;

        return $this;
    }

    public function getMatchCategoryTitle(): ?string
    {
        return $this->match_category_title;
    }

    public function setMatchCategoryTitle(string $match_category_title): self
    {
        $this->match_category_title = $match_category_title;

        return $this;
    }

    public function getFeedbackCorrectLabel(): ?string
    {
        return $this->feedback_correct_label;
    }

    public function setFeedbackCorrectLabel(string $feedback_correct_label): self
    {
        $this->feedback_correct_label = $feedback_correct_label;

        return $this;
    }

    public function getFeedbackIncorrectLabel(): ?string
    {
        return $this->feedback_incorrect_label;
    }

    public function setFeedbackIncorrectLabel(string $feedback_incorrect_label): self
    {
        $this->feedback_incorrect_label = $feedback_incorrect_label;

        return $this;
    }

    public function getAnswerTrueLabel(): ?string
    {
        return $this->answer_true_label;
    }

    public function setAnswerTrueLabel(string $answer_true_label): self
    {
        $this->answer_true_label = $answer_true_label;

        return $this;
    }

    public function getAnswerFalseLabel(): ?string
    {
        return $this->answer_false_label;
    }

    public function setAnswerFalseLabel(string $answer_false_label): self
    {
        $this->answer_false_label = $answer_false_label;

        return $this;
    }

    public function getLikertLabel(): ?string
    {
        return $this->likert_label;
    }

    public function setLikertLabel(string $likert_label): self
    {
        $this->likert_label = $likert_label;

        return $this;
    }

    public function getLikertNoAnswerLabel(): ?string
    {
        return $this->likert_no_answer_label;
    }

    public function setLikertNoAnswerLabel(string $likert_no_answer_label): self
    {
        $this->likert_no_answer_label = $likert_no_answer_label;

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
            $training->addLanguage($this);
        }

        return $this;
    }

    public function removeTraining(Training $training): self
    {
        if ($this->trainings->contains($training)) {
            $this->trainings->removeElement($training);
            $training->removeLanguage($this);
        }

        return $this;
    }

    /**
     * @return Collection|TrainingLang[]
     */
    public function getTrainingLang(): Collection
    {
        return $this->trainingLang;
    }

    public function addTrainingLang(TrainingLang $activatedLanguage): self
    {
        if (!$this->trainingLang->contains($activatedLanguage)) {
            $this->trainingLang[] = $activatedLanguage;
            $activatedLanguage->setLanguage($this);
        }

        return $this;
    }

    public function removeTrainingLang(TrainingLang $activatedLanguage): self
    {
        if ($this->trainingLang->contains($activatedLanguage)) {
            $this->trainingLang->removeElement($activatedLanguage);
            // set the owning side to null (unless already changed)
            if ($activatedLanguage->getLanguage() === $this) {
                $activatedLanguage->setLanguage(null);
            }
        }

        return $this;
    }

    public function toArray() : array
    {
        return [
            'label_fr' => $this->label_fr,
            'label' => $this->label,
            'iso_code_6393' => $this->iso_code_6393,
            'iso_code_6391' => $this->iso_code_6391,
            'image_name' => $this->image_name,
            'encode' => $this->encode,
            'position' => $this->position,
            'active' => $this->active
        ];
    }
}
