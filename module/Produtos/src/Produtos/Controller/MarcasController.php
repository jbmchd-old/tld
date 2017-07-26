<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Produtos\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class MarcasController extends GenericController
{  
    public function buscaFornecedoresAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) { return false; }

        $srv = $this->app()->getEntity('VFornecedores');
        $result = $srv->getAll()['table'];
        
        return new JsonModel($result);
    }
    
    public function buscaMarcasAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) { return false; }
        $dados = $request->getPost()->toArray();
        
        $srv = $this->app()->getEntity('ProdutosMarcas');
        $result = $srv->getAllByFornecedorId($dados['fornecedor_id'])['table'];
        return new JsonModel($result);
    }
    
    public function salvarAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) { return false; }

        $dados = $request->getPost()->toArray();
        try {
            $srv_pessoas = $this->app()->getEntity('ProdutosMarcas');
            $entity = $srv_pessoas->create($dados);
            $result = $srv_pessoas->save($entity);
            return new JsonModel($result->toArray());
            
        } catch (\Exception $exc) {
            return new JsonModel(['error'=>'1', 'message'=>$exc->getMessage()]);
        }
    }
    
}
