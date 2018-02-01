<?php

namespace Manutencao\Model;

use ZeDb\Model;

class Manutencao extends Model {

    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }

    public function salvaManutencaoProdutos(array $manutencao) {

        $this->beginTransaction();

        $result = [];
        $itens = $manutencao['produtos'];
        unset($manutencao['produtos']);
        $result = $this->salvaManutencao($manutencao);

        if ($result['id'] > 0) {
            $result = $this->salvaProdutos($itens, $result['id']);
            if ($result['error']) {
                $this->rollback();
                return $result;
            }
        } else {
            $this->rollback();
            return $result;
        }
        $this->commit();
        return $result;
    }

    public function salvaManutencao(array $manutencao) {
        $entity = $this->create($manutencao);
        return $this->save($entity)->toArray();
    }

    public function salvaProdutos(array $itens, $manutencao_id) {
        
        $result = [];
        $sql = "select * from manutencao_itens where manutencao_id=$manutencao_id";
        $temp = $this->executeSql($sql)['table'];
        
        $itens_existentes = [];
        $atualizar_estoque = [];
        foreach ($temp as $cada) {
            $itens_existentes[$cada['produto_id']] = [
                'id' => $cada['id'],
                'produto_id' => $cada['produto_id'],
                'quantidade' => $cada['quantidade'],
            ];
        }
        
        $itens_organizados = [
            'insert' => array_diff_key($itens, $itens_existentes),
            'delete' => array_diff_key($itens_existentes, $itens),
            'update' => array_intersect_key($itens, $itens_existentes)
        ];
        
        foreach ($itens_organizados as $acao => $itens) {
            
            foreach ($itens as $item) {
                $item_produtoid = $item['produto_id'];
                
                $produto = $this->buscaProduto($item_produtoid);
                if ($produto['error']) {break;}
                $produto = $produto['table'][0];

                $item_completo = [
                    'manutencao_id' => $manutencao_id,
                    'produto_id' => $item_produtoid,
                    'quantidade' => $item['quantidade'],
                    'precocusto_unit' => $produto['precocusto'],
                    'precovenda_unit' => $produto['precovenda'],
                    'precototal' => $produto['precovenda'] * $item['quantidade'],
                ];
                
                switch ($acao){
                    case 'insert':
                        $result = $this->insertItem($item_completo);
                        $atualizar_estoque[$item_produtoid] = $produto['quantidade']-$item_completo['quantidade'];
                        break;
                    case 'update':
                        $item_id = $itens_existentes[$item_produtoid]['id'];
                        $result = $this->updateItem($item_completo, $item_id);
                        $atualizar_estoque[$item_produtoid] = $produto['quantidade'] + ($itens_existentes[$item_produtoid]['quantidade']-$item_completo['quantidade']);
                        break;
                    case 'delete':
                        $result = $this->deleteItem($item['id']);
                        $atualizar_estoque[$item_produtoid] = $produto['quantidade'] + $item_completo['quantidade'];
                        break;
                }
                
                if ($result['error']) {break;}   
            }
            if ($result['error']) {break;}
        }

        if ( ! $result['error']) {
            $result = $this->atualizaEstoque($atualizar_estoque);
        }
        
        return $result;
    }

    private function updateItem(array $item, $item_id) {
        $array_aux = [];
        foreach ($item as $column => $value) {
            $array_aux[] = "$column='$value'";
        }
        $sql = "UPDATE manutencao_itens SET " . implode(',', $array_aux) . " WHERE id=$item_id";
        return $this->executeSql($sql);
    }

    private function insertItem(array $item) {
        $columns = implode(",", array_keys($item));
        $values = "'" . implode("','", $item) . "'";
        $sql = "INSERT INTO manutencao_itens ($columns) VALUES ($values)";
        return $this->executeSql($sql);
    }

    private function deleteItem($item_id) {
        $sql = "DELETE FROM manutencao_itens WHERE id=$item_id";
        return $this->executeSql($sql);
    }

    private function buscaProduto($id) {
        $sql = "select * from produtos where id=$id";
        $result = $this->executeSql($sql);
        return $result;
    }

    private function atualizaEstoque(array $itens) {
        foreach ($itens as $produto_id => $quant) {
            $sql = "UPDATE produtos SET quantidade=$quant WHERE id=$produto_id";
            $result = $this->executeSql($sql);
            if ($result['error']) {break;}
        }
        return $result;
    }

}
