<?php

namespace App\Service;

use App\Entity\NoteGrain;
use App\Repository\GrainRepository;
use App\Repository\NoteGrainRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class NoteGrainService
{

    private $grainRepository;
    private $userRepository;
    private $noteGrainRepository;
    private $entityManagerInterface;


    function __construct(
                            GrainRepository $grainRepository,
                            UserRepository $userRepository,
                            NoteGrainRepository $noteGrainRepository,
                            EntityManagerInterface $entityManagerInterface
                        )
    {
        $this->grainRepository = $grainRepository;
        $this->userRepository = $userRepository;
        $this->noteGrainRepository = $noteGrainRepository;
        $this->entityManagerInterface = $entityManagerInterface;
    }

    /**
     * Permet de créer une note
     *
     * @param array $data les informations de la note
     * @return array $note on renvois la note
     */
    public function createNewNote(array $data) : array
    {
        $grain = $this->grainRepository->findOneBy(['id' => $data['id_grain']]);
        $user = $this->userRepository->findOneBy(['id' => $data['id_user']]);

        $note = new NoteGrain();
        $note->setGrain($grain);
        $note->setUser($user);
        $note->setCreatedAt(new \DateTime());
        $note->setUpdatedAt(new \DateTime());
        $note->setContent('');

        $this->entityManagerInterface->persist($note);
        $this->entityManagerInterface->flush();

        return $note->toArray();
    }

    /**
     * La fonction qui permet de mettre a jour la note
     *
     * @param array $data l'id et le contenue de la note
     * @return array $note on renvois la note
     */
    public function updateNote(array $data) : array
    {
        $note = $this->noteGrainRepository->findOneBy(['id' => $data['id_note']]);

        $note->setUpdatedAt(new \DateTime());
        $note->setContent($data['content']);

        $this->entityManagerInterface->persist($note);
        $this->entityManagerInterface->flush();

        return $note->toArray();
    }

    /**
     * La fonction qui permet de mettre supprimer une note
     *
     * @param array $data l'id et le contenue de la note
     * @return void
     */
    public function deleteNote(array $data) : void
    {
        $note = $this->noteGrainRepository->findOneBy(['id' => $data['id_note']]);

        $this->entityManagerInterface->remove($note);
        $this->entityManagerInterface->flush();
    }

    /**
     * Permet de récuperer toute les notes d'un grain
     *
     * @param array $data
     * @return array
     */
    public function getAllNoteByGrain(array $data) : array
    {
        $tmpNote = $this->noteGrainRepository->findBy(['grain' => $data['grain_id']]);
        $allNote = [];

        foreach($tmpNote as $note) 
        {
            array_push($allNote, $note->toArray());
        }


        return $allNote;
    }
}
