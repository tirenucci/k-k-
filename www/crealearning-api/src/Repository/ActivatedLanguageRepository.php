<?php

namespace App\Repository;

use App\Entity\ActivatedLanguage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ActivatedLanguage|null find($id, $lockMode = null, $lockVersion = null)
 * @method ActivatedLanguage|null findOneBy(array $criteria, array $orderBy = null)
 * @method ActivatedLanguage[]    findAll()
 * @method ActivatedLanguage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ActivatedLanguageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ActivatedLanguage::class);
    }

    // /**
    //  * @return ActivatedLanguage[] Returns an array of ActivatedLanguage objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ActivatedLanguage
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
