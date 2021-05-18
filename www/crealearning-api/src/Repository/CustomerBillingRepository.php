<?php

namespace App\Repository;

use App\Entity\CustomerBilling;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CustomerBilling|null find($id, $lockMode = null, $lockVersion = null)
 * @method CustomerBilling|null findOneBy(array $criteria, array $orderBy = null)
 * @method CustomerBilling[]    findAll()
 * @method CustomerBilling[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CustomerBillingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CustomerBilling::class);
    }

    // /**
    //  * @return CustomerBilling[] Returns an array of CustomerBilling objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CustomerBilling
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
