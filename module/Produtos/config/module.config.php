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
            'produtos_home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/produtos',
                    'defaults' => [
                        'controller' => 'Produtos\Controller\Estoque',
                        'action'     => 'index',
                    ],
                ],
            ],
            'produtos' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/produtos[/:action]',
                    'defaults' => [
                        'controller' => 'Produtos\Controller\Estoque',
                        'action'     => 'index',
                    ],
                ],
            ],
            'produtos-lancamentos' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/produtos/lancamentos[/:action]',
                    'defaults' => [
                        'controller' => 'Produtos\Controller\Lancamentos',
                        'action'     => 'index',
                    ],
                ],
            ],
            'produtos-marcas' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/produtos/marcas[/:action]',
                    'defaults' => [
                        'controller' => 'Produtos\Controller\Marcas',
                        'action'     => 'index',
                    ],
                ],
            ],
            'produtos-categorias' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/produtos/categorias[/:action]',
                    'defaults' => [
                        'controller' => 'Produtos\Controller\Categorias',
                        'action'     => 'index',
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [ 
        'invokables' => [ 
            'Produtos\Controller\Lancamentos' => 'Produtos\Controller\LancamentosController',
            'Produtos\Controller\Estoque' => 'Produtos\Controller\EstoqueController',
            'Produtos\Controller\Marcas' => 'Produtos\Controller\MarcasController',
            'Produtos\Controller\Categorias' => 'Produtos\Controller\CategoriasController',
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'telas/prod/lancamentos'        => __DIR__ . '/../view/produtos/telas/lancamentos.phtml',
            'telas/prod/estoque'        => __DIR__ . '/../view/produtos/telas/estoque.phtml',
            'telas/prod/marcas'        => __DIR__ . '/../view/produtos/telas/marcas.phtml',
            'telas/prod/categorias'        => __DIR__ . '/../view/produtos/telas/categorias.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    ],
];
