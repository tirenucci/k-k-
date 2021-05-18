<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200116135340 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE map_training_language ADD training_id INT DEFAULT NULL, ADD language_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE map_training_language ADD CONSTRAINT FK_20515213BEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE map_training_language ADD CONSTRAINT FK_2051521382F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
        $this->addSql('CREATE INDEX IDX_20515213BEFD98D1 ON map_training_language (training_id)');
        $this->addSql('CREATE INDEX IDX_2051521382F1BAF4 ON map_training_language (language_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE map_training_language DROP FOREIGN KEY FK_20515213BEFD98D1');
        $this->addSql('ALTER TABLE map_training_language DROP FOREIGN KEY FK_2051521382F1BAF4');
        $this->addSql('DROP INDEX IDX_20515213BEFD98D1 ON map_training_language');
        $this->addSql('DROP INDEX IDX_2051521382F1BAF4 ON map_training_language');
        $this->addSql('ALTER TABLE map_training_language DROP training_id, DROP language_id');
    }
}
