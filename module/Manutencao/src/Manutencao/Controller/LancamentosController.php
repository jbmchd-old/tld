<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Manutencao\Controller;

use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Zf2ServiceBase\Controller\GenericController;

class LancamentosController extends GenericController {

    public function exibeOsAction(){
        
        $id = $this->params()->fromRoute('id');
        
        $srv = $this->app()->getEntity('VManutOs');
        $result = $srv->getAllById($id)['table'];
        
        $os_itens = [];
        foreach ($result as $os) {
            $prod_id=$os['prod_id'];
            $os_itens[$prod_id]['id'] = $os['prod_id'];
            $os_itens[$prod_id]['quant'] = $os['prod_quant'];
            $os_itens[$prod_id]['precovenda'] = $os['prod_precovenda'];
            $os_itens[$prod_id]['precototal'] = $os['prod_precototal'];
            $os_itens[$prod_id]['descricao'] = $os['prod_descricao'];
        }

        return new ViewModel([
            'os'=>$result,
            'os_itens'=>$os_itens,
        ]);
    }

    public function buscaClientesAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('Pessoas', 'VClientes');
        $result = $srv->getAll()['table'];

        return new JsonModel($result);
    }

    public function buscaOrdensServicoAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();

        $srv = $this->app()->getEntity('VManutencao');
        $result = $srv->getAllByClienteId($dados['cliente_id'])['table'];
        
        return new JsonModel($result);
    }

    public function buscaOrdemServicoAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();

        $srv = $this->app()->getEntity('VManutencaoItens');
        $result = $srv->getAllById($dados['id'])['table'];

        $os = [];
        foreach ($result as $cada) {
            $os['id']=$cada['id'];
            $os['empresa_id']=$cada['empresa_id'];
            $os['funcionario_id']=$cada['funcionario_id'];
            $os['cliente_id']=$cada['cliente_id'];
            $os['veiculo_id']=$cada['veiculo_id'];
            $os['lancamento_id']=$cada['lancamento_id'];
            $os['ordemservico']=$cada['ordemservico'];
            $os['descricao']=$cada['descricao'];
            $os['dtainclusao']=$cada['dtainclusao'];
            $os['precomaodeobra']=$cada['precomaodeobra'];
            $os['percdesc']=$cada['percdesc'];
            $os['precototalos']=$cada['precototalos'];
            $os['dtaalteracao']=$cada['dtaalteracao'];
            $os['obs']=$cada['obs'];
            $os['empresa']=$cada['empresa'];
            $os['funcionario']=$cada['funcionario'];
            $os['cliente']=$cada['cliente'];
            $os['placa']=$cada['placa'];
            $os['produtos'][$cada['produto_id']]['produto_id']=$cada['produto_id'];
            $os['produtos'][$cada['produto_id']]['produto']=$cada['produto'];
            $os['produtos'][$cada['produto_id']]['quantidade']=$cada['quantidade'];
            $os['produtos'][$cada['produto_id']]['precovenda_unit']=$cada['precovenda_unit'];
            $os['produtos'][$cada['produto_id']]['precototal']=$cada['precototal'];
            $os['produtos'][$cada['produto_id']]['produto']=$cada['produto'];
        }
        return new JsonModel($os);
    }

    public function buscaVeiculosAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();

        $srv = $this->app()->getEntity('Pessoas', 'VVeiculos');
        $result = $srv->getAllByPessoasId($dados['cliente_id'])['table'];

        return new JsonModel($result);
    }

    public function buscaProdutosAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $srv = $this->app()->getEntity('Produtos', 'VProdutos');
        $result = $srv->getAll()['table'];

        $datasource = [];
        foreach ($result as $produto) {
            if($produto['quantidade'] < 1){continue;}
            $datasource[] = $produto['id'] . ' - ' . ($produto['codigoauxiliar'] ? $produto['codigoauxiliar'] . ' - ' : '') . $produto['descricao'] . ' (' . $produto['quantidade'] . ')';
        }

        return new JsonModel($datasource);
    }

    public function buscaProdutoAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();

        $srv = $this->app()->getEntity('Produtos', 'VProdutos');
        $result = $srv->getAllById($dados['id'])['table'];

        return new JsonModel($result[0]);
    }

    public function salvarAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        
        $dados['empresa_id'] = $this->sessao()->getArrayCopy('usuario')['empresa_id'];
        $dados['funcionario_id'] = $this->sessao()->getArrayCopy('usuario')['pessoas_id'];
        $dados['ordemservico'] = 'OS' . (new \DateTime())->format('ymdHis');

        if ($dados['id']) {
            $dados['dtaalteracao'] = (new \DateTime())->format('Y-m-d H:i:s');
        } else {
            $dados['dtainclusao'] = (new \DateTime())->format('Y-m-d H:i:s');
        }
        
        unset($dados['cliente_id']);
        /* salva manutencao */
        $srv_manut = $this->app()->getEntity('Manutencao');
        $result = $srv_manut->salvaManutencaoProdutos($dados);

        return new JsonModel($result);
    }

}
