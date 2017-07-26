<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Pessoas\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class VeiculosController extends GenericController {

    public function buscaPessoasAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('VPessoas');
        $result = $srv->getAll()['table'];
        return new JsonModel($result);
    }
    
    public function buscaTodasMarcasAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) { return false; }

        $srv = $this->app()->getEntity('VeiculosMarcas');
        $result = $srv->getAll()['table'];
        return new JsonModel($result);
    }
    
    public function buscaMarcasAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) { return false; }

        $srv = $this->app()->getEntity('VVeicMarcas');
        $result = $srv->getAll()['table'];
        return new JsonModel($result);
    }

    public function salvarMarcaAction() {
        
        $request = $this->getRequest();

        if (!$request->isPost()) { return false; }

        $dados = $request->getPost()->toArray();
        
        try {
            $srv_pessoas = $this->app()->getEntity('VeiculosMarcas');
            $entity = $srv_pessoas->create($dados);
            $result = $srv_pessoas->save($entity);
            return new JsonModel($result->toArray());
            
        } catch (\Exception $exc) {
            return new JsonModel(['error'=>'1', 'message'=>$exc->getMessage()]);
        }
    }
    
    public function buscaVeiculosAction() {
       $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VVeiculos');
        $veic = $srv->getAllByPessoasId($dados['pessoas_id'])['table'];
        return new JsonModel($veic);
    }
    
    public function salvarAction() {
        
        $request = $this->getRequest();

        if (!$request->isPost()) { return false; }

        $dados = $request->getPost()->toArray();
        
        $dados['placa'] = strtoupper($dados['placa']);
        $dados['cor'] = strtoupper($dados['cor']);
        
        try {
            $srv_pessoas = $this->app()->getEntity('PessoasVeiculos');
            $entity = $srv_pessoas->create($dados);
            $result = $srv_pessoas->save($entity);
            
            return new JsonModel($result->toArray());
            
        } catch (\Exception $exc) {
            return new JsonModel(['error'=>'1', 'message'=>$exc->getMessage()]);
        }

    }
}
