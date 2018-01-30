<?php

namespace Financeiro\Model;

use ZeDb\Model;

class VFinanLancamentos extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }
    
    public function buscaUltimos(){
        
        $sql = "select distinct a.id, a.descricao from {$this->tableName} a order by dtaprincipal desc limit 10";
        return $this->executeSql($sql);
    }
    
    public function buscaListagem($data_inicio, $data_fim, $string, $caixa_id, $categoria_id){
        
        $caixa_sql = ($caixa_id>0)?" and caixa_id=$caixa_id":'';
        $categoria_sql = ($categoria_id>0)?" and categoria_id=$categoria_id":'';
        
        $sql = "select * from {$this->tableName} where dtaprincipal between '$data_inicio' and '$data_fim' and descricao like '%$string%' $caixa_sql $categoria_sql order by dtavencimento";
        return $this->executeSql($sql);
        
    }
    
    public function buscaListagemResumo($data_inicio, $data_fim, $string, $caixa_id, $categoria_id){
        
        $caixa_sql = ($caixa_id>0)?" and caixa_id=$caixa_id":'';
        $categoria_sql = ($categoria_id>0)?" and categoria_id=$categoria_id":'';
        
        $sql = "SELECT 
                    (select ifnull(sum(valor),0) from {$this->tableName} where tipo='R' and situacao='A' and descricao like '%$string%' and dtaprincipal between '$data_inicio' and '$data_fim' $caixa_sql $categoria_sql) 'receita_receber',
                    (select ifnull(sum(valor),0) from {$this->tableName} where tipo='R' and situacao='P' and descricao like '%$string%' and dtaprincipal between '$data_inicio' and '$data_fim' $caixa_sql $categoria_sql) 'receita_caixa',

                    (select ifnull(sum(valor),0) from {$this->tableName} where tipo='D' and situacao='A' and descricao like '%$string%' and dtaprincipal between '$data_inicio' and '$data_fim' $caixa_sql $categoria_sql) 'despesa_pagar',
                    (select ifnull(sum(valor),0) from {$this->tableName} where tipo='D' and situacao='P' and descricao like '%$string%' and dtaprincipal between '$data_inicio' and '$data_fim' $caixa_sql $categoria_sql) 'despesa_paga',

                    ((select ifnull(sum(valor),0) from {$this->tableName} where tipo='R' and situacao='P' and descricao like '%$string%' and dtaprincipal between '$data_inicio' and '$data_fim' $caixa_sql $categoria_sql)- (select ifnull(sum(valor),0) from {$this->tableName} where tipo='D' and situacao='P' and descricao like '%$string%' and dtavencimento between '$data_inicio' and '$data_fim' $caixa_sql $categoria_sql)) 'caixa_total',
                    round((((select ifnull(sum(valor),0) from {$this->tableName} where tipo='R' and situacao='P' and descricao like '%$string%' and dtaprincipal between '$data_inicio' and '$data_fim' $caixa_sql $categoria_sql)- (select ifnull(sum(valor),0) from {$this->tableName} where tipo='D' and situacao='P' and descricao like '%$string%' and dtavencimento between '$data_inicio' and '$data_fim' $caixa_sql $categoria_sql))*10)/100,2) 'dizimo'
                    
                FROM dual";

        return $this->executeSql($sql);
        
    }
    
    public function buscaCategorias($data_inicio, $data_fim, $string, $caixa_id, $categoria_id){
        
        $caixa_sql = ($caixa_id>0)?" and caixa_id=$caixa_id":'';
        $categoria_sql = ($categoria_id>0)?" and categoria_id=$categoria_id":'';
        
        $sql = "select b.nome, a.tipo, a.situacao, sum(a.valor) total
                from {$this->tableName} a
                left join finan_categorias b on b.id=a.categoria_id
                where dtaprincipal between '$data_inicio' and '$data_fim' and descricao like '%$string%' $caixa_sql $categoria_sql
                group by b.nome, a.tipo, a.situacao
                order by b.nome, a.tipo desc, a.situacao";
        
        return $this->executeSql($sql);
        
    }
    
    public function buscaCheques($data_inicio, $data_fim, $string, $caixa_id, $categoria_id){
        
        $caixa_sql = ($caixa_id>0)?" and caixa_id=$caixa_id":'';
        $categoria_sql = ($categoria_id>0)?" and categoria_id=$categoria_id":'';
        
        $sql = "select b.nome, a.tipo, a.situacao, sum(a.valor) total
                from {$this->tableName} a
                left join finan_categorias b on b.id=a.categoria_id
                where dtaprincipal between '$data_inicio' and '$data_fim' and descricao like '%$string%' $caixa_sql $categoria_sql and a.tipopagamento='CH'
                group by b.nome, a.tipo, a.situacao
                order by b.nome, a.tipo desc, a.situacao";
        return $this->executeSql($sql);
        
    }
    
}