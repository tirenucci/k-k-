<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200121144807 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user ADD offer_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64953C674EE FOREIGN KEY (offer_id) REFERENCES offer (id)');
        $this->addSql('CREATE INDEX IDX_8D93D64953C674EE ON user (offer_id)');
        $this->addSql('ALTER TABLE training_author ADD is_owner TINYINT(1) NOT NULL, ADD edit_settings TINYINT(1) NOT NULL, ADD edit_content TINYINT(1) NOT NULL, ADD edit_notes TINYINT(1) NOT NULL, DROP test');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE training_author ADD test INT NOT NULL, DROP is_owner, DROP edit_settings, DROP edit_content, DROP edit_notes');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D64953C674EE');
        $this->addSql('DROP INDEX IDX_8D93D64953C674EE ON user');
        $this->addSql('ALTER TABLE user DROP offer_id');
    }
}
