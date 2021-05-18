<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200116151623 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE training_lang (id INT AUTO_INCREMENT NOT NULL, label_fr VARCHAR(25) NOT NULL, label_en VARCHAR(25) NOT NULL, label VARCHAR(25) NOT NULL, iso_code_6393 VARCHAR(10) NOT NULL, iso_code_6391 VARCHAR(10) NOT NULL, encode VARCHAR(10) NOT NULL, position INT NOT NULL, vue_flag INT NOT NULL, labels LONGTEXT NOT NULL, active TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE training_language MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE training_language DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE training_language ADD training_id INT NOT NULL, ADD language_id INT NOT NULL, DROP id, DROP label_fr, DROP label_en, DROP label, DROP iso_code_6393, DROP iso_code_6391, DROP encode, DROP position, DROP vue_flag, DROP labels, DROP active');
        $this->addSql('ALTER TABLE training_language ADD CONSTRAINT FK_33BE6222BEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE training_language ADD CONSTRAINT FK_33BE622282F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_33BE6222BEFD98D1 ON training_language (training_id)');
        $this->addSql('CREATE INDEX IDX_33BE622282F1BAF4 ON training_language (language_id)');
        $this->addSql('ALTER TABLE training_language ADD PRIMARY KEY (training_id, language_id)');
        $this->addSql('ALTER TABLE label CHANGE id id INT AUTO_INCREMENT NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE training_lang');
        $this->addSql('ALTER TABLE label CHANGE id id INT NOT NULL');
        $this->addSql('ALTER TABLE training_language DROP FOREIGN KEY FK_33BE6222BEFD98D1');
        $this->addSql('ALTER TABLE training_language DROP FOREIGN KEY FK_33BE622282F1BAF4');
        $this->addSql('DROP INDEX IDX_33BE6222BEFD98D1 ON training_language');
        $this->addSql('DROP INDEX IDX_33BE622282F1BAF4 ON training_language');
        $this->addSql('ALTER TABLE training_language ADD id INT AUTO_INCREMENT NOT NULL, ADD label_fr VARCHAR(25) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD label_en VARCHAR(25) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD label VARCHAR(25) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD iso_code_6393 VARCHAR(10) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD iso_code_6391 VARCHAR(10) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD encode VARCHAR(10) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD position INT NOT NULL, ADD vue_flag INT NOT NULL, ADD labels LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD active TINYINT(1) NOT NULL, DROP training_id, DROP language_id, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
    }
}
