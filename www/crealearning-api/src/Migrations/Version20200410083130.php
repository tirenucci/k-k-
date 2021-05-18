<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200410083130 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE training_lang ADD quiz_truefalse_invalid VARCHAR(255) NOT NULL, ADD quiz_qcm_invalid VARCHAR(255) NOT NULL, ADD quiz_cloze_invalid VARCHAR(255) NOT NULL, ADD quiz_numeric_invalid VARCHAR(255) NOT NULL, ADD quiz_likert_invalid VARCHAR(255) NOT NULL, ADD quiz_match_invalid VARCHAR(255) NOT NULL, ADD quiz_confirmation VARCHAR(255) NOT NULL, ADD match_category_title VARCHAR(255) NOT NULL, ADD feedback_correct_label VARCHAR(255) NOT NULL, ADD feedback_incorrect_label VARCHAR(255) NOT NULL, ADD answer_true_label VARCHAR(255) NOT NULL, ADD answer_false_label VARCHAR(255) NOT NULL, ADD likert_label VARCHAR(255) NOT NULL, ADD likert_no_answer_label VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE training_lang DROP quiz_truefalse_invalid, DROP quiz_qcm_invalid, DROP quiz_cloze_invalid, DROP quiz_numeric_invalid, DROP quiz_likert_invalid, DROP quiz_match_invalid, DROP quiz_confirmation, DROP match_category_title, DROP feedback_correct_label, DROP feedback_incorrect_label, DROP answer_true_label, DROP answer_false_label, DROP likert_label, DROP likert_no_answer_label');
    }
}
