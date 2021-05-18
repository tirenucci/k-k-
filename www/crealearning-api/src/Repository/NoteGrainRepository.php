<?php

namespace App\Repository;

use App\Entity\NoteGrain;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method NoteGrain|null find($id, $lockMode = null, $lockVersion = null)
 * @method NoteGrain|null findOneBy(array $criteria, array $orderBy = null)
 * @method NoteGrain[]    findAll()
 * @method NoteGrain[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NoteGrainRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NoteGrain::class);
    }

    // /**
    //  * @return NoteGrain[] Returns an array of NoteGrain objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('n.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?NoteGrain
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
