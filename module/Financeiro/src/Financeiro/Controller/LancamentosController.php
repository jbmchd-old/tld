<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Financeiro\Controller;

use Zend\View\Model\JsonModel;
use Zf2ServiceBase\Controller\GenericController;

class LancamentosController extends GenericController {

    private $ofxFile;
    private $caixaId;
    private $categoriaId;

    public function salvarAction() {

        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $dados = $request->getPost()->toArray();
        $tela_origem = $dados['tela_origem'];
        
        foreach ($dados['parcelas'] as $num_parcela => $parcela) {
            $dados['dtainclusao'] = (new \DateTime())->format('Y-m-d H:i:s');
            
            $dados['parcelas'][$num_parcela]['num'] = $num_parcela;
            
            if(!strlen($parcela['dtapagamento'])){
                $dados['parcelas'][$num_parcela]['situacao']='A';
                unset($dados['parcelas'][$num_parcela]['dtapagamento']);
            }

            if (substr_count($parcela['valor'], ',') > 0) {
                $dados['parcelas'][$num_parcela]['valor'] = str_replace(',', '.', str_replace('.', '', $parcela['valor']));
            }
        }
        unset($dados['tela_origem']);
        
        $srv = $this->app()->getEntity('FinanLancamentos');
        $result = $srv->insereLancamentoParcelas([$dados]);
        
        switch ($tela_origem['nome']){
            case 'manutencao':
                $os_id = $tela_origem['id'];
                $srv = $this->app()->getEntity('Manutencao','Manutencao');
                
                $os = $srv->getById($os_id)['table']->toArray();
                $os['lancamento_id']=$result['lanc_id'];
                
                $entity = $srv->create($os);
                $result['manutencao'] = $srv->save($entity)->toArray();
        }
        
        $result['registros'] = sizeof($dados);
        
        return new JsonModel($result);
    }

    public function buscaUltimosLancamentosAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();
        $srv = $this->app()->getEntity('VFinanLancamentos');
        $result = $srv->buscaUltimos()['table'];

        return new JsonModel($result);
    }

    public function buscaLancamentoAction() {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }
        $dados = $request->getPost()->toArray();

        $srv = $this->app()->getEntity('VFinanLancamentos');
        $result = $srv->getAllById($dados['id'])['table'];
        $array = [];
        foreach ($result as $cada) {
            $num_parc = $cada['num'];
            $array['id'] = $cada['id'];
            $array['caixa_id'] = $cada['caixa_id'];
            $array['categoria_id'] = $cada['categoria_id'];
            $array['descricao'] = $cada['descricao'];
            $array['tipo'] = $cada['tipo'];
            $array['parcelas'][$num_parc]['id'] = $cada['parcela_id'];
            $array['parcelas'][$num_parc]['dtavencimento'] = $cada['dtavencimento'];
            $array['parcelas'][$num_parc]['valor'] = $cada['valor'];
            $array['parcelas'][$num_parc]['situacao'] = $cada['situacao'];
            $array['parcelas'][$num_parc]['dtapagamento'] = $cada['dtapagamento'];
            $array['parcelas'][$num_parc]['formapagto'] = $cada['formapagto'];
        }
        
        return new JsonModel($array);
    }

    //======== IMPORTACAO ============

    public function importOfxAction() {

        $request = $this->getRequest();
        if (!$request->isPost()) {
            return false;
        }

        $post = $request->getPost()->toArray();
        $this->caixaId = $post['caixa_id'];
        $this->categoriaId = $post['categoria_id'];

        $files = $request->getFiles()->toArray();
        $this->ofxFile = array_shift($files)['tmp_name'];

        $db = new \ZeDb\Model();
        $srv_lanc = $this->app()->getEntity('FinanLancamentos');

        $array = $this->FileToArray();

        $result = $srv_lanc->insereLancamentoParcelas($array);
        $result['registros'] = sizeof($array);
        
        return new JsonModel($result);
    }

    private function FileToArray() {
        $bank_info = $this->getBankInfo();
        
        $array = [];
        foreach ($this->getTransactions() as $key => $transaction) {

            $data = substr($transaction->DTPOSTED->__toString(), 0, 8);
            $data = \DateTime::createFromFormat('Ymd', $data)->format('Y-m-d');

            $array[] = [
                'id' => null,
                'caixa_id' => $this->caixaId,
                'categoria_id' => $this->categoriaId,
                'descricao' => $transaction->MEMO->__toString(),
                'tipo' => ($transaction->TRNTYPE->__toString() === 'CREDIT') ? 'R' : 'D',
                'formapagto' => 'AV',
                'dtainclusao' => date('Y-m-d H:i:s'),
                'parcelas' => [[
                    'id'=>null,
                    'dtavencimento' => $data,
                    'valor' => $transaction->TRNAMT->__toString(),
                    'situacao' => 'P',
                    'dtapagamento' => $data,
                    'obs' => 'Importação OFX - Banco '.$bank_info->BANKID->__toString(),
                ]]
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
