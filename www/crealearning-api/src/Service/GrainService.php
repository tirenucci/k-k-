<?php

namespace App\Service;

use App\Entity\Grain;
use App\Entity\TrainingLang;
use App\Service\BlockService;
use App\Service\QuestionService;
use App\Repository\GrainRepository;
use App\Repository\TrainingRepository;
use App\Repository\BlockGrainRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Contracts\Translation\TranslatorInterface;

class GrainService
{

    private $entityManagerInterface;
    private $grainRepository;
    private $blockGrainRepository;
    private $trainingRepository;
    private $blockService;
    private $questionService;
    private $translator;

    private $security;

    public function __construct(
            EntityManagerInterface $entityManagerInterface,
            GrainRepository $grainRepository,
            BlockGrainRepository $blockGrainRepository,
            TrainingRepository $trainingRepository,
            BlockService $blockService,
            QuestionService $questionService,
            Security $security,
            TranslatorInterface $translator
            
        )
    {
        $this->entityManagerInterface = $entityManagerInterface;
        $this->grainRepository = $grainRepository;
        $this->blockGrainRepository = $blockGrainRepository;
        $this->trainingRepository = $trainingRepository;
        $this->blockService = $blockService;
        $this->questionService = $questionService;
        $this->translator = $translator;
        $this->security = $security;
    }

    /**
     * Création d'un grain dans la base de donnée
     *
     * @param array $data
     * @return void
     */
    public function createGrain(array $data)
    {
        $training = $this->trainingRepository->findOneBy(['id' => $data['id']]);
        $allGrain = $this->grainRepository->findBy(['training' => $training]);
        $grain = new Grain();
        $grain->setTraining($training);
        $grain->setName('<?xml version="1.0" encoding="UTF-8" ?><name ' . $this->security->getUser()->getLanguage()->getLanguageCode() . '="' . $this->translator->trans("grain.new", [],'text', $this->security->getUser()->getLanguage()->getLanguageCode()) . '"');
        $grain->setPosition(count($allGrain));
        $training->setUpdatedAt(new \DateTime());
        $grain->setCreatedAt(new \DateTime());
        $grain->setUpdatedAt(new \DateTime());
        $grain->setMinimumTime(new \DateTime("00:00:00"));
        $grain->setMaximumTime(new \DateTime("00:00:00"));

        $this->entityManagerInterface->persist($grain);
        $this->entityManagerInterface->persist($training);
        $this->entityManagerInterface->flush();
    }

    /**
     * Permet de générer tous le html de tous les blocks d'un grain
     *
     * @param array $data
     * @return array Le code html de tous les grains avec l'id et le type du block et le nombre de block (count)
     */
    public function generateHtml(array $data) : array
    {
        $grain = $this->grainRepository->findOneBy(['id' => $data['grain_id']]);

        $allBlock = $this->blockGrainRepository->findBy(['grain' => $grain], ['position' => "ASC"]);

        $html = array();
        foreach ($allBlock as $block)
        {
            if (strpos($block->getType(), "_QUIZ") === false)
            {
                $oneBlock = [
                    'htmlCode' => $this->blockService->generateHtml($block, $data['language'])['code'],
                    'lang' => $this->blockService->generateHtml($block, $data['language'])['lang'],
                    'id' => $block->getId(),
                    'type' => $block->getType(),
                    'position' => $block->getPosition()
                ];
            }
            else
            {
                $oneBlock = [
                    'htmlCode' => $this->questionService->generateHtml($block, $data['language'])['code'],
                    'lang' => $this->questionService->generateHtml($block, $data['language'])['lang'],
                    'id' => $block->getId(),
                    'type' => $block->getType(),
                    'position' => $block->getPosition()
                ];
            }

            $html[$block->getPosition()] = $oneBlock;
        }
        return [$html, count($allBlock)];
    }

    

    /**
     * Récupère tous les grain qui se rapporte a un module
     *
     * @param array $data
     * @return array
     */
    public function getAllGrainByTraining(array $data) : array
    {
        $training = $this->trainingRepository->findOneBy(['id' => $data['training_id']]);

        $allTmpGrain = $this->grainRepository->findBy(['training' => $training], ['position' => "ASC"]);

        $allGrain = array();

        foreach ($allTmpGrain as $grain)
        {
            if (isset($data['lang']))
                array_push($allGrain, $grain->toArray($data['lang']));
            else
                array_push($allGrain, $grain->toArray());
        }

        return $allGrain;
    }
    
    /**
     * Changement de position pour les grains
     *
     * @param array $data
     * @return void
     */
    public function switchPosition(array $data) : void
    {
        $training = $this->trainingRepository->findOneBy(['id' => $data['id']]);

        foreach ($data['grains'] as $key => $grain)
        {
            $grain = $this->grainRepository->findOneBy(['training' => $training, 'position' => $grain['position']]);

            $grain->setPosition($key);

            $this->entityManagerInterface->persist($grain);
        }

        $this->entityManagerInterface->flush();
    }

