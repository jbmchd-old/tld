<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Financeiro\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class CategoriasController extends GenericController {
    
    public function buscaTodasCategoriasPaiAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('VFinanTodasCategoriaspai');
        $result = $srv->getAll()['table'];
        
        return new JsonModel($result);
    }
    
    public function buscaCategoriasPaiAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('VFinanCategoriaspai');
        $result = $srv->getAll()['table'];
        
        return new JsonModel($result);
    }
    
    public function buscaTodasCategoriasFilhosAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('VFinanTodasCategoriasfilhos');
        $result = $srv->getAll()['table'];
        
        return new JsonModel($result);
    }
    
    public function buscaCategoriasAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('VFinanCategorias');
        $result = $srv->getAll()['table'];
        
        return new JsonModel($result);
    }
    
    public function salvarCategoriaAction() {
    
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $dados = $request->getPost()->toArray();
        
        $srv = $this->app()->getEntity('FinanCategorias');
        $entity = $srv->create($dados);
        $result = $srv->save($entity);
        
        return new JsonModel(['ok' => is_object($result)]);
        
    }
}
