<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ConnectionTest extends WebTestCase
{
    public function testAttemptConnectionSuccess()
    {
        $client = static::createClient();
        $client->request('POST', '/user/connection', [], [], ['CONTENT_TYPE' => 'application/json'], '{"email": "admin@logipro.com", "password": "admin"}');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testAttemptConnectionFailure()
    {
        $client = static::createClient();
        $client->request('POST', '/user/connection', [], [], ['CONTENT_TYPE' => 'application/json'],'{"email": "admin@logipro.com", "password": "ad"}');
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

}