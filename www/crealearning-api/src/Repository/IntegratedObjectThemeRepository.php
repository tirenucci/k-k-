<?php

namespace App\Repository;

use App\Entity\IntegratedObjectTheme;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method IntegratedObjectTheme|null find($id, $lockMode = null, $lockVersion = null)
 * @method IntegratedObjectTheme|null findOneBy(array $criteria, array $orderBy = null)
 * @method IntegratedObjectTheme[]    findAll()
 * @method IntegratedObjectTheme[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IntegratedObjectThemeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, IntegratedObjectTheme::class);
    }

    // /**
    //  * @return IntegratedObjectTheme[] Returns an array of IntegratedObjectTheme objects
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
    public function findOneBySomeField($value): ?IntegratedObjectTheme
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
