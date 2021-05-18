<?php

namespace App\Entity\Type;

use Doctrine\DBAL\Types\StringType;

class EnumRoleType extends StringType
{
    const ROLE_LOGIPRO       = 'ROLE_LOGIPRO';
    const ROLE_ADMINISTRATOR = 'ROLE_ADMINISTRATOR';
    const ROLE_AUTHOR        = 'ROLE_AUTHOR';
    const ROLE_USER          = 'ROLE_USER';


    public static function getFrenshReadable(string $role) : string
    {
        $roles = array(
            self::ROLE_ADMINISTRATOR => "Administrateur Logiciel",
            self::ROLE_LOGIPRO => "Employer Logipro",
            self::ROLE_AUTHOR => "Auteur",
            self::ROLE_USER => "Utilisateur"
        );

        if (array_key_exists($role, $roles))
        {
            return $roles[$role];
        }

        return 'Aucun role de ce type';
    }
}