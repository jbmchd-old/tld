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
        $lanc_id = null;
        foreach ($lancamentos as $lanc) {
            $parcelas = $lanc['parcelas'];
            unset($lanc['parcelas']);
            $result = $this->insereLancamento($lanc);
            
            if ($result['id']>0) {
                $lanc_id = $result['id'];
                $result = $this->insereParcelas($parcelas, $result['id']);
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
        
        $result['lanc_id'] = $lanc_id;
        return $result;   
    }
    
    public function insereLancamento(array $lancamento){
        $entity = $this->create($lancamento);
        return $this->save($entity)->toArray();
    }

    public function insereParcelas(array $parcelas, $lancamento_id){
        $result = [];

        $sql = "DELETE FROM finan_lanc_parcelas WHERE lancamentos_id=$lancamento_id"; 
        $result = $this->executeSql($sql);
        if($result['error']){
            return $result;
        }
        
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