<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Produtos\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class CategoriasController extends GenericController
{  
    public function buscaCategoriasAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) { return false; }
        $dados = $request->getPost()->toArray();
        
        $srv = $this->app()->getEntity('ProdutosCategorias');
        $result = $srv->getAll()['table'];
        return new JsonModel($result);
    }
    
    public function salvarAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) { return false; }

        $dados = $request->getPost()->toArray();
        try {
            $srv_pessoas = $this->app()->getEntity('ProdutosCategorias');
            $entity = $srv_pessoas->create($dados);
            $result = $srv_pessoas->save($entity);
            return new JsonModel($result->toArray());
            
        } catch (\Exception $exc) {
            return new JsonModel(['error'=>'1', 'message'=>$exc->getMessage()]);
        }
    }
    
}
