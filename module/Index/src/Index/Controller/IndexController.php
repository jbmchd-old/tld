<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Index\Controller;

use Zf2ServiceBase\Controller\GenericController;
use Zend\View\Model\ViewModel;

class IndexController extends GenericController
{
   
    public function indexAction(){
        
        $auth = $this->zfcUserAuthentication();
        
        if($auth->hasIdentity()){
            $id = $auth->getIdentity();
            
            $auth_user = [
                'user_id'       => $id->getId(),
                'pessoas_id'    => $id->getPessoasId(),
                'username'      => $id->getUsername(),
                'email'         => $id->getEmail(),
                'display_name'  => $id->getDisplayName(),
                'state'         => $id->getState(),
                'nome_razao'    => $id->getNomeRazao(),
                'empresa_id'    => 1
            ];
            
            $this->sessao()->addInSession($auth_user, 'usuario');
            
        } else {
            return $this->redirect()->toRoute('zfcuser/logout');
        }
        
        return new ViewModel([
            "telas" => [],
        ]);
    }
    
}
