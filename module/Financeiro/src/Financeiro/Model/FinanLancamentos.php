<?php

namespace Financeiro\Model;

use ZeDb\Model;

class FinanLancamentos extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }
    
    public function insereLancamentoParcelas(array $lancamentos){
        
        $this->beginTransaction();
        
        $result = [];
        foreach ($lancamentos as $lanc) {
            $parcelas = $lanc['parcelas'];
            unset($lanc['parcelas']);
            $result = $this->insereLancamento($lanc);
            
            if ( ! $result['error']) {
                $result = $this->insereParcelas($parcelas, $result['lastId']);
                if($result['error']){
                    $this->rollback();
                    return $result;
                }
            } else {
                $this->rollback();
                return $result;
            }    
        }
        
        $this->commit();
        return $result;   
    }
    
    public function insereLancamento(array $lancamento){
        $columns = implode(",", array_keys($lancamento));
        $values = "'".implode("','", $lancamento)."'";

        $sql = "INSERT INTO $this->tableName ($columns) VALUES ($values)";
        return $this->executeSql($sql);
    }

    public function insereParcelas(array $parcelas, $lancamento_id){
        $result = [];
        foreach ($parcelas as $parcela) {
            $parcela['lancamentos_id']=$lancamento_id;
            
            $columns = implode(",", array_keys($parcela));
            $values = "'".implode("','", $parcela)."'";

            $sql = "INSERT INTO finan_lanc_parcelas ($columns) VALUES ($values)";
            $result = $this->executeSql($sql);
            if($result['error']){break;}
        }
        return $result;      
    }
    
}