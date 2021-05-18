<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200120080611 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE map_author_training_rights');
        $this->addSql('DROP TABLE map_training_language');
        $this->addSql('DROP TABLE map_training_tag');
        $this->addSql('DROP TABLE training_tag');
        $this->addSql('ALTER TABLE user ADD api_token VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE map_author_training_rights (id INT AUTO_INCREMENT NOT NULL, training_id INT DEFAULT NULL, author_id INT DEFAULT NULL, is_owner TINYINT(1) NOT NULL, edit_settings TINYINT(1) NOT NULL, edit_content TINYINT(1) NOT NULL, edit_notes TINYINT(1) NOT NULL, INDEX IDX_16D799DDF675F31B (author_id), INDEX IDX_16D799DDBEFD98D1 (training_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE map_training_language (id INT AUTO_INCREMENT NOT NULL, training_id INT DEFAULT NULL, language_id INT DEFAULT NULL, INDEX IDX_2051521382F1BAF4 (language_id), INDEX IDX_20515213BEFD98D1 (training_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE map_training_tag (id INT AUTO_INCREMENT NOT NULL, training_id INT DEFAULT NULL, tag_id INT DEFAULT NULL, INDEX IDX_1024D24BAD26311 (tag_id), INDEX IDX_1024D24BEFD98D1 (training_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE training_tag (training_id INT NOT NULL, tag_id INT NOT NULL, INDEX IDX_9937C0CABEFD98D1 (training_id), INDEX IDX_9937C0CABAD26311 (tag_id), PRIMARY KEY(training_id, tag_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE map_author_training_rights ADD CONSTRAINT FK_16D799DDBEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE map_author_training_rights ADD CONSTRAINT FK_16D799DDF675F31B FOREIGN KEY (author_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE map_training_language ADD CONSTRAINT FK_2051521382F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE map_training_language ADD CONSTRAINT FK_20515213BEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE map_training_tag ADD CONSTRAINT FK_1024D24BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id)');
        $this->addSql('ALTER TABLE map_training_tag ADD CONSTRAINT FK_1024D24BEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE training_tag ADD CONSTRAINT FK_9937C0CABAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE training_tag ADD CONSTRAINT FK_9937C0CABEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id) ON DELETE CASCADE');
    }
}
