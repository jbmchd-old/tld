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
        $tela_origem = $dados['tela_origem'];
        
        foreach ($dados['parcelas'] as $num_parcela => $parcela) {
            $dados['dtainclusao'] = (new \DateTime())->format('Y-m-d H:i:s');
            
            $dados['parcelas'][$num_parcela]['num'] = $num_parcela;
            
            if(!strlen($parcela['dtapagamento'])){
                $dados['parcelas'][$num_parcela]['situacao']='A';
                unset($dados['parcelas'][$num_parcela]['dtapagamento']);
            }

            if (substr_count($parcela['valor'], ',') > 0) {
                $dados['parcelas'][$num_parcela]['valor'] = str_replace(',', '.', str_replace('.', '', $parcela['valor']));
            }
        }
        unset($dados['tela_origem']);
        
        $srv = $this->app()->getEntity('FinanLancamentos');
        $result = $srv->insereLancamentoParcelas([$dados]);
        
        switch ($tela_origem['nome']){
            case 'manutencao':
                $os_id = $tela_origem['id'];
                $srv = $this->app()->getEntity('Manutencao','Manutencao');
                
                $os = $srv->getById($os_id)['table']->toArray();
                $os['lancamento_id']=$result['lanc_id'];
                
                $entity = $srv->create($os);
                $result['manutencao'] = $srv->save($entity)->toArray();
        }
        
        $result['registros'] = sizeof($dados);
        
        return new JsonModel($result);
    }

    public function buscaUltimosLancamentosAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VFinanLancamentos');
        $result = $srv->buscaUltimos()['table'];

        return new JsonModel($result);
    }

    public function buscaLancamentoAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();

        $srv = $this->app()->getEntity('VFinanLancamentos');
        $result = $srv->getAllById($dados['id'])['table'];
        $array = [];
        foreach ($result as $cada) {
            $num_parc = $cada['num'];
            $array['id'] = $cada['id'];
            $array['caixa_id'] = $cada['caixa_id'];
            $array['categoria_id'] = $cada['categoria_id'];
            $array['descricao'] = $cada['descricao'];
            $array['tipo'] = $cada['tipo'];
            $array['parcelas'][$num_parc]['id'] = $cada['parcela_id'];
            $array['parcelas'][$num_parc]['dtavencimento'] = $cada['dtavencimento'];
            $array['parcelas'][$num_parc]['valor'] = $cada['valor'];
            $array['parcelas'][$num_parc]['situacao'] = $cada['situacao'];
            $array['parcelas'][$num_parc]['dtapagamento'] = $cada['dtapagamento'];
            $array['parcelas'][$num_parc]['formapagto'] = $cada['formapagto'];
        }
        
        return new JsonModel($array);
    }

}
