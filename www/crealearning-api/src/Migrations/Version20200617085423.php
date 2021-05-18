<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200617085423 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE activated_language');
        $this->addSql('ALTER TABLE skin DROP FOREIGN KEY FK_279681EE6389D24');
        $this->addSql('DROP INDEX IDX_279681EE6389D24 ON skin');
        $this->addSql('ALTER TABLE skin DROP society_id');
        $this->addSql('ALTER TABLE skin_theme DROP FOREIGN KEY FK_98606F8BE6389D24');
        $this->addSql('DROP INDEX IDX_98606F8BE6389D24 ON skin_theme');
        $this->addSql('ALTER TABLE skin_theme DROP society_id');
        $this->addSql('ALTER TABLE user ADD city VARCHAR(100) DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE activated_language (id INT AUTO_INCREMENT NOT NULL, society_id INT DEFAULT NULL, language_id INT DEFAULT NULL, activated TINYINT(1) NOT NULL, INDEX IDX_73FFEFCC82F1BAF4 (language_id), INDEX IDX_73FFEFCCE6389D24 (society_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE activated_language ADD CONSTRAINT FK_73FFEFCC82F1BAF4 FOREIGN KEY (language_id) REFERENCES training_lang (id)');
        $this->addSql('ALTER TABLE activated_language ADD CONSTRAINT FK_73FFEFCCE6389D24 FOREIGN KEY (society_id) REFERENCES society (id)');
        $this->addSql('ALTER TABLE skin ADD society_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE skin ADD CONSTRAINT FK_279681EE6389D24 FOREIGN KEY (society_id) REFERENCES society (id)');
        $this->addSql('CREATE INDEX IDX_279681EE6389D24 ON skin (society_id)');
        $this->addSql('ALTER TABLE skin_theme ADD society_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE skin_theme ADD CONSTRAINT FK_98606F8BE6389D24 FOREIGN KEY (society_id) REFERENCES society (id)');
        $this->addSql('CREATE INDEX IDX_98606F8BE6389D24 ON skin_theme (society_id)');
        $this->addSql('ALTER TABLE user DROP city');
    }
}
