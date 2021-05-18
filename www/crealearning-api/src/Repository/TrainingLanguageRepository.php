<?php

namespace App\Repository;

use App\Entity\TrainingLang;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TrainingLanguage|null find($id, $lockMode = null, $lockVersion = null)
 * @method TrainingLanguage|null findOneBy(array $criteria, array $orderBy = null)
 * @method TrainingLanguage[]    findAll()
 * @method TrainingLanguage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TrainingLanguageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TrainingLang::class);
    }

    // /**
    //  * @return TrainingLanguage[] Returns an array of TrainingLanguage objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?TrainingLanguage
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
