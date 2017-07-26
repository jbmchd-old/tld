<?php

namespace Pessoas\Model;

use ZeDb\Model;

class VFuncionarios extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('pessoas_id', $options);
    }
}