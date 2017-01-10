<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class SPController extends Controller
{
    /**
     * @Route("/")
     */
    public function displayAction()
    {
        return $this->render('AppBundle:SP:display.html.twig');
    }

}
