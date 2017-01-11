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
     * @Route("/data/{page}/{pageSize}")
     */
    public function dataAction($page = null, $pageSize = null)
    {
        // Converting parameters to integer
        $page = intval($page);
        $pageSize = intval($pageSize);

        // Creating a Response object
        $response = new Response();

        //Fetching the JSON
        $json_data = file_get_contents(__DIR__ . "/../Resources/JSON/data.json");

        // Pagination, if needed
        if ($page && $pageSize) {
            $json_decoded = json_decode($json_data, true);

            // In case we don't have any more data, we let the front end know
            if (sizeof($json_decoded['collections']['patient']) <= ($page * $pageSize)) {
                $json_decoded['data_over'] = true;
            }

            $json_decoded['collections']['patient'] = array_slice($json_decoded['collections']['patient'], ($page - 1) * $pageSize, $pageSize);
            $json_data = json_encode($json_decoded);
        }

        // Setting the JSON Response
        $response->setContent($json_data);
        $response->headers->set('Content-Type', 'application\json');

        return $response;
    }

}