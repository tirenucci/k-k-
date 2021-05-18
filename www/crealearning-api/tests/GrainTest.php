<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;


class GrainTest extends WebTestCase
{
    use Connection;

    public function setUp()
    {
        $this->client = static::createClient();
    }

    public function testAttemptGenerateOneGrainInHtml()
    {
        $this->createAuthorizedClient();


        $this->client->request('GET', '/grain/generate_html?grain_id=1&language=fr', [], [], ['HTTP_X-CREA-KEY' => hash_hmac('SHA256','/grain/generate_html?grain_id=1&language=fr',$_ENV['HASH_KEY']).':'.$this->apiKey,'CONTENT_TYPE' => 'application/json']);

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $this->assertRegexp('/li/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/img/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/cle-block-box/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/cle-block-img/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/hr/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/cle-block-title/', $this->client->getResponse()->getContent());
    }
}