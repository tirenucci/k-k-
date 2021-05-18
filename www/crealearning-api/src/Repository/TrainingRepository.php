<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Society;
use App\Entity\Training;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method Training|null find($id, $lockMode = null, $lockVersion = null)
 * @method Training|null findOneBy(array $criteria, array $orderBy = null)
 * @method Training[]    findAll()
 * @method Training[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TrainingRepository extends ServiceEntityRepository
{

	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, Training::class);
	}

	public function sortAllBy(string $order, string $target, string $status, string $searchWord, Society $society,
	                          User $user, int $page) : array
	{
		$qb = $this->createQueryBuilder('t');
		$qb->setMaxResults(10);
		$qb->orderBy('t.' . $target, $order);
		$qb->setFirstResult($page * 10);
		$qb->leftJoin('App\\Entity\\TrainingAuthor', 'ta', 'WITH', 'ta.training = t');
		$qb->leftJoin('App\\Entity\\User', 'u', 'WITH', 'ta.author = :u');
		$qb->andWhere('t.name LIKE :search');
		$qb->andWhere('t.description LIKE :search');
		$qb->andWhere("CONCAT(u.first_name, ' ', u.last_name) LIKE :search");
		$qb->andWhere('t.tags LIKE :search');
		$qb->distinct();
		if ($user->getRole() !== 'ROLE_LOGIPRO') {
			$qb->andWhere('t.society = :society');

			if ($status !== '') {
				$qb->andWhere('t.status LIKE :value');
				$qb->setParameters(array('value' => '%' . $status . '%', 'search' => '%' . $searchWord . '%', 'u' => $user, 'society' => $society));
			} else {
				$qb->setParameters(array('search' => '%' . $searchWord . '%', 'u' => $user, 'society' => $society));
			}
		} else {

			if ($status !== '') {
				$qb->andWhere('t.status LIKE :value');
				$qb->setParameters(array('value' => '%' . $status . '%', 'search' => '%' . $searchWord . '%', 'u' => $user));
			} else {
				$qb->setParameters(array('search' => '%' . $searchWord . '%', 'u' => $user));
			}
		}
		$trainingsQuery = $qb->getQuery();

		$trainings = $trainingsQuery->getResult();


		$qb->select('count(t.id)');

		$countQuery = $qb->getQuery();

		$count = $countQuery->getOneOrNullResult();

		return ['count' => $count, 'trainings' => $trainings];

	}

    public function sortAllBySociety(string $order, string $target, string $status, string $searchWord, Society $society, User $user, int $page) : array
    {
        $qb = $this->createQueryBuilder('t');
        $qb->setMaxResults(10);
        $qb->orderBy('t.' . $target, $order);
        $qb->setFirstResult($page * 10);
        $qb->leftJoin('App\\Entity\\TrainingAuthor', 'ta', 'WITH', 'ta.training = t');
        $qb->leftJoin('App\\Entity\\User', 'u', 'WITH', 'ta.author = u');
        $qb->andWhere('t.name LIKE :search');
        $qb->andWhere('t.description LIKE :search');
        $qb->andWhere("CONCAT(u.first_name, ' ', u.last_name) LIKE :search");
        $qb->andWhere('t.tags LIKE :search');
        $qb->distinct();

        $qb->andWhere('t.society = :society');

        if ($status !== '') {
            $qb->andWhere('t.status LIKE :value');
            $qb->setParameters(array('value' => '%' . $status . '%', 'search' => '%' . $searchWord . '%', 'society' => $society));
        } else {
            $qb->setParameters(array('search' => '%' . $searchWord . '%', 'society' => $society));
        }

        $trainingsQuery = $qb->getQuery();
        $trainings = $trainingsQuery->getResult();

        $qb->select('count(t.id)');

        $countQuery = $qb->getQuery();

        $count = $countQuery->getOneOrNullResult();

        return ['count' => $count, 'trainings' => $trainings];
    }
	public function getCount(User $user)
	{
		$qb = $this->createQueryBuilder('t');
		$qb->leftJoin('App\\Entity\\TrainingAuthor', 'ta', 'WITH', 'ta.training = t');
		$qb->leftJoin('App\\Entity\\User', 'u', 'WITH', 'ta.author = :u');
		$qb->select('count(t.id)');
		$qb->setParameter('u', $user);
		$query = $qb->getQuery();
		try {
			return $query->getOneOrNullResult();
		} catch (NonUniqueResultException $e) {
			dd($e);
		}
	}
}
