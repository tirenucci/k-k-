<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(UserInterface $user, string $newEncodedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newEncodedPassword);
        $this->_em->persist($user);
        $this->_em->flush();
    }

    public function getAllUser(string $wordSearch, string $statusFilter, string $offerFilter)
    {
        $qb = $this->createQueryBuilder('u')
            ->leftJoin('App\\Entity\\Society', 's', 'WITH', 'u.society = s.id')
            ->leftJoin('App\\Entity\\Offer', 'o', 'WITH', 'u.offer = o.id')
            ->andWhere("CONCAT(u.first_name,' ', u.last_name) LIKE :wordSearch")
            ->orWhere("u.email LIKE :wordSearch")
            ->orWhere("s.name LIKE :wordSearch")
            ->setParameter('wordSearch', '%' . $wordSearch . '%');
        if ($statusFilter !== "_ALL")
        {
            $qb->andWhere("u.status = :status");
            $qb->setParameter('status', $statusFilter);
        }

        if ($offerFilter !== "_ALL_OFFER")
        {
            $qb->andWhere("o.name = :offer");
            $qb->setParameter('offer', $offerFilter);
        }

        $query = $qb->getQuery();
        return $query->getResult();
    }

    // /**
    //  * @return User[] Returns an array of User objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
