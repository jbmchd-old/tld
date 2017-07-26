/**
 * @author Joabe Machado de Abreu <jb.machado42@gmail.com.br>
 * @description 
 * @version 1.0 31/03/2015
 */
(function ($) {
    /**
     * 
     * @param Você pode passar a função que vai executar quando o usuario clicar em sim
     * @param ou passar um objeto no seguinte estilo
     *  $e("#teste").confirm({
     yes:function(){
     alert('sim');
     },
     no:function(){
     alert("cancelou");
     },
     text:"Mensagem do alerta",
     titulo : "Título do alert",
     noLabel : "Texto do botao noLabel",
     yesLabel : "Texto do botap yesLabel",
     });
     * @returns {undefined}
     */

    $.fn.confirm = function (options, yes) {
        
        seletor = (this.selector)?this[0]:false;

        var settings = $.extend({
            // These are the defaults.
            titulo: '',
            texto: 'Confirma a operação?',
            noLabel: 'Não',
            yesLabel: 'Sim',
            preAcao: '',
            yes: function () {},
            no: function () {}
        }, options);

        if (typeof options === "function") {
            settings.yes = options;
        } else if (typeof options === 'string') {
            settings.text = options;
            if (typeof yes === 'function') {
                settings.yes = yes;
            }
        }

        var modal = '\
                <div class="modal fade" id="modal_confirmar" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                    <div class="modal-dialog modal-sm" >\
                        <div class="modal-content">\
                            <div class="modal-header" >\
                                <i class="fa fa-question-circle"></i>\
                                <span class="modal-title" style="font-size:15px; font-weight:600">' + settings.titulo + '</span>\
                            </div>\
                            <div class="modal-body" >\
                                <span style="color:black; font-size:13px;">' + settings.texto + '</span> \
                            </div>\
                            <div class="modal-footer" style="padding:10px; text-align:center">\
                              <button type="button" id="nao_confirma" class="" data-dismiss="modal" ><i class="fa fa-times" ></i> ' + settings.noLabel + '</button>\
                              <button type="button" id="sim_confirma" class=""><i class="fa fa-check" ></i> ' + settings.yesLabel + '</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>\ ';

        $("body").append(modal);

        $("#sim_confirma").click(function () {
            
            if (typeof settings.yes === "function") {
                var retorno = settings.yes(seletor);
            } 
            
            if(retorno){
                if ($(seletor).prop('tagName') === 'A' && $(seletor).attr('href') !== '#' && $(seletor).attr('href') !== 'undefined') {
                    location.href = $(seletor).attr('href');
                }
            }
            
            $("#modal_confirmar").modal('hide');
            
        });

        $("#nao_confirma").click(function () {
            if (typeof settings.no === "function") {
                settings.no(seletor);
                $("#modal_confirmar").modal('hide');
                return false;
            } 
        });

        if (typeof settings.preAcao === 'function') {
//            var retorno = settings.preAcao(seletor);
            if ( settings.preAcao(seletor) ) {
                //abre o confirm
                $("#modal_confirmar").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
        } else {
            //abre o confirm
            $("#modal_confirmar").modal({
                backdrop: 'static',
                keyboard: false
            });
        }
        
    };
    
    $.fn.alert = function (options) {
        
        if($('#modal_alert').length){
            $('#modal_alert').remove();
        }
        
        if(typeof options == 'string'){
            if(typeof options === 'undefined' || options.trim() === ''){  options = ''; };
            options = {texto: options};
        } 

        var settings = $.extend({
                // These are the defaults.
                titulo: 'Atenção',
                texto: '',
                okLabel: 'Ok',
                exibirOk: true,
                ok: function(){},
                appendInBody: true
            }, options);
        
        var modal = '\
                <div class="modal fade" id="modal_alert" name="modal_alert" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                    <div class="modal-dialog modal-sm" >\
                        <div class="modal-content">\
                            <div class="modal-header" >\
                                <i class="fa fa-exclamation-circle"></i> \
                                ' + settings.titulo + ' \
                            </div>\
                            <div class="modal-body" style="padding: 10px" >\
                                <span style="color:black; font-size:13px;">' + settings.texto + '</span> \
                            </div>\
                            <div class="modal-footer" style="padding:10px; text-align:center">\ ';
            if(settings.exibirOk){
                modal += '<button type="button" id="modal_alert_ok" class="" data-dismiss="modal" ><i class="fa fa-check" ></i> ' + settings.okLabel + '</button>\ '
            }
            
            modal += '</div>\
                        </div>\
                    </div>\
                </div>\ ';
        
        
        
        var seletor = (this.selector)?this[0]:false;
        
        if(settings.appendInBody==true){
            $('body').append(modal);    
            $("#modal_alert").modal({ backdrop: 'static', keyboard: false });
        } else {
            $(seletor).append(modal);
            reposicionaModal(seletor, '#modal_alert', modal)
        }
        
        $('#modal_alert_ok').click(function (){
            if (typeof settings.ok === "function") {
                var retorno = settings.ok(seletor);
                if(retorno){
                    if ($(seletor).prop('tagName') === 'A' && $(seletor).attr('href') !== '#' && $(seletor).attr('href') !== 'undefined') {
                        location.href = $(seletor).attr('href');
                    }
                }
            } 
        });
        
        
    };

    $.fn.loading = function (option, $this) {
        var diferenciador = (typeof $this.url === 'undefined')?'':$this.url.split('/').join('_').split('?').shift();
        
        var param_tipo = typeof option;
        var titulo = 'Aguarde...';
        var abrir = true;
        
        
        if(param_tipo === 'string' && option.trim()!==''){
            titulo = option; 
        } else if(param_tipo === 'boolean' || param_tipo === 'number'){
            abrir = Boolean(option);
        }
        
        var id_modal = 'modal_loading'+diferenciador;
        if(abrir){
            if( ! $('#'+id_modal).length ){
                var modal = '\
                        <div class="modal fade" id="'+id_modal+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                            <div class="modal-dialog modal-sm" >\
                                <div class="modal-content">\
                                    <div class="modal-header" >\
                                        <i class="fa fa-info-circle"></i>\
                                        <span class="modal-title" style="font-size:15px; font-weight:600">' + titulo + '</span>\
                                    </div>\
                                    <div class="modal-body text-center" >\
                                        <span style="color:black; font-size:13px;">\
                                            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>\
                                        </span> \
                                    </div>\
                                    <div class="modal-footer" style="padding:10px; text-align:center"></div>\
                                </div>\
                            </div>\
                        </div>\ ';

                $("body").append(modal);
            }
            //abre o loading
            $('#'+id_modal).modal({
                backdrop: 'static',
                keyboard: false
            });
        } else {
            //fecha o loading
            $('#'+id_modal).modal('hide');
        }
    };

    $.fn.exibirMensagemJanela = function (mensagem, tipo){
        seletor = (this.selector)?this[0]:false;
        this.showMessageTarge({
            message: mensagem,
            type: tipo
        });
    };

    $.fn.showMessageTarge = function (options){
        destino = this.selector;
        seletor = (this.selector)?this[0]:false;
        if(typeof seletor === 'undefined'){
            console.log('Elemento DOM inexistente');
            return false;
        }
        
        if(typeof options!=='object' || !options.hasOwnProperty('type') ){
            console.log('Erro com alguns dos parametros verifique');
            return false;
        }
        
        var settings = $.extend({
            message:'',
            type:''
        }, options);
        
        if(settings.message.trim() == ''){
            switch (settings.type){
                case 'success':
                    settings.message = 'Operação realizada com sucesso.';
                    break;
                case 'warning':
                    settings.message = 'Alguma coisa não está certa, verifique.';
                    break;
                case 'danger':
                    settings.message = 'Algum erro aconteceu, verifique.';
                    break;
                default : 
                    console.log('Tipo de alerta inexistente, verifique.'); 
                    return false;
            }
            
        }
        
        
        $(destino)
                .html(settings.message)
                .removeClass()
                .addClass('col-lg-12 label label-'+settings.type)
                .attr('style','margin-bottom:5px;border-radius:0')
                .slideDown("slow", function(){
                    setTimeout(function(){ 
                       $(destino).hide();
                    }, 5000);
                });
                
        if (settings.type=='warning' || settings.type=='success'){
            $(destino).css({color:'#000'})
    }
    }
    
    function reposicionaModal (seletor, id_modal, modal){
            
            var pos_top = $(seletor).offset().top + parseInt($(seletor).css('padding-top'));
            var pos_left = $(seletor).offset().left + parseInt($(seletor).css('padding-left'));
            
            $(id_modal)
                .width( $(seletor).width() )
                .height( $(seletor).height() )
                .offset({top:pos_top, left:pos_left});
        

            //abre o alert
            $(id_modal).modal({
                backdrop: 'static',
                keyboard: false
            });

            $('.modal-backdrop')
                .width( $(seletor).width() )
                .height( $(seletor).height() )
                .offset({top:pos_top, left:pos_left})
    }
    
}(jQuery));