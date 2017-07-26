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
            'manutencao_home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/manut',
                    'defaults' => [
                        'controller' => 'Manutencao\Controller\Lancamentos',
                        'action'     => 'index',
                    ],
                ],
            ],
            'manut-lancamentos' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/manut[/:action[/:id]]',
                    'defaults' => [
                        'controller' => 'Manutencao\Controller\Lancamentos',
                        'action'     => 'index',
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [ 
        'invokables' => [ 
            'Manutencao\Controller\Lancamentos' => 'Manutencao\Controller\LancamentosController',
            'Manutencao\Controller\Detalhamentos' => 'Manutencao\Controller\DetalhamentosController',
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'telas/manutencao/lancamentos'    => __DIR__ . '/../view/manutencao/telas/lancamentos.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    ],
];
