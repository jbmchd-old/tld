<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

use Zend\Mvc\Router\Http\Literal;
use Zend\Mvc\Router\Http\Segment;

return [
    'router' => [
        'routes' => [
            'bi_home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/bi',
                    'defaults' => [
                        'controller' => 'Bi\Controller\Bi',
                        'action'     => 'index',
                    ],
                ],
            ],
            'bi' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/bi[/:action[/:id]]',
                    'defaults' => [
                        'controller' => 'Bi\Controller\Bi',
                        'action'     => 'index',
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [ 
        'invokables' => [ 
            'Bi\Controller\Bi' => 'Bi\Controller\BiController',
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'telas/bi/bi'    => __DIR__ . '/../view/bi/telas/bi.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    ],
];
