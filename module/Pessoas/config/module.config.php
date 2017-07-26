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
            'pessoas_home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/pessoas',
                    'defaults' => [
                        'controller' => 'Pessoas\Controller\Pessoas',
                        'action'     => 'index',
                    ],
                ],
            ],
            'pessoas' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/pessoas[/:action]',
                    'defaults' => [
                        'controller' => 'Pessoas\Controller\Pessoas',
                        'action'     => 'index',
                    ],
                ],
            ],
            'funcionarios' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/funcionarios[/:action]',
                    'defaults' => [
                        'controller' => 'Pessoas\Controller\Funcionarios',
                        'action'     => 'index',
                    ],
                ],
            ],
            'veiculos' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/veiculos[/:action]',
                    'defaults' => [
                        'controller' => 'Pessoas\Controller\Veiculos',
                        'action'     => 'index',
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [ 
        'invokables' => [ 
            'Pessoas\Controller\Pessoas' => 'Pessoas\Controller\PessoasController',
            'Pessoas\Controller\Funcionarios' => 'Pessoas\Controller\FuncionariosController',
            'Pessoas\Controller\Veiculos' => 'Pessoas\Controller\VeiculosController',
            
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'telas/pessoas'         => __DIR__ . '/../view/pessoas/telas/pessoas.phtml',
            'telas/funcionarios'    => __DIR__ . '/../view/pessoas/telas/funcionarios.phtml',
            'telas/veiculos'        => __DIR__ . '/../view/pessoas/telas/veiculos.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ],
];
