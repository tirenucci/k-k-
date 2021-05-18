<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200116135218 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE map_author_training_rights ADD training_id INT DEFAULT NULL, ADD author_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE map_author_training_rights ADD CONSTRAINT FK_16D799DDBEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE map_author_training_rights ADD CONSTRAINT FK_16D799DDF675F31B FOREIGN KEY (author_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_16D799DDBEFD98D1 ON map_author_training_rights (training_id)');
        $this->addSql('CREATE INDEX IDX_16D799DDF675F31B ON map_author_training_rights (author_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE map_author_training_rights DROP FOREIGN KEY FK_16D799DDBEFD98D1');
        $this->addSql('ALTER TABLE map_author_training_rights DROP FOREIGN KEY FK_16D799DDF675F31B');
        $this->addSql('DROP INDEX IDX_16D799DDBEFD98D1 ON map_author_training_rights');
        $this->addSql('DROP INDEX IDX_16D799DDF675F31B ON map_author_training_rights');
        $this->addSql('ALTER TABLE map_author_training_rights DROP training_id, DROP author_id');
    }
}
