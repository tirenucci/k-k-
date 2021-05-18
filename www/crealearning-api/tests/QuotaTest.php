<?php

namespace App\Tests;

use App\Service\QuotaService;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;


class QuotaTest extends WebTestCase
{
    use Connection;

    public function setUp()
    {
        $this->client = static::createClient();
    }
    
    public function testAttemptGetQuota()
    {
        $this->createAuthorizedClient();
        
        $quotaService = static::$container->get(QuotaService::class);

        if ($quotaService->setSpaceDiskUsedSociety($_ENV['UPLOAD_PATH'] . '/1'))
        {
            $this->assertTrue(true);
        }
    }

}