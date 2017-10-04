<?php

namespace Bi\Model;

use ZeDb\Model;

class VBiGrafFaturamentorealCategorias extends Model {
    
    public function __construct($options = null) {
        $this->tableName = __CLASS__;
        parent::__construct('valor', $options);
    }
   
}