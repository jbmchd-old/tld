<?php

namespace Produtos\Model;

use ZeDb\Model;

class Produtos extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('id', $options);
    }
}