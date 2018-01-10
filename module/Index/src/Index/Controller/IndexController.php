<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Index\Controller;

use Zf2ServiceBase\Controller\GenericController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

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
    
    public function backupAction() {
        $db_paramenters = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter')->getDriver()->getConnection()->getConnectionParameters();

        $dbname = $db_paramenters['database'];
        $dbhost = $db_paramenters['hostname'];
        $user = $db_paramenters['username'];
        $pass = $db_paramenters['password']
;        $tables = '*';
        
        $dsn = "mysql:dbname=$dbname;host=$dbhost;port=3306";
        try {
            $pdo = new \PDO($dsn, $user, $pass); // also allows an extra parameter of configuration
            // file header stuff
            $output = "-- PHP MySQL Dump\n--\n";
            $output .= "-- Host: $dbhost\n";
            $output .= "-- Generated: " . date("r", time()) . "\n";
            $output .= "-- PHP Version: " . phpversion() . "\n\n";
            $output .= "SET FOREIGN_KEY_CHECKS=0;\n";
            $output .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
            $output .= "SET AUTOCOMMIT = 0;\n";
            $output .= "START TRANSACTION;\n";
            $output .= "SET time_zone = \"-03:00\";\n\n";

            $output .= "--\n-- Database: `$dbname`\n--\n";
            // get all table names in db and stuff them into an array
            $tables = array();

            $stmt = $pdo->query("select * from information_schema.tables as t where t.table_schema=\"$dbname\";");
            
            while ($row = $stmt->fetch(\PDO::FETCH_NUM)) {
                $tables[] = $row[2] . '-' . $row[3];
            }
            
            // process each table in the db
            foreach ($tables as $table) {
                $table = explode('-', $table);
                $table_tipo = $table[1];
                $table = $table[0];

                $fields = "";
                $sep2 = "";
                $output .= "\n-- " . str_repeat("-", 60) . "\n\n";
                $output .= "--\n-- Structure for `$table`\n--\n\n";
                // get table create info
                $stmt = $pdo->query("SHOW CREATE TABLE $table");
                $row = $stmt->fetch(\PDO::FETCH_NUM);
                if ($table_tipo == 'VIEW') {
                    
                    $pos_final = strpos($row[1], 'VIEW');
                    $row[1] = substr_replace($row[1], 'CREATE ', 0, $pos_final);
                    $output.= $row[1] . ";\n\n";

                } else {

                    $output.= $row[1] . ";\n\n";
                    // get table data
                    $output .= "--\n-- Dumping data for table `$table`\n--\n\n";
                    $stmt = $pdo->query("SELECT * FROM $table");
                    while ($row = $stmt->fetch(\PDO::FETCH_OBJ)) {
                        // runs once per table - create the INSERT INTO clause
                        if ($fields == "") {
                            $fields = "INSERT INTO `$table` (";
                            $sep = "";
                            // grab each field name
                            foreach ($row as $col => $val) {
                                $fields .= $sep . "`$col`";
                                $sep = ", ";
                            }
                            $fields .= ") VALUES";
                            $output .= $fields . "\n";
                        }
                        // grab table data
                        $sep = "";
                        $output .= $sep2 . "(";
                        foreach ($row as $col => $val) {
                            // add slashes to field content
                            $val = addslashes($val);
                            // replace stuff that needs replacing
                            $search = array("\'", "\n", "\r");
                            $replace = array("''", "\\n", "\\r");
                            $val = str_replace($search, $replace, $val);
                            $output .= $sep . "'$val'";
                            $sep = ", ";
                        }
                        // terminate row data
                        $output .= ")";
                        $sep2 = ",\n";
                    }
                    // terminate insert data
                    $output .= ";\n";
                }
            }

            $output .= "SET FOREIGN_KEY_CHECKS=1;\n";
            $output .= "COMMIT;\n\n";

            $output = str_replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS", $output);

            //save file
            $nome_arq = 'mysqldump_' . date('Y-m-d_H-i');
            $destino = getcwd().'/data/mysqldump/';
            $destino_completo = str_replace('\\', DIRECTORY_SEPARATOR, str_replace('/', DIRECTORY_SEPARATOR, $destino.$nome_arq.'.zip'));
            
            $this->sqlToZip($destino, $nome_arq, $output);
            
            if(file_exists($destino_completo) and filesize($destino_completo)){
                return new JsonModel(['result' => true, 'msg'=>'Backup realizado!']);        
            } else {
                return new JsonModel(['result' => false, 'msg'=>'Falha no backup, verifique urgentemente!']);        
            }
        } catch (\PDOException $e) {
            return new JsonModel(['result' => false, 'msg'=>'Falha ao realizar o backup, verifique urgentemente!']);        
        }
    }
    
    private function sqlToZip($caminho, $nome_arq, $string){
        $zip = new \ZipArchive();
        $filename = str_replace('\\', DIRECTORY_SEPARATOR, str_replace('/', DIRECTORY_SEPARATOR, $caminho.$nome_arq.'.zip'));

        if ($zip->open($filename, \ZipArchive::CREATE)!==TRUE) {
            exit("cannot open <$filename>\n");
        }
        
        $zip->addFromString($nome_arq.'.sql', $string);
        $num_files = $zip->numFiles;
        $zip->close();
        return $num_files;
    }
}
