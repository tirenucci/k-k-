<?php

namespace App\Controller;

use App\Controller\LibController;
use App\Service\NoteGrainService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;


class NoteGrainController extends LibController
{

    /**
     * @Route("/note/new", methods={"POST"})
     *
     * @return JsonResponse
     */
    public function create(Request $request, NoteGrainService $noteGrainService) : JsonResponse
    {
        $data = $this->getBody($request);

        $note = $noteGrainService->createNewNote($data);

        return $this->setReturn(self::CREATED, $note);
    }

    /**
     * @Route("/note/update", methods={"PUT"})
     *
     * @param NoteGrainService $noteGrainService
     * @return JsonResponse
     */
    public function update(NoteGrainService $noteGrainService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $note = $noteGrainService->updateNote($data);

        return $this->setReturn(self::OK, $note);
    }

    /**
     * @Route("/note/remove", methods={"DELETE"})
     *
     * @param NoteGrainService $noteGrainService
     * @return JsonResponse
     */
    public function remove(NoteGrainService $noteGrainService, Request $request) : JsonResponse
    {
        $data = $this->getBody($request);

        $noteGrainService->deleteNote($data);

        return $this->setReturn(self::OK);
    }

    /**
     * @Route("/note/get_all", methods={"GET"})
     *
     * @param NoteGrainService $noteGrainService
     * @return void
     */
    public function getAll(NoteGrainService $noteGrainService, Request $request) : JsonResponse
    {
        $data = $this->getAllGet($request);

        $note = $noteGrainService->getAllNoteByGrain($data);

        return $this->setReturn(self::OK, $note);
    }

}
