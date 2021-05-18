<?php

namespace App\Repository;

use App\Entity\IntegratedObject;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method IntegratedObject|null find($id, $lockMode = null, $lockVersion = null)
 * @method IntegratedObject|null findOneBy(array $criteria, array $orderBy = null)
 * @method IntegratedObject[]    findAll()
 * @method IntegratedObject[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IntegratedObjectRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, IntegratedObject::class);
    }

    // /**
    //  * @return IntegratedObject[] Returns an array of IntegratedObject objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?IntegratedObject
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
