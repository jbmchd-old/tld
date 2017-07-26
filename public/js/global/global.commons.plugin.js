/**
 * Verifica se a posicao 0 existe no seletor
 * @param obj _this objeto javascript (this) a ser avaliado
 * @returns Boolean false para undefined e true para o contrario
 */
function existeSeletor(_this){
    return typeof _this[0] !== 'undefined';
}

/**
 * Verifica se existe o seletor, caso exista, tenta pegar seu valor ou o conteudo HTML.
 * Se o seletor e o "attr" estão definidos, então tenta pegar o valor do 'attr' passado
 * @param obj _this objeto javascript (this) a ser buscado
 * @param string attr attr do seletor a ser buscado
 * @returns String o Valor encontrado ou vazio.
 */
function extraiValorObj(_this, attr){
    if(estaDefinido(_this[0])){
        if(estaDefinido(attr)){
            return ( $(_this[0]).attr(attr) ) ? $(_this[0]).attr(attr) : '';
        }
        return (_this[0].value)?_this[0].value:$(_this[0]).html();
    }
    return '';
}

/**
 * Verifica se algum conteudo é undefined, opcionalmente, verifica se tem conteudo, caso esteja definido
 * @param {mixed} $var qualquer conteudo a ser verificado
 * @param {boolean} com_conteudo se deseja verificar se o conteudo é diferente de vazio
 * @returns {Boolean} false para indefinido ou vazio, true para o contrario
 */
function estaDefinido($var, com_conteudo){
    if(typeof $var !== 'undefined'){
        return (com_conteudo)? $var.trim() === '' : true;
    }
    return false;
}

