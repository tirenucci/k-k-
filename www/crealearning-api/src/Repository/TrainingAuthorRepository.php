<?php

namespace App\Repository;

use App\Entity\TrainingAuthor;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method Skin|null find($id, $lockMode = null, $lockVersion = null)
 * @method Skin|null findOneBy(array $criteria, array $orderBy = null)
 * @method Skin[]    findAll()
 * @method Skin[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TrainingAuthorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TrainingAuthor::class);
    }

    // /**
    //  * @return Skin[] Returns an array of Skin objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Skin
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
