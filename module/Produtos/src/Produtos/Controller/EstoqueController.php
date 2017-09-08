<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Produtos\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class EstoqueController extends GenericController
{  
    public function buscaCategoriasAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('Produtos','ProdutosCategorias');
        $result = $srv->getAll()['table'];
        return new JsonModel($result);
    }
    
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
        $srv = $this->app()->getEntity('VProdMarcas');
//        $result = $srv->getAll()['table'];
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
        
        if(!$dados['fornecedor_id']>0 && !$dados['marca_id']>0 && !$dados['categoria_id']>0){
            $prod = $srv->getAll()['table'];
        } else {
            $columns = [];
            if($dados['fornecedor_id']>0){$columns['fornecedor_id']=$dados['fornecedor_id'];}
            if($dados['marca_id']>0){$columns['marca_id']=$dados['marca_id'];}
            if($dados['categoria_id']>0){$columns['categoria_id']=$dados['categoria_id'];}        
            $prod = $srv->getAllByColumns($columns)['table'];
        }
        
        
        $datasource = [];
        foreach ($prod as $produto) {
            if($produto['quantidade'] < 1){continue;}
            $datasource[] = $produto['id'] . ' - ' . ($produto['codigoauxiliar'] ? $produto['codigoauxiliar'] . ' - ' : '') . $produto['descricao'];
        }

        return new JsonModel(['produtos'=>$prod, 'autocomplete'=>$datasource]);
    }
    
    public function buscaProdutoAction() {
       $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VProdutos');
        $prod = $srv->getAllById($dados['id'])['table'][0];
        return new JsonModel($prod);
    }
    
}
