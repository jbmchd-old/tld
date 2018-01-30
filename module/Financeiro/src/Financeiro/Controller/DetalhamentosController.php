<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Financeiro\Controller;

use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Zf2ServiceBase\Controller\GenericController;

class DetalhamentosController extends GenericController {

    public function buscaListagemAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VFinanLancamentos');
        $result['lancamentos'] = $srv->buscaListagem($dados['inicio'], $dados['fim'].' 23:29:29',$dados['string'],$dados['caixa_id'],$dados['categoria_id'])['table'];
        $result['resumo'] = $srv->buscaListagemResumo($dados['inicio'], $dados['fim'].' 23:29:29',$dados['string'],$dados['caixa_id'],$dados['categoria_id'])['table'][0];
        $result['categorias'] = $srv->buscaCategorias($dados['inicio'], $dados['fim'].' 23:29:29',$dados['string'],$dados['caixa_id'],$dados['categoria_id'])['table'];
        $result['cheques'] = $srv->buscaCheques($dados['inicio'], $dados['fim'].' 23:29:29',$dados['string'],$dados['caixa_id'],$dados['categoria_id'])['table'];

        return new JsonModel($result);
    }
 
    public function imprimirAction(){
        $dados['string'] = '';
        $dados = array_merge($dados, $this->params()->fromRoute());
        $srv = $this->app()->getEntity('VFinanLancamentos');
        $result['lancamentos'] = $srv->buscaListagem($dados['inicio'], $dados['fim'].' 23:29:29',$dados['string'],$dados['categoria_id'])['table'];
        $result['resumo'] = $srv->buscaListagemResumo($dados['inicio'], $dados['fim'].' 23:29:29',$dados['string'],$dados['categoria_id'])['table'][0];
        return new ViewModel([
            'result'=>$result,
            'dados'=>$dados
        ]);
    }
}
