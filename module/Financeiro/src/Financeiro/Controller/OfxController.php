<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Financeiro\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class OfxController extends GenericController {
    
    private $ofxFile;
    
    public function salvarAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('FinanLancParcelas');
        $result = $srv->atualizaParcelasOfx($dados['data']);
        
        return new JsonModel($result);
    }
    
    public function buscaLancamentosPorValorAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VFinanLancamentos');
        $result = $srv->buscaLancamentosPorValor($dados['valor'])['table'];
        foreach ($result as $i => $cada) {
            $result[$i]['dtavencimento']= (new \DateTime($cada['dtavencimento']))->format('d/m/Y');
        }
        return new JsonModel($result);
    }
    
    public function buscarLancamentosAction(){
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VFinanLancamentos');
        $result = $srv->buscaListagem($dados['inicio'], $dados['fim'].' 23:29:29');
        return new JsonModel($result);
    }
    
    public function importOfxAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

//        $post = $request->getPost()->toArray();
        
//        $this->caixaId = $post['caixa_id'];
//        $this->categoriaId = $post['categoria_id'];

        $files = $request->getFiles()->toArray();
        $this->ofxFile = array_shift($files)['tmp_name'];

//        $db = new \ZeDb\Model();
//        $srv_lanc = $this->app()->getEntity('FinanLancamentos');

//        $array = $this->FileToArray();
        $result = $this->FileToArray();

//        $result = $srv_lanc->insereLancamentoParcelas($array);
//        $result['registros'] = sizeof($array);
        
        return new JsonModel($result);
    }

    private function FileToArray() {
        $bank_info = $this->getBankInfo();
        
        $array = [];
        foreach ($this->getTransactions() as $key => $transaction) {

            $data = substr($transaction->DTPOSTED->__toString(), 0, 8);
            $data = \DateTime::createFromFormat('Ymd', $data)->format('d/m/Y');

            $array[] = [
                'descricao' => $transaction->MEMO->__toString(),
                'tipo' => $transaction->TRNTYPE->__toString(),
                'data' => $data,
                'valor' => $transaction->TRNAMT->__toString(),
                'obs' => 'Importação OFX - Banco '.$bank_info->BANKID->__toString(),
            ];
        }
        return $array;
    }

    private function getOfxAsXML() {
        $content = file_get_contents($this->ofxFile);
        $line = strpos($content, "<OFX>");
        $ofx = substr($content, $line - 1);
        $buffer = $ofx;
        $count = 0;
        while ($pos = strpos($buffer, '<')) {
            $count++;
            $pos2 = strpos($buffer, '>');
            $element = substr($buffer, $pos + 1, $pos2 - $pos - 1);
            if (substr($element, 0, 1) == '/')
                $sla[] = substr($element, 1);
            else
                $als[] = $element;
            $buffer = substr($buffer, $pos2 + 1);
        }
        $adif = array_diff($als, $sla);
        $adif = array_unique($adif);
        $ofxy = $ofx;
        foreach ($adif as $dif) {
            $dpos = 0;
            while ($dpos = strpos($ofxy, $dif, $dpos + 1)) {
                $npos = strpos($ofxy, '<', $dpos + 1);
                $ofxy = substr_replace($ofxy, "</$dif>\n<", $npos, 1);
                $dpos = $npos + strlen($element) + 3;
            }
        }
        $ofxy = str_replace('&', '&', $ofxy);
        $ofxy = iconv('Windows-1252', 'UTF-8', $ofxy);
        ;
        return $ofxy;
    }

    private function getBankInfo(){
        $xml = new \SimpleXMLElement($this->getOfxAsXML());
        return $xml->BANKMSGSRSV1->STMTTRNRS->STMTRS->BANKACCTFROM;
    }

    private function getTransactions() {
        $xml = new \SimpleXMLElement($this->getOfxAsXML());
        $transactions = $xml->BANKMSGSRSV1->STMTTRNRS->STMTRS->BANKTRANLIST->STMTTRN;
        return $transactions;
    }

    private function getBalance() {
        $xml = new \SimpleXMLElement($this->getOfxAsXML());
        $balance = $xml->BANKMSGSRSV1->STMTTRNRS->STMTRS->LEDGERBAL->BALAMT;
        $dateOfBalance = $xml->BANKMSGSRSV1->STMTTRNRS->STMTRS->LEDGERBAL->DTASOF;
        $date = strtotime(substr($dateOfBalance, 0, 8));
        $dateToReturn = date('Y-m-d', $date);
        return Array('date' => $dateToReturn, 'balance' => $balance);
    }
}
