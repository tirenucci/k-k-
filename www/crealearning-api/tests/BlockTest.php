<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;


class BlockTest extends WebTestCase
{
    use Connection;

    public function setUp()
    {
        $this->client = static::createClient();
    }

    public function testAttemptCreateBlock()
    {
        $this->createAuthorizedClient();


        $this->client->request('POST', '/block/save', [], [], ['HTTP_X-CREA-KEY' => hash_hmac('SHA256','/block/save',$_ENV['HASH_KEY']).':'.$this->apiKey,'CONTENT_TYPE' => 'application/json'], '{"grain_id": 1,"lang": "fr","media": false,"newBlock": false, "type":"_TITLE", "position": 5,"options":{"similar":false, "level": "h2", "text": "Ceci est un test"}}');

        $this->assertEquals(201, $this->client->getResponse()->getStatusCode());

        $this->assertRegExp('/xml version/', html_entity_decode($this->client->getResponse()->getContent(), ENT_COMPAT, "UTF-8"));
        $this->assertRegExp('/level_fr/', html_entity_decode($this->client->getResponse()->getContent(), ENT_COMPAT, "UTF-8"));
        $this->assertRegExp('/Ceci est un test/', html_entity_decode($this->client->getResponse()->getContent(), ENT_COMPAT, "UTF-8"));
    }

    public function testAttemptGetPropertiesOfTitleAndImageBlock()
    {
        $this->createAuthorizedClient();

        $this->client->request('GET', '/block/get?id=3&lang=fr', [], [], ['HTTP_X-CREA-KEY' => hash_hmac('SHA256','/block/get?id=3&lang=fr',$_ENV['HASH_KEY']).':'.$this->apiKey,'CONTENT_TYPE' => 'application/json']);

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $this->assertRegexp('/options/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/url/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/https:/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/alt/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/scale/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/position/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/type/', $this->client->getResponse()->getContent());


        $this->client->request('GET', '/block/get?id=5&lang=fr', [], [], ['HTTP_X-CREA-KEY' => hash_hmac('SHA256','/block/get?id=5&lang=fr',$_ENV['HASH_KEY']).':'.$this->apiKey,'CONTENT_TYPE' => 'application/json']);

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertRegexp('/options/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/level/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/text/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/Ceci est un test/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/_TITLE/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/type/', $this->client->getResponse()->getContent());
        $this->assertRegexp('/position/', $this->client->getResponse()->getContent());
    }

    public function testAttemptDelete()
    {
        $this->createAuthorizedClient();


        $this->client->request('DELETE', '/block/delete', [], [], ['HTTP_X-CREA-KEY' => hash_hmac('SHA256','/block/delete',$_ENV['HASH_KEY']).':'.$this->apiKey,'CONTENT_TYPE' => 'application/json'], '{"id": 5}');

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());


        $this->client->request('GET', '/block/get?id=5&lang=fr', [], [], ['HTTP_X-CREA-KEY' => hash_hmac('SHA256','/block/get?id=5&lang=fr',$_ENV['HASH_KEY']).':'.$this->apiKey,'CONTENT_TYPE' => 'application/json'], '{"id": 5, "lang": "fr"}');

        $this->assertEquals(404, $this->client->getResponse()->getStatusCode());

        $this->assertNotRegExp('/options/', $this->client->getResponse()->getContent());
        $this->assertNotRegExp('/level/', $this->client->getResponse()->getContent());
        $this->assertNotRegExp('/text/', $this->client->getResponse()->getContent());
        $this->assertNotRegExp('/Ceci est un test/', $this->client->getResponse()->getContent());
        $this->assertNotRegExp('/_TITLE/', $this->client->getResponse()->getContent());
        $this->assertNotRegExp('/type/', $this->client->getResponse()->getContent());
        $this->assertNotRegExp('/position/', $this->client->getResponse()->getContent());
    }


}