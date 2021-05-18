<?php

namespace App\Repository;

use App\Entity\BlockGrain;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method BlockGrain|null find($id, $lockMode = null, $lockVersion = null)
 * @method BlockGrain|null findOneBy(array $criteria, array $orderBy = null)
 * @method BlockGrain[]    findAll()
 * @method BlockGrain[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BlockGrainRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BlockGrain::class);
    }

    public function getAllPositionHighter(int $position)
    {
        return $this->createQueryBuilder('b')
                    ->andWhere('b.position > :position')
                    ->setParameter('position', $position)
                    ->getQuery()
                    ->getResult();
    }

    // /**
    //  * @return BlockGrain[] Returns an array of BlockGrain objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('b.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?BlockGrain
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
