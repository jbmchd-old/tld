<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Pessoas\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class PessoasController extends GenericController {

    public function salvarAction() {
        
        $request = $this->getRequest();

        if (!$request->isPost()) {
            return false;
        }

        $dados = $request->getPost()->toArray();

        $dados['nrodocumento'] = preg_replace('/[^0-9]/', '', $dados['nrodocumento']);
        $dados['dtanascimento'] = implode('-', array_reverse(explode('/', $dados['dtanascimento'])));
        $dados['fone1'] = preg_replace('/[^0-9]/', '', $dados['fone1']);
        $dados['fone2'] = preg_replace('/[^0-9]/', '', $dados['fone2']);
        $dados['status'] = ($dados['status'] == true) ? 'A' : 'I';
        
        if($dados['id']>0){
            $dados['dtaalteracao'] = (new \DateTime())->format('Y-m-d H:m:i');
        } else {
            $dados['dtainclusao'] = (new \DateTime())->format('Y-m-d H:m:i');
        }
        
        try {
            $srv_pessoas = $this->app()->getEntity('Pessoas');
            $entity = $srv_pessoas->create($dados);
            $result = $srv_pessoas->save($entity);
            
            return new JsonModel($result->toArray());
            
        } catch (\Exception $exc) {
            return new JsonModel(['error'=>'1', 'message'=>$exc->getMessage()]);
        }

    }

    public function buscaPessoasAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $srv_tipos_doc = $this->app()->getEntity('Pessoas');
        
        $tipos_doc = $srv_tipos_doc->getAll()['table'];
        return new JsonModel($tipos_doc);
    }
    
    public function buscaPessoaAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv_pes = $this->app()->getEntity('Pessoas');
        $pessoa = $srv_pes->getAllById($dados['id'])['table'];
        
        if(sizeof($pessoa)>0){
            $pessoa[0]['dtanascimento'] = implode('/', array_reverse(explode('-', $pessoa[0]['dtanascimento'])));
        }
        return new JsonModel($pessoa);
    }
}
