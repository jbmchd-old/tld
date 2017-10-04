<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Bi\Controller;

use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Zf2ServiceBase\Controller\GenericController;

class BiController extends GenericController {

    public function buscaGrafLancamentosAction() {
        
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VBiGrafLancamentos');        
        $result = $srv->getAll()['table'];
        foreach ($result as $cada) {
            $table_chart[$cada['data']]=[
                'R'=>0,
                'D'=>0,
            ];
        }
        
        foreach ($result as $cada) {
            $table_chart[$cada['data']][$cada['tipo']] = floatval($cada['valor']);
        }
        
        return new JsonModel($table_chart);
        
    }

    public function buscaGrafLancamentosCategoriasAction() {
        
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VBiGrafLancCategorias');        
        $result = $srv->getAllByColumns(['data'=>$dados['data'],'tipo'=>$dados['tipo']])['table'];
        
        foreach ($result as $cada) {
            $table_chart[$cada['categoria']]=floatval($cada['valor']);
        }
        
        return new JsonModel($table_chart);
        
    }

    public function buscaGrafFaturamentorealAction() {
        
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VBiGrafFaturamentoreal');        
        $result = $srv->getAll()['table'];
        foreach ($result as $cada) {
            $table_chart[$cada['data']]=[
                'R'=>0,
                'D'=>0,
            ];
        }
        
        foreach ($result as $cada) {
            $table_chart[$cada['data']][$cada['tipo']] = floatval($cada['valor']);
        }
        
        return new JsonModel($table_chart);
        
    }

    public function buscaGrafFaturamentorealCategoriasAction() {
        
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VBiGrafFaturamentorealCategorias');        
        $result = $srv->getAllByColumns(['data'=>$dados['data'],'tipo'=>$dados['tipo']])['table'];
        
        foreach ($result as $cada) {
            $table_chart[$cada['categoria']]=floatval($cada['valor']);
        }
        
        return new JsonModel($table_chart);
        
    }
}
