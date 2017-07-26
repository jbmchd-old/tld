<?php

namespace Manutencao\Model;

use ZeDb\Model;

class ManutencaoItens extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }
}