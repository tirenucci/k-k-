<?php

namespace App\Repository;

use App\Entity\Avatar;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Avatar|null find($id, $lockMode = null, $lockVersion = null)
 * @method Avatar|null findOneBy(array $criteria, array $orderBy = null)
 * @method Avatar[]    findAll()
 * @method Avatar[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AvatarRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Avatar::class);
    }

    public function getCountAvatar(int $user_id)
    {
        return $this->createQueryBuilder('a')
            ->select("count(a.id)")
            ->andWhere('a.user = :val OR a.user is null')
            ->setParameter('val', $user_id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getAllAvatar(int $user_id)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.user = :val OR a.user is null')
            ->setParameter('val', $user_id)
            ->orderBy('a.position', 'ASC')
            ->getQuery()
            ->getResult();
    }

    // /**
    //  * @return Avatar[] Returns an array of Avatar objects
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
    public function findOneBySomeField($value): ?Avatar
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
