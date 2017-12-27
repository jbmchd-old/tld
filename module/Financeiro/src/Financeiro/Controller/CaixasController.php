<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Financeiro\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class CaixasController extends GenericController {
    
    public function buscaTodosCaixasAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('FinanCaixas');
        $result = $srv->getAll()['table'];
        
        return new JsonModel($result);
    }
    
    public function buscaCaixasAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('VFinanCaixas');
        $result = $srv->getAll()['table'];
        
        return new JsonModel($result);
    }
    
    public function salvarCaixaAction() {
    
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $dados = $request->getPost()->toArray();
        
        $srv = $this->app()->getEntity('FinanCaixas');
        $entity = $srv->create($dados);
        $result = $srv->save($entity);
        
        return new JsonModel(['ok' => is_object($result)]);
        
    }
}
