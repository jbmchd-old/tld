<?php

namespace Financeiro\Model;

use ZeDb\Model;

class VFinanLancCategorias extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }
    
}