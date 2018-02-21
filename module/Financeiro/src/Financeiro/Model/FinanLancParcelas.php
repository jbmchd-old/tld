<?php

namespace Financeiro\Model;

use ZeDb\Model;

class FinanLancParcelas extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }
    
    public function atualizaParcelasOfx($parcelas){
        $result = [];
        
        $array_aux = [];
        $this->beginTransaction();
        $sql='';
        foreach ($parcelas as $parcela) {
            $parcela['dtapagamento'] = implode('-', array_reverse(explode('/', $parcela['dtapagamento'])));
            $sql .= "UPDATE {$this->tableName} SET dtapagamento='{$parcela['dtapagamento']}', situacao='P', obs='Atualizado via importação OFX' WHERE id={$parcela['id']}; ";
        }
        $result = $this->executeSql($sql);
        $this->commit();
        
        return $result;
    }
}