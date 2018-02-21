<?php

namespace Index\Entity;

class AcessoUsuario implements \ZfcUser\Entity\UserInterface
{
    /**
     * @var int
     */
    protected $id;

    /**
     * @var string
     */
    protected $pessoasId;

    /**
     * @var string
     */
    protected $username;

    /**
     * @var string
     */
    protected $email;

    /**
     * @var string
     */
    protected $displayName;

    /**
     * @var int
     */
    protected $password;
    
    protected $state;
    
    function getId() {
        return $this->id;
    }

    function getPessoasId() {
        return $this->pessoasId;
    }

    function getUsername() {
        return $this->username;
    }

    function getEmail() {
        return $this->email;
    }

    function getDisplayName() {
        return $this->displayName;
    }

    function getPassword() {
        return $this->password;
    }

    function getState() {
        return $this->state;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setPessoasId($pessoasId) {
        $this->pessoasId = $pessoasId;
    }

    function setUsername($username) {
        $this->username = $username;
    }

    function setEmail($email) {
        $this->email = $email;
    }

    function setDisplayName($displayName) {
        $this->displayName = $displayName;
    }

    function setPassword($password) {
        $this->password = $password;
    }

    function setState($state) {
        $this->state = $state;
    }


}
