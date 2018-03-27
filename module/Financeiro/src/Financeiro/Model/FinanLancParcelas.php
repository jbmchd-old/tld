<?php

namespace Financeiro\Model;

use ZeDb\Model;

class FinanLancParcelas extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }
    
    public function atualizaParcelasOfx($transacoes){
        $result = [];
        
        $array_aux = [];
        $this->beginTransaction();
        $sql='';
        foreach ($transacoes as $parcela) {
            foreach ($parcela['id'] as $id) {
                $parcela['dtapagamento'] = implode('-', array_reverse(explode('/', $parcela['dtapagamento'])));
                $sql .= "UPDATE {$this->tableName} SET dtapagamento='{$parcela['dtapagamento']}', situacao='P', obs='Atualizado via importação OFX' WHERE id=$id; ";
            }
        }
        $result = $this->executeSql($sql);
        $this->commit();
        
        return $result;
    }
}