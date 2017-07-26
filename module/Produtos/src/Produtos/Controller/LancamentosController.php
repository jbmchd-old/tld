<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Produtos\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class LancamentosController extends GenericController
{  
    public function buscaMarcasAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) { return false; }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VProdMarcas');
        $result = $srv->getAllByFornecedorId($dados['fornecedor_id'])['table'];
        return new JsonModel($result);
    }
    
    public function buscaProdutosAction() {
       $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VProdutos');
        $prod = $srv->getAllByFornecedorId($dados['fornecedor_id'])['table'];
        return new JsonModel($prod);
    }
    
    public function salvarAction() {
        
        $request = $this->getRequest();

        if (!$request->isPost()) { return false; }

        $dados = $request->getPost()->toArray();

        if($dados['id']>0){
            $dados['dtaalteracao'] = (new \DateTime())->format('Y-m-d H:m:i');
        } else {
            $dados['dtainclusao'] = (new \DateTime())->format('Y-m-d H:m:i');
        }
        
        $dados['precocusto'] = trim(str_replace(',', '.', str_replace('.', '', str_replace('R$', '', $dados['precocusto']))));
        $dados['precovenda'] = trim(str_replace(',', '.', str_replace('.', '', str_replace('R$', '', $dados['precovenda']))));
        
        try {
            $srv_pessoas = $this->app()->getEntity('Produtos');
            $entity = $srv_pessoas->create($dados);
            
            $result = $srv_pessoas->save($entity);
            
            return new JsonModel($result->toArray());
            
        } catch (\Exception $exc) {
            return new JsonModel(['error'=>'1', 'message'=>$exc->getMessage()]);
        }

    }
}
