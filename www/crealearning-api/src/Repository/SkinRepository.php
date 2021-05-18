<?php

namespace App\Repository;

use App\Entity\Skin;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Skin|null find($id, $lockMode = null, $lockVersion = null)
 * @method Skin|null findOneBy(array $criteria, array $orderBy = null)
 * @method Skin[]    findAll()
 * @method Skin[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SkinRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Skin::class);
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

    /**
     * Renvoie le décompte de coloris d'habillages pour un thème donné
     *
     * @param integer $id l'Id du thème pour lequel il faut compter le nb de coloris
     * @return void
     */
    public function findTotalSkinByTheme(int $soc, int $id)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.skin_theme = :id and s.society = :soc or s.society is null')
            ->setParameters(['id' => $id, 'soc' =>$soc])
            ->getQuery()
            ->getResult();        
    }

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
