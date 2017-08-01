<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Financeiro\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class LancamentosController extends GenericController {

    public function salvarAction() {
    
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $dados = $request->getPost()->toArray();
        $dados['dtainclusao'] = (new \DateTime())->format('Y-m-d H:i:s');
        $dados['dtapagamento'] = ($dados['dtapagamento'])?$dados['dtapagamento']:null;
//        $dados['tipopagamento'] = ($dados['dtapagamento'])?$dados['tipopagamento']:null;

        if(substr_count($dados['valor'], ',')>0){
            $dados['valor'] = str_replace(',', '.', str_replace('.', '', $dados['valor']));
        }
//        echo '<pre>';
//        print_r($dados);
//        die();
        $srv = $this->app()->getEntity('FinanLancamentos');
        $entity = $srv->create($dados);

        $result = $srv->save($entity);
        
        return new JsonModel(['ok' => is_object($result)]);        
    }
    
    public function buscaUltimosLancamentosAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VFinanLancamentos');        
        $result = $srv->buscaUltimos()['table'];

        return new JsonModel($result);
    }

    public function buscaLancamentoAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();

        $srv = $this->app()->getEntity('VFinanLancamentos');
        $result = $srv->getAllById($dados['id'])['table'];

        return new JsonModel($result[0]);
    }

}
