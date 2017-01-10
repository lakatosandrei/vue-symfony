<?php
/**
 * Created by PhpStorm.
 * User: andreilakatos
 * Date: 08/01/17
 * Time: 19:49
 */

namespace BackendBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;


class DataController extends Controller
{
    /**
     * @Route("/data")
     */
    public function dataAction()
    {
        $json_data = file_get_contents(__DIR__."/../Resources/JSON/data.json");
        $response = new Response();
        $response->setContent($json_data);
        $response->headers->set('Content-Type', 'application\json');

        return $response;
    }

}