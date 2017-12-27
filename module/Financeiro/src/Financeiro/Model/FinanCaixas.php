<?php

namespace Financeiro\Model;

use ZeDb\Model;

class FinanCaixas extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }
}