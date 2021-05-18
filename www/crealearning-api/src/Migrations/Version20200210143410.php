<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200210143410 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE training DROP FOREIGN KEY FK_D5128A8FF404637F');
        $this->addSql('DROP INDEX IDX_D5128A8FF404637F ON training');
        $this->addSql('ALTER TABLE training CHANGE skin_id skin_theme_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE training ADD CONSTRAINT FK_D5128A8F24F627F9 FOREIGN KEY (skin_theme_id) REFERENCES skin (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_D5128A8F24F627F9 ON training (skin_theme_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE training DROP FOREIGN KEY FK_D5128A8F24F627F9');
        $this->addSql('DROP INDEX IDX_D5128A8F24F627F9 ON training');
        $this->addSql('ALTER TABLE training CHANGE skin_theme_id skin_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE training ADD CONSTRAINT FK_D5128A8FF404637F FOREIGN KEY (skin_id) REFERENCES skin (id)');
        $this->addSql('CREATE INDEX IDX_D5128A8FF404637F ON training (skin_id)');
    }
}
