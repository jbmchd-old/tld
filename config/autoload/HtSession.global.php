<?php
/**
 * HtSession Configuration
 *
 * If you have a ./config/autoload/ directory set up for your project, you can
 * drop this config file in it and change the values as you wish.
 */

$moduleOptions = array(
    /**
     * Session Config Class
     *
     * Name of class used to manage session config options. Useful to create your own
     * Session Config Class.  Default is Zend\Session\Config\SessionConfig.
     * The class should implement Zend\Session\Config\ConfigInterface.
     */
    'config_class' => 'Zend\Session\Config\SessionConfig',

    /**
     * Session Config Options
     *
     * session options such as name, save_path can be set from here
     * This is the part sent to Session Config Class. Default is empty array.
     */
    'config_options' => [
        /*integer	Specifies time-to-live for cached session pages in minutes.*/
        //'cache_expire' => '',
        /*string	Specifies the domain to set in the session cookie.*/
        //'cookie_domain' => '',
        /*boolean	Marks the cookie as accessible only through the HTTP protocol.*/
        //'cookie_httponly' => '',
        /*integer	Specifies the lifetime of the cookie in seconds which is sent to the browser.*/
        //'cookie_lifetime' => '',
        /*string	Specifies path to set in the session cookie.*/
        //'cookie_path' => '',
        /*boolean	Specifies whether cookies should only be sent over secure connections.*/
        //'cookie_secure' => '',
        /*integer	Specifies the number of bytes which will be read from the file specified in entropy_file.*/
        //'entropy_length' => '',
        /*string	Defines a path to an external resource (file) which will be used as an additional entropy.*/
        //'entropy_file' => '',
        /*integer	Specifies the number of seconds after which data will be seen as ‘garbage’.*/
        //'gc_maxlifetime' => '',
        /*integer	Defines the probability that the gc process is started on every session initialization.*/
        //'gc_divisor' => '',
        /*integer	Defines the probability that the gc process is started on every session initialization.*/
        //'gc_probability' => '',
        /*integer	Defines how many bits are stored in each character when converting the binary hash data.*/
        //'hash_bits_per_character' => '',
        /*string	Specifies the name of the session which is used as cookie name.*/
        'name' => 'tld',
        /*integer	Specifies how long to remember the session before clearing data.*/
        'remember_me_seconds' => '180',
        /*string	Defines the argument which is passed to the save handler.*/
//        'save_path' => 'data/session',
        /*boolean	Specifies whether the module will use cookies to store the session id.*/
        //'use_cookies' => '',
        /*string	Specifies the cache control method used for session pages.*/
        //'cache_limiter' => '',
        /*string	Allows you to specify the hash algorithm used to generate the session IDs.*/
        //'hash_function' => '',
        /*string	Defines the name of a PHP save_handler embedded into PHP.*/
        //'php_save_handler' => '',
        /*string	Defines the name of the handler which is used to serialize/deserialize data.*/
        //'serialize_handler' => '',
        /*string	Specifies which HTML tags are rewritten to include session id if transparent sid enabled.*/
        //'url_rewriter_tags' => '',
        /*boolean	Whether transparent sid support is enabled or not.*/
        //'use_trans_sid' => '',
        
    ],

    /**
     * Session Storage Class
     *
     */
//    'storage' => 'Zend\Session\Storage\SessionArrayStorage',

    /**
     * Session Validators
     *
     * Session validators provide various protection against session hijacking.
     * see http://framework.zend.com/manual/2.2/en/modules/zend.session.validator.html for more details
     */
    //'validators' => array(),

    /**
     * Use session save handler or not.
     *
     * Default is true. Useful to store session data in database
     * see http://php.net/manual/en/function.session-set-save-handler.php
     * Accept values: true and false
     */
    'enable_session_set_save_handler' => false,
);

$otherOptions = array(
     /**
      *
      * Db Adapter Instance
      *
      * Please specify the DI alias for the configured Zend\Db\Adapter\Adapter instance that this module should use.
      * You donot need to provide this value if you are not saving session data in database
      *
      * Default: 'Zend\Db\Adapter\Adapter'
      */
      //'db_adapter' => 'Zend\Db\Adapter\Adapter',

    /**
     * Session Save Handler DI Alias
     *
     * Please specify the DI alias for the configured Zend\Session\SaveHandler\SaveHandlerInterface
     * instance that this module should use.
     * Default is HtSession\DefaultSessionSetSaveHandler which is provided by this module.
     * This class should implement Zend\Session\SaveHandler\SaveHandlerInterface
     */
    //'session_set_save_handler' => 'HtSession\DefaultSessionSetSaveHandler'
);

/**
 * You do not need to edit below this line
 */
return array(
    'htsession' => array(
        'options' => $moduleOptions
    ),
    'service_manager' => array(
        'aliases' => array(
            'HtSessionDbAdapter' => isset($otherOptions['db_adapter']) ?  $otherOptions['db_adapter'] : 'Zend\Db\Adapter\Adapter',
            'HtSession\AuthenticationService' => isset($otherOptions['authentication_service']) ?  $otherOptions['authentication_service'] : 'zfcuser_auth_service',
            'HtSession\SessionSetSaveHandler' => isset($otherOptions['session_set_save_handler']) ?  $otherOptions['session_set_save_handler'] : 'HtSession\DefaultSessionSetSaveHandler',
        )
    )
);
