<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200116134823 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE note_grain (id INT AUTO_INCREMENT NOT NULL, grain_id INT DEFAULT NULL, user_id INT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, content LONGTEXT NOT NULL, INDEX IDX_1E36AA26D188E218 (grain_id), INDEX IDX_1E36AA26A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE society (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(200) NOT NULL, quota DOUBLE PRECISION NOT NULL, total_grain_size INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE language (id INT AUTO_INCREMENT NOT NULL, language_code VARCHAR(3) NOT NULL, language VARCHAR(25) NOT NULL, active INT NOT NULL, position INT NOT NULL, INDEX language_code (language_code), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE map_training_tag (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE customer_billing (id INT AUTO_INCREMENT NOT NULL, civility VARCHAR(15) NOT NULL, user_name VARCHAR(100) NOT NULL, company_name VARCHAR(100) DEFAULT NULL, address VARCHAR(100) NOT NULL, address_complement VARCHAR(100) DEFAULT NULL, zip VARCHAR(20) NOT NULL, city VARCHAR(100) NOT NULL, phone VARCHAR(30) DEFAULT NULL, mail VARCHAR(100) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE training (id INT AUTO_INCREMENT NOT NULL, skin_id INT DEFAULT NULL, society_id INT DEFAULT NULL, name VARCHAR(250) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, language_code VARCHAR(3) NOT NULL, version VARCHAR(10) NOT NULL, uuid VARCHAR(36) NOT NULL, license VARCHAR(15) NOT NULL, description LONGTEXT NOT NULL, objective LONGTEXT NOT NULL, educ_means LONGTEXT NOT NULL, tech_means LONGTEXT NOT NULL, management LONGTEXT NOT NULL, achievements LONGTEXT NOT NULL, public_target LONGTEXT NOT NULL, prerequisite LONGTEXT NOT NULL, status VARCHAR(20) NOT NULL, duration INT NOT NULL, content_validation VARCHAR(10) NOT NULL, disk_space DOUBLE PRECISION NOT NULL, show_ponderation TINYINT(1) NOT NULL, logo INT NOT NULL, logo_position VARCHAR(6) NOT NULL, INDEX IDX_D5128A8FF404637F (skin_id), INDEX IDX_D5128A8FE6389D24 (society_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, society_id INT DEFAULT NULL, language_id INT DEFAULT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) DEFAULT NULL, username VARCHAR(200) NOT NULL, registration DATE NOT NULL, uuid VARCHAR(36) NOT NULL, token VARCHAR(255) DEFAULT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, gender VARCHAR(10) NOT NULL, civility VARCHAR(25) NOT NULL, birthday DATE DEFAULT NULL, address VARCHAR(200) DEFAULT NULL, zip VARCHAR(10) DEFAULT NULL, country VARCHAR(30) DEFAULT NULL, cell_phone VARCHAR(30) DEFAULT NULL, phone VARCHAR(30) DEFAULT NULL, function VARCHAR(255) DEFAULT NULL, website VARCHAR(60) DEFAULT NULL, avatar VARCHAR(255) NOT NULL, personal_config LONGTEXT DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), INDEX IDX_8D93D649E6389D24 (society_id), INDEX IDX_8D93D64982F1BAF4 (language_id), INDEX username (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE integrated_object_theme (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(50) NOT NULL, position INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE config (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, value LONGTEXT NOT NULL, type VARCHAR(8) NOT NULL, description LONGTEXT NOT NULL, quota INT NOT NULL, INDEX name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE offer (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(10) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE map_author_training_rights (id INT AUTO_INCREMENT NOT NULL, is_owner TINYINT(1) NOT NULL, edit_settings TINYINT(1) NOT NULL, edit_content TINYINT(1) NOT NULL, edit_notes TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE map_training_language (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE label (id INT AUTO_INCREMENT NOT NULL, language_id INT DEFAULT NULL, text LONGTEXT NOT NULL, INDEX IDX_EA750E882F1BAF4 (language_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE grain (id INT AUTO_INCREMENT NOT NULL, training_id INT DEFAULT NULL, name VARCHAR(100) NOT NULL, score_total VARCHAR(10) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, duration INT NOT NULL, position INT NOT NULL, threshold DOUBLE PRECISION NOT NULL, content_validation VARCHAR(10) NOT NULL, graphic_validation VARCHAR(10) NOT NULL, show_correct_answers TINYINT(1) NOT NULL, INDEX IDX_7B2609F1BEFD98D1 (training_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE training_language (id INT AUTO_INCREMENT NOT NULL, label_fr VARCHAR(25) NOT NULL, label_en VARCHAR(25) NOT NULL, label VARCHAR(25) NOT NULL, iso_code_6393 VARCHAR(10) NOT NULL, iso_code_6391 VARCHAR(10) NOT NULL, encode VARCHAR(10) NOT NULL, position INT NOT NULL, vue_flag INT NOT NULL, labels LONGTEXT NOT NULL, active TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tag (id INT AUTO_INCREMENT NOT NULL, content VARCHAR(250) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE block_grain (id INT AUTO_INCREMENT NOT NULL, grain_id INT DEFAULT NULL, position INT NOT NULL, type VARCHAR(20) NOT NULL, coef DOUBLE PRECISION NOT NULL, question_score DOUBLE PRECISION NOT NULL, code LONGTEXT NOT NULL, INDEX IDX_BC37CF17D188E218 (grain_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE skin_theme (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(50) NOT NULL, position INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE integrated_object (id INT AUTO_INCREMENT NOT NULL, integrated_object_theme_id INT DEFAULT NULL, title VARCHAR(16) NOT NULL, description VARCHAR(250) NOT NULL, url VARCHAR(50) NOT NULL, position INT NOT NULL, INDEX IDX_1D8F510565CF0CAE (integrated_object_theme_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE skin (id INT AUTO_INCREMENT NOT NULL, skin_theme_id INT DEFAULT NULL, name VARCHAR(50) NOT NULL, author VARCHAR(20) NOT NULL, description LONGTEXT DEFAULT NULL, uuid VARCHAR(36) NOT NULL, version VARCHAR(5) NOT NULL, color_name VARCHAR(10) NOT NULL, color_code VARCHAR(7) NOT NULL, status VARCHAR(10) NOT NULL, position INT NOT NULL, INDEX IDX_279681E24F627F9 (skin_theme_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE note_grain ADD CONSTRAINT FK_1E36AA26D188E218 FOREIGN KEY (grain_id) REFERENCES grain (id)');
        $this->addSql('ALTER TABLE note_grain ADD CONSTRAINT FK_1E36AA26A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE training ADD CONSTRAINT FK_D5128A8FF404637F FOREIGN KEY (skin_id) REFERENCES skin (id)');
        $this->addSql('ALTER TABLE training ADD CONSTRAINT FK_D5128A8FE6389D24 FOREIGN KEY (society_id) REFERENCES society (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E6389D24 FOREIGN KEY (society_id) REFERENCES society (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64982F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE label ADD CONSTRAINT FK_EA750E882F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE grain ADD CONSTRAINT FK_7B2609F1BEFD98D1 FOREIGN KEY (training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE block_grain ADD CONSTRAINT FK_BC37CF17D188E218 FOREIGN KEY (grain_id) REFERENCES grain (id)');
        $this->addSql('ALTER TABLE integrated_object ADD CONSTRAINT FK_1D8F510565CF0CAE FOREIGN KEY (integrated_object_theme_id) REFERENCES integrated_object_theme (id)');
        $this->addSql('ALTER TABLE skin ADD CONSTRAINT FK_279681E24F627F9 FOREIGN KEY (skin_theme_id) REFERENCES skin_theme (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE training DROP FOREIGN KEY FK_D5128A8FE6389D24');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649E6389D24');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D64982F1BAF4');
        $this->addSql('ALTER TABLE label DROP FOREIGN KEY FK_EA750E882F1BAF4');
        $this->addSql('ALTER TABLE grain DROP FOREIGN KEY FK_7B2609F1BEFD98D1');
        $this->addSql('ALTER TABLE note_grain DROP FOREIGN KEY FK_1E36AA26A76ED395');
        $this->addSql('ALTER TABLE integrated_object DROP FOREIGN KEY FK_1D8F510565CF0CAE');
        $this->addSql('ALTER TABLE note_grain DROP FOREIGN KEY FK_1E36AA26D188E218');
        $this->addSql('ALTER TABLE block_grain DROP FOREIGN KEY FK_BC37CF17D188E218');
        $this->addSql('ALTER TABLE skin DROP FOREIGN KEY FK_279681E24F627F9');
        $this->addSql('ALTER TABLE training DROP FOREIGN KEY FK_D5128A8FF404637F');
        $this->addSql('DROP TABLE note_grain');
        $this->addSql('DROP TABLE society');
        $this->addSql('DROP TABLE language');
        $this->addSql('DROP TABLE map_training_tag');
        $this->addSql('DROP TABLE customer_billing');
        $this->addSql('DROP TABLE training');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE integrated_object_theme');
        $this->addSql('DROP TABLE config');
        $this->addSql('DROP TABLE offer');
        $this->addSql('DROP TABLE map_author_training_rights');
        $this->addSql('DROP TABLE map_training_language');
        $this->addSql('DROP TABLE label');
        $this->addSql('DROP TABLE grain');
        $this->addSql('DROP TABLE training_language');
        $this->addSql('DROP TABLE tag');
        $this->addSql('DROP TABLE block_grain');
        $this->addSql('DROP TABLE skin_theme');
        $this->addSql('DROP TABLE integrated_object');
        $this->addSql('DROP TABLE skin');
    }
}
