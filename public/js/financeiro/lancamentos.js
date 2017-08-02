
$(function () {

    $("#finan_lanc_dtavencimento, #finan_lanc_dtapagamento").datepicker({
        changeMonth: true,
        changeYear: true,
        setDate:0,
    });

    function buscaCategorias(){
        $.ajax({
            url: '/finan/categorias/buscaCategorias',
        }).done(function (result) {
            
            $(result).each(function (i, cada){
                $('#finan_lanc_cat, #finan_lanc_modal_cat').append('<option value="'+cada.id+'">'+cada.nome+'</option>');
            });
            
        });
    }

    function buscaUltimosLancamentos(){
        $.ajax({
            url: '/finan/lancamentos/buscaUltimosLancamentos',
        }).done(function (result) {
            $('#finan_lanc_tab_ultlanc tbody').html('');
            $(result).each(function (i, cada){
                $('#finan_lanc_tab_ultlanc tbody').append('\
                    <tr data-id="'+cada.id+'">\
                        <td>'+cada.id+'</td>\
                        <td>'+cada.descricao+'</td>\
                        <td data-tipo="date">'+cada.dtainclusao+'</td>\
                        <td><button class="btn btn-default"><i class="fa fa-edit"></i></button></td>\
                    </tr>'
                );
            }); 

            $('#finan_lanc_tab_ultlanc').table_defaults();
            
        });
    }

    function salvar(id, categoria, descricao, tipo, dtavencimento, valor, situacao, dtapagamento, tipopagamento){
        
        $.ajax({
            url: '/finan/lancamentos/salvar',
            data:{
                id:id,
                categoria_id:categoria,
                descricao:descricao,
                tipo:tipo,
                dtavencimento:dtavencimento,
                valor:valor,
                situacao:situacao,
                dtapagamento:dtapagamento,
                tipopagamento:tipopagamento
            }
        }).done(function (result) {
            
            if(!result.ok){
                if(id>0){
                    $('#finan_lanc_modal_alertas').showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique.'})
                } else {
                    $('#finan_lanc_alertas').showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique.'})
                }
                return false;
            }
            
            $('#finan_lanc_modal').modal('hide');
            $('#finan_lanc_alertas').showMessageTarge({type: 'success', message: 'Operação realizada com sucesso.'})
            limpaCampos();
            buscaUltimosLancamentos();
            
        });
        
    }

    function limpaCampos(){
        $('#finan_lanc_cat').val(1);
        $('#finan_lanc_id, #finan_lanc_descricao, #finan_lanc_valor').val('');
        $('#finan_lanc_situacao').prop('checked',false);
        $('#finan_lanc_pagamento').addClass('hide');
        
    }
    
    $('#finan_lanc_situacao').change(function (){
        
        if($(this).prop('checked')){
            $('#finan_lanc_dtapagamento').parents('.finan_lanc_dtapagamento').removeClass('hide');
        } else {
            $('#finan_lanc_dtapagamento').parents('.finan_lanc_dtapagamento').addClass('hide');
            $('#finan_lanc_dtapagamento').val(null);
        }
    });

    $('#finan_lanc_form').submit(function (){

        if( ! $(this).form_podeenviar()){ return false }; 
        
        var descricao = $('#finan_lanc_descricao').val();
        var valor = $('#finan_lanc_valor').val();
        
        if(descricao.trim().length < 1 || valor.trim().length < 1){
            $('#finan_lanc_alertas').showMessageTarge({type: 'warning', message: 'Verifique os campos obrigatórios.'})
            return false;   
        }
        
        var id = $('#finan_lanc_id').val();
        var categoria = $('#finan_lanc_cat').val();
        var tipo = $('#finan_lanc_tipo :radio:checked').val();
        var dtavencimento = $('#finan_lanc_dtavencimento').val().split('/').reverse().join('-');
        var valor = $('#finan_lanc_valor').val();
        var situacao = $('#finan_lanc_situacao').prop('checked')?'P':'A';
        var dtapagamento = situacao=='P'?$('#finan_lanc_dtapagamento').val():null;
        var tipopagamento = $('#finan_lanc_tipopagamento :radio:checked').val();
//        var tipopagamento = (dtapagamento)?$('#finan_lanc_tipopagamento :radio:checked').val():null;
        
        salvar(id, categoria, descricao, tipo, dtavencimento, valor, situacao, dtapagamento, tipopagamento);
        
        return false;
    });

    $('#finan_lanc_tab_ultlanc').on('click', 'button', function (){
        var id = $(this).parents('tr').attr('data-id');
        
        $.ajax({
            url: '/finan/lancamentos/buscaLancamento',
            data:{ id: id }
        }).done(function (result){
            $('#finan_lanc_id').val(result.id);
            $('#finan_lanc_cat').val(result.categoria_id);
            $('#finan_lanc_descricao').val(result.descricao);
            
            if(result.tipo == 'D'){
                $('#finan_lanc_tipo :radio[value="D"]').prop('checked', true);
            } else {
                $('#finan_lanc_tipo :radio[value="R"]').prop('checked', true);
            }
            
            $('#finan_lanc_dtavencimento').val(result.dtavencimento.split('-').reverse().join('/'));
            $('#finan_lanc_valor').val(result.valor);
            $('#finan_lanc_situacao').prop('checked', (result.situacao=='P'?true:false));
            
            if($('#finan_lanc_situacao').prop('checked')){
                $('#finan_lanc_dtapagamento').val(result.dtapagamento==null?null:result.dtapagamento.split('-').reverse().join('/'));
            }
            
            $('#finan_lanc_tipopagamento :radio[value="'+result.tipopagamento+'"]').prop('checked', true);
            
            $('#finan_lanc_situacao').change();
            $('#finan_lanc_id').val(id);
            
            $('#finan_lanc_modal').modal();
        });
        
        
        
        return false;
    });
   
    $('.open-app[data-title=FinanLanc]').click(function (){
        buscaCategorias();
        buscaUltimosLancamentos();
    });
    
    $('#finan_lanc_ultlanc_btn').click(function (){
        var el = $('#finan_lanc_tab_ultlanc tbody');
        el.toggleClass('hide');
        if(el.hasClass('hide')){
            $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });
});
