<?php

namespace App\Repository;

use App\Entity\Grain;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Grain|null find($id, $lockMode = null, $lockVersion = null)
 * @method Grain|null findOneBy(array $criteria, array $orderBy = null)
 * @method Grain[]    findAll()
 * @method Grain[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GrainRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Grain::class);
    }

    public function getAllPositionHighter(int $position)
    {
        return $this->createQueryBuilder('g')
                ->andWhere('g.position > :position')
                ->setParameter('position', $position)
                ->getQuery()
                ->getResult();
    }

    // /**
    //  * @return Grain[] Returns an array of Grain objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('g.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Grain
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
