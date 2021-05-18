<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;


class ExportTest extends WebTestCase
{
    use Connection;

    public function setUp()
    {
        $this->client = static::createClient();
    }

    public function testAttemptScormExport()
    {
        $this->createAuthorizedClient();


        $this->client->request('POST', '/training/export/scorm', [], [], ['HTTP_X-CREA-KEY' => hash_hmac('SHA256','/training/export/scorm',$_ENV['HASH_KEY']).':'.$this->apiKey,'CONTENT_TYPE' => 'application/json'], '{"id": 1,"monograin": false}');

        $this->assertEquals(201, $this->client->getResponse()->getStatusCode());
    }

    public function testAttemptScormMonoGrainExport()
    {
        $this->createAuthorizedClient();


        $this->client->request('POST', '/training/export/scorm', [], [], ['HTTP_X-CREA-KEY' => hash_hmac('SHA256','/training/export/scorm',$_ENV['HASH_KEY']).':'.$this->apiKey,'CONTENT_TYPE' => 'application/json'], '{"id": 1}');

        $this->assertEquals(201, $this->client->getResponse()->getStatusCode());
    }

}