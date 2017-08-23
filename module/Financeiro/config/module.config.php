<?php

use Zend\Mvc\Router\Http\Literal;
use Zend\Mvc\Router\Http\Segment;

return [
    'router' => [
        'routes' => [
            'financeiro-home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/finan',
                    'defaults' => [
                        'controller' => 'Financeiro\Controller\Lancamentos',
                        'action'     => 'index',
                    ],
                ],
            ],
            'finan-lancamentos' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/finan/lancamentos[/:action]',
                    'defaults' => [
                        'controller' => 'Financeiro\Controller\Lancamentos',
                        'action'     => 'index',
                    ],
                ],
            ],
            'finan-categorias' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/finan/categorias[/:action]',
                    'defaults' => [
                        'controller' => 'Financeiro\Controller\Categorias',
                        'action'     => 'index',
                    ],
                ],
            ],
            'finan-detalhamento' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/finan/detalhamentos[/:action]',
                    'defaults' => [
                        'controller' => 'Financeiro\Controller\Detalhamentos',
                        'action'     => 'index',
                    ],
                ],
            ],
            'finan-imprimir' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/finan/detalhamentos/imprimir[/:inicio][/:fim][/:categoria_id][/:categoria_nome][/:string]',
                    'defaults' => [
                        'controller' => 'Financeiro\Controller\Detalhamentos',
                        'action'     => 'imprimir',
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [ 
        'invokables' => [ 
            'Financeiro\Controller\Lancamentos' => 'Financeiro\Controller\LancamentosController',
            'Financeiro\Controller\Categorias' => 'Financeiro\Controller\CategoriasController',
            'Financeiro\Controller\Detalhamentos' => 'Financeiro\Controller\DetalhamentosController',
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'telas/financeiro/lancamentos'      => __DIR__ . '/../view/financeiro/telas/lancamentos.phtml',
            'telas/financeiro/categorias'       => __DIR__ . '/../view/financeiro/telas/categorias.phtml',
            'telas/financeiro/detalhamentos'    => __DIR__ . '/../view/financeiro/telas/detalhamentos.phtml',
//            'telas/financeiro/sub-lancamentos' => __DIR__ . '/../view/financeiro/telas/subtelas/sub-lancamentos.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    ],
];
