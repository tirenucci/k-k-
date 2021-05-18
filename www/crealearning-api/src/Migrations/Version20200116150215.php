<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200116150215 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE label MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE label DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE label CHANGE language_id language_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE label ADD PRIMARY KEY (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE label MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE label DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE label CHANGE language_id language_id INT NOT NULL');
        $this->addSql('ALTER TABLE label ADD PRIMARY KEY (id, language_id)');
    }
}
