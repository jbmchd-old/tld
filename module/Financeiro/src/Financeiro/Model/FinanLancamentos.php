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
            
            if ($result['id']>0) {
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
        return $result;   
    }
    
    public function insereLancamento(array $lancamento){
        $entity = $this->create($lancamento);
        return $this->save($entity)->toArray();
    }

    public function insereParcelas(array $parcelas, $lancamento_id){
        $result = [];
        foreach ($parcelas as $parcela) {
            $parcela['lancamentos_id']=$lancamento_id;
            $parcela_id = $parcela['id'];
            unset($parcela['id']);
            
            if($parcela_id>0){
                $array_aux = [];
                foreach ($parcela as $column => $value) {
                    $array_aux[] = "$column='$value'";
                }
                $sql = "UPDATE finan_lanc_parcelas SET ". implode(',', $array_aux)." WHERE id=$parcela_id"; 
                $result = $this->executeSql($sql);
            } else {
                $columns = implode(",", array_keys($parcela));
                $values = "'".implode("','", $parcela)."'";
                $sql = "INSERT INTO finan_lanc_parcelas ($columns) VALUES ($values)";
                $result = $this->executeSql($sql);
            }
            
            if($result['error']){break;}
        }
        return $result;      
    }
    
}