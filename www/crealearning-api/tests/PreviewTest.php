<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;


class PreviewTest extends WebTestCase
{
	use Connection;

	public function setUp()
	{
		$this->client = static::createClient();
	}

	public function testAttemptPreviewTraining()
	{

		$this->createAuthorizedClient();


		$this->client->request('GET', '/preview/MSYw', [], [], ['HTTP_X-CREA-KEY' => hash_hmac('sha256', '/preview/MSYw',
				$_ENV['HASH_KEY']) . ':' . $this->apiKey, 'CONTENT_TYPE' => 'application/json']);
		$this->assertRegExp('/"label_fr":"_FR"/', $this->client->getResponse()->getContent());
		$this->assertRegExp('/"image_name":"fr-flag.png","encode":"UTF-8","position":2,"active":true/', $this->client->getResponse()->getContent());
		$this->assertEquals(200, $this->client->getResponse()->getStatusCode());
	}

}