    /**
     * Fonction pour faire le changement du nom
     * 
     * @param array l'id et le nom du grain
     * @return null on renvois rien
     */
    public function changeName(array $data) : void
    {
        $grain = $this->grainRepository->findOneBy(['id' => $data['id']]);

        $currentName = $grain->getName();

        if (empty($data['name']))
        {
            $currentName = str_replace($data['lang'] . '="' . $this->get_string_between($currentName, $data['lang'] . '="', '"'), $data['lang'] . '="' . $this->translator->trans("grain.new", [],'text', $this->security->getUser()->getLanguage()->getLanguageCode()) . '"', $currentName);
        }
        else
        {
            $currentName = str_replace($data['lang'] . '="' . $this->get_string_between($currentName, $data['lang'] . '="', '"'), $data['lang'] . '="' . $data['name'] . '"', $currentName);
        }

        $grain->setName($currentName);

        $this->entityManagerInterface->persist($grain);
        $this->entityManagerInterface->flush();
    }

    /**
     * Fonction de suppression d'un grain
     *
     * @param array $data
     * @return void
     */
    public function delete(array $data) : void
    {
        $grain = $this->grainRepository->findOneBy(['id' => $data['id_grain']]);

        $this->entityManagerInterface->remove($grain);
        $grainHighter = $this->grainRepository->getAllPositionHighter($grain->getId());
        if (!empty($grainHighter))
        {
            foreach($grainHighter as $g)
            {
                $g->setPosition($g->getPosition() - 1);
                $this->entityManagerInterface->persist($g);
            }
        }
        $this->entityManagerInterface->flush();
    }

    /**
     * Fonction permettant de dupliquer un grain
     *
     * @param array $data
     * @return void
     */
    public function duplicate(array $data) : int
    {
        $oldGrain = $this->grainRepository->findOneBy(['id' => $data['id_grain']]);

        $oldBlock = $oldGrain->getBlockGrains();

        $grainsHighter = $this->grainRepository->getAllPositionHighter($oldGrain->getPosition());

        if (!empty($grainsHighter))
        {
            foreach($grainsHighter as $grainHighter)
            {
                $grainHighter->setPosition($grainHighter->getPosition() + 1);
            }
        }

        $grain = clone $oldGrain;

        $grain->setPosition($oldGrain->getPosition() + 1);

        $this->entityManagerInterface->persist($grain);



        foreach($oldBlock as $block)
        {
            $newBlock = clone $block;
            $newBlock->setGrain($grain);
            $this->entityManagerInterface->persist($newBlock);
        }

        
        $this->entityManagerInterface->flush();

        return $grain->getPosition();
    }

    /**
     * Récupere les informations d'un grain
     *
     * @param array $data
     * @return array
     */
    public function getOneGrainInformation(array $data) : array
    {
        $grain = $this->grainRepository->findOneBy(['id' => $data['id']]);

        return $grain->toArray();
    }

    /**
     * Modifie un grain
     *
     * @param array $data
     * @return void
     */
    public function update(array $data) : void
    {
        $grain = $this->grainRepository->findOneBy(['id' => $data['id']]);

        $grainName = str_replace($this->get_string_between($grain->getName(), $data['lang'] . '="', '"'), $data['grain']['name'][$data['lang']], $grain->getName());

        $grain->setName($grainName);
        $grain->setDuration($data['grain']['duration']);
        $grain->setThreshold($data['grain']['threshold']);
        $grain->setContentValidation($data['grain']['content_validation']);
        $grain->setGraphicValidation($data['grain']['graphic_validation']);
        $grain->setShowCorrectAnswers($data['grain']['show_correct_answers']);
        $grain->setMinimumTime(new \DateTime($data['grain']['minimum_time']));
        $grain->setMaximumTime(new \DateTime($data['grain']['maximum_time']));
        $grain->setActionTimeLimit($data['grain']['action_time_limit']);

        $this->entityManagerInterface->persist($grain);
        $this->entityManagerInterface->flush();
    }

    public function hasQuestion(int $grain_id) : bool
    {
        $grain = $this->grainRepository->findOneBy(['id' => $grain_id]);
        $blocks = $grain->getBlockGrains();

        $hasQuestion = false;
        $i = 0;

        while($hasQuestion === false && $i < count($blocks))
        {
            $block = $blocks[$i];

            if (strpos($block->getType(), "QUIZ") !== false)
            {
                $hasQuestion = true;
            }
            else
            {
                $i++;
            }
        }

        return $hasQuestion;
    }

    public function hasTimeAllowed(Grain $grain) : bool
    {
        $minTime = date_format($grain->getMinimumTime(), "H:i:s");
        $maxTime = date_format($grain->getMaximumTime(), "H:i:s");

        if ($minTime != '00:00:00' || $maxTime != '00:00:00')
        {
            return true;
        }
        return false;
    }

    public function getNameByLang(Grain $grain, TrainingLang $trainingLang)
    {
        return $this->get_string_between($grain->getName(), $trainingLang->getIsoCode6391() . '="', '"');
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