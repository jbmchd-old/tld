<?php

namespace Manutencao\Model;

use ZeDb\Model;

class VManutencaoItens extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }
}