<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200116135504 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE map_training_tag ADD training_id INT DEFAULT NULL, ADD tag_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE map_training_tag ADD CONSTRAINT FK_1024D24BEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE map_training_tag ADD CONSTRAINT FK_1024D24BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id)');
        $this->addSql('CREATE INDEX IDX_1024D24BEFD98D1 ON map_training_tag (training_id)');
        $this->addSql('CREATE INDEX IDX_1024D24BAD26311 ON map_training_tag (tag_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE map_training_tag DROP FOREIGN KEY FK_1024D24BEFD98D1');
        $this->addSql('ALTER TABLE map_training_tag DROP FOREIGN KEY FK_1024D24BAD26311');
        $this->addSql('DROP INDEX IDX_1024D24BEFD98D1 ON map_training_tag');
        $this->addSql('DROP INDEX IDX_1024D24BAD26311 ON map_training_tag');
        $this->addSql('ALTER TABLE map_training_tag DROP training_id, DROP tag_id');
    }
}