(function($) {
    //COMUNS
    /**
     * Pega uma data em formato en|pt-br e converte para pt-br|en
     * @param {string} formato o formato destino da data
     * @param {string} data a data a ser transformada
     * @returns {String} a data convertida, ou vazio em caso de conteudos inesperados
     */
    $.fn.parseDate = function (formato, data) {

        var data_dom = extraiValorObj(this);
        if(data_dom.trim() != ""){
            data = data_dom;
        }
        if(data.trim() == ""){
            console.log("Passe uma data");
            return false;
        }
        if (formato === 'en' && data.search('/') > -1) {
            data = data.split('/').reverse().join('-');
        } else if (formato === 'br' && data.search('-') > -1) {
            if(data.length > 10){
                var data_hora = data.split(' ');
                data = data_hora[0].split('-').reverse().join('/') + ' ' + data_hora[1];
            }
            else {
                data = data.split('-').reverse().join('/');
            }
        }
        return data;
    }
    
    //REFERENTE A DATAS
    /**
     * Plugin para datas
     * Mediante uma data qualquer, retorna uma instancia de um objeto dateClass que possui algumas funções para datas
     * São aceitos os formatos:
     * * $('#obj').date().funcaoDaClasseDateClass
     * * $().date('d/m/Y').funcaoDaClasseDateClass
     * * $('#obj').date('atributoDoObj').funcaoDaClasseDateClass
     * Obs: O segundo parametro é ignorado caso seja passado $('#obj').date('d/m/Y').funcaoDaClasseDateClass
     * @param {obj} this 
     * @param {type} data
     * @returns {obj} Instancia de um objeto dateClass
     */
    $.fn.date = function (data){
        var data_mill = '';
        var data_valida     = false;
        var attr_valido     = false;
        
        if(estaDefinido(data)){
            if($().validacao(data).isDate()){
                data_valida = true;
            } else if(data.toString().trim() !== ''){
                attr_valido = true;
            }
        }
        
        if(existeSeletor(this)){
            if( attr_valido ){
                data = extraiValorObj(this, data);
            } else {
                data = extraiValorObj(this);
            }
        } else if( ! data_valida){
            data = '';
        }  
        
        if (data.trim() === '') {
            data_mill = new Date().setUTCHours(0);
        } else {
            if (data.search('/') > -1) {
                data = data.split('/').reverse().join('-');
            }
            data_mill = new Date(data).setUTCHours(2);
        }
        return new dateClass(data_mill);
    }
    
    /**
     * 
     * Mediante uma quantidade de milisegundos, disponibiliza algumas funcoes para data
     * @param {int|string} data_mill Milisegundos para criacao do objeto Date
     * @returns {obj} Um objeto onde cada posição se refere a uma função da classe.
     */
    var dateClass = function (date_mill){
        var dateObj = new Date(date_mill);
        mes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        
        function getDiaDaSemanaExtenso(){
            semana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            return semana[dateObj.getDay()];
        }
        
        function getMesExtenso(){
            return mes[dateObj.getMonth()];
        }
        
        function getDataExtenso(){
            return dateObj.getDate() + ' de ' + mes[dateObj.getMonth()] + ' de ' + dateObj.getFullYear();
        }
        
        function getMilisegundos(){
            return date_mill;
        }
        
        return { 
            getDiaDaSemanaExtenso   : getDiaDaSemanaExtenso ,
            getMilisegundos         : getMilisegundos ,
            getDataExtenso          : getDataExtenso ,
            getMesExtenso           : getMesExtenso ,
        }
    }
    
    //REFERENTE A VALIDACOES
    /**
     * Plugin para validações
     * Mediante uma string qualquer, retorna uma instancia de um objeto validacaoClass que possui algumas funções para validações
     * São aceitos os formatos:
     * * $('#obj').validacao().funcaoDaClasseValidationClass
     * * $().validacao('string').funcaoDaClasseValidationClass
     * Obs: O segundo parametro é ignorado caso seja passado $('#obj').date('string').funcaoDaClasseValidationClass
     * @param {obj} this Elemento que possui o 'value' ou o 'html' com o conteudo a ser testado
     * @param {string} string_teste string a ser testada
     * @returns instancia de um objeto validacaoClass
     */
    $.fn.validacao = function (string_teste){
        if( ! estaDefinido(string_teste)){
            string_teste = '';
        }
        
        string_teste = string_teste.toString();
        
        try {
            //verifica se existe um seletor válido
            if(existeSeletor(this)){
                //pega um valor a ser testado, prioridade para o atributo "value"
                string_teste = extraiValorObj(this);
            }

            return new validacaoClass(string_teste)

        } catch (err){
            console.log(err.message);
        }
    }
    /**
     * Disponibiliza funções de validação de strings
     * @param {string} string_teste string a ser validada
     * @returns {obj} Um objeto onde cada posição se refere a uma função da classe.
     */
    var validacaoClass = function (string_teste){
        // as expressões regulares disponiveis
        var expressoes_regulares = {
            date: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
            cpf: /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/,
            cnpj: /^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}$/,
        }
        
        function isDate(){
            return expressoes_regulares['date'].test(string_teste) ;
        }
        
        function isCpf(){
            return expressoes_regulares['cpf'].test(string_teste) ;
        }
        
        function isCnpj(){
            return expressoes_regulares['cnpj'].test(string_teste) ;
        }
        
        
        return {
            isDate: isDate,
            isCpf: isCpf,
            isCnpj: isCnpj,
        }
        
    }
    
    //REFERENTE A FORMATACOES
    $.fn.formatacao = function (){
        return new formatacaoClass(this);
    }
    
    var formatacaoClass = function (obj){
        var obj = obj;
        function tabela(){
            tabela = obj;
            if($(tabela).prop('tagName')==='TABLE'){
                //Formata estilo moeda
                $(tabela.selector).find('tbody td[data-tipo=currency]').autoNumeric('init', { 
                    aSep: '.',
                    aDec: ',', 
                    aSign: ''
                });
                //Formata datas
                $(tabela.selector).find('tbody td[data-tipo=date]').each(function(key, cada){
                    $(cada).html( $(cada).parseDate('br') );
                });
                //Centraliza CheckBox
                $(tabela.selector).find('tbody td[data-tipo=chk]').each(function(key, cada){
                    $(cada).css('text-align','center');
                })
            } else {
                console.log( 'Não é uma tabela válida' );   
            }
        }
        
        return {
            tabela: tabela,
        }
        
    }
    
    
})(jQuery);