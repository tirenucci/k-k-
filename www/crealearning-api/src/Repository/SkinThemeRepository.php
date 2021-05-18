<?php

namespace App\Repository;

use App\Entity\SkinTheme;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SkinTheme|null find($id, $lockMode = null, $lockVersion = null)
 * @method SkinTheme|null findOneBy(array $criteria, array $orderBy = null)
 * @method SkinTheme[]    findAll()
 * @method SkinTheme[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SkinThemeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SkinTheme::class);
    }


    public function getAllTheme(int $society_id)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.society IS NULL')
            ->orWhere('s.society = :id')
            ->setParameter('id', $society_id)
            ->getQuery()
            ->getResult();
    }
    public function getAllThemeActif(int $society_id)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.society IS NULL')
            ->orWhere('s.society = :id')
            ->andWhere('s.status = :status')
            ->setParameters(['id' => $society_id, 'status' => '_ACTIVE'])
            ->orderBy('s.position', 'ASC')
            ->getQuery()
            ->getResult();
    }

    // /**
    //  * @return SkinTheme[] Returns an array of SkinTheme objects
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
    public function findOneBySomeField($value): ?SkinTheme
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
