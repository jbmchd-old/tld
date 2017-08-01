$(function () {
    
    function buscarLancamentos(){
        
        var data_inicio = $('#finan_lanc_pesq_inicio').val().split('/').reverse().join('-');
        var data_fim = $('#finan_lanc_pesq_fim').val().split('/').reverse().join('-');
        var categoria_id = $('#finan_lanc_list_cat').val();
        var string = $('#finan_lanc_list_textopesquisar').val().trim().toLowerCase();
        
        $.ajax({
            url: '/finan/detalhamentos/buscaListagem',
            data:{
                inicio: data_inicio,
                fim: data_fim,
                categoria_id: categoria_id,
                string: string,
            }
        }).done(function(result){
            
            if(result.error > 1){
                $('#finan_lanc_lancamentos_alertas').showMessageTarge({type: 'info', message: 'Nenhum resultado encontrado.'})
                return false;
            }
            
            $('#finan_lanc_list_inicio').html(data_inicio);
            $('#finan_lanc_list_fim').html(data_fim);
            
            //==================================================================
            
            var lancamentos = result.lancamentos;
            var resumo = result.resumo;
            var categorias = result.categorias;
            var cheques = result.cheques;
            
            $('#finan_lanc_list_tb_desp tbody, #finan_lanc_list_tb_rec tbody, #finan_lanc_list_tb_resumo_cat tbody, #finan_lanc_list_tb_resumo_cheques tbody').html('');
            
            
            $(lancamentos).each(function (i, cada){
                
                var background = cada.situacao=='P'?'#deffde':'#ffeaea';
                
                cada.dtavencimento = cada.dtavencimento?cada.dtavencimento.split('-').reverse().join('/'):'-';
                cada.dtapagamento = cada.dtapagamento?cada.dtapagamento.split('-').reverse().join('/'):'-';
                cada.tipopagamento = cada.tipopagamento?cada.tipopagamento:'';
                
                if(cada.tipo === 'R'){
                    $('#finan_lanc_list_tb_rec tbody').append('<tr data-id="'+cada.id+'" style="background:'+background+'"><td>'+cada.id+'</td><td>'+cada.descricao+'</td><td data-tipo="currency">'+cada.valor+'</td><td>'+cada.categoria_nome+'</td><td>'+cada.situacao+'</td><td>'+cada.dtavencimento+'</td><td>'+cada.dtapagamento+'</td><td>'+cada.tipopagamento+'</td><td><button type="button" class="btn btn-default" name="edit"><i class="fa fa-edit"></i></button></td></tr>');
                }
                
                if(cada.tipo === 'D'){
                    $('#finan_lanc_list_tb_desp tbody').append('<tr data-id="'+cada.id+'" style="background:'+background+'"><td>'+cada.id+'</td><td>'+cada.descricao+'</td><td data-tipo="currency">'+cada.valor+'</td><td>'+cada.categoria_nome+'</td><td>'+cada.situacao+'</td><td>'+cada.dtavencimento+'</td><td>'+cada.dtapagamento+'</td><td>'+cada.tipopagamento+'</td><td><button type="button" class="btn btn-default" name="edit"><i class="fa fa-edit"></i></button></td></tr>');
                }    
            });
            
            $(categorias).each(function (i, cada){
            
                var situacao = cada.situacao=='A'?'Aberto':'Pago';
                var tipo = cada.tipo=='R'?'Receita':'Despesa';
                
                $('#finan_lanc_list_tb_resumo_cat tbody').append('<tr><td>'+cada.nome+'</td><td>'+tipo+'</td><td>'+situacao+'</td><td data-tipo="currency">'+cada.total+'</td></tr>');
                
            });
            $(cheques).each(function (i, cada){
            
                var situacao = cada.situacao=='A'?'Aberto':'Pago';
                var tipo = cada.tipo=='R'?'Receita':'Despesa';
                
                $('#finan_lanc_list_tb_resumo_cheques tbody').append('<tr><td>'+cada.nome+'</td><td>'+tipo+'</td><td>'+situacao+'</td><td data-tipo="currency">'+cada.total+'</td></tr>');
                
            });
            
            var rec_total = parseFloat(resumo.receita_receber)+parseFloat(resumo.receita_caixa);
            var desp_total = parseFloat(resumo.despesa_pagar)+parseFloat(resumo.despesa_paga);
            var dizimo = resumo.dizimo>0?resumo.dizimo:0;
            var cor_saldo = resumo.caixa_total>=0?'blue':'red';
            
            $('#finan_lanc_list_total_rec_receber').html(' R$ '+resumo.receita_receber);
            $('#finan_lanc_list_total_rec_caixa').html(' R$ '+resumo.receita_caixa);
            $('#finan_lanc_list_total_rec').html(' R$ '+rec_total.toFixed(2));
            
            $('#finan_lanc_list_total_desp_pagar').html(' R$ '+resumo.despesa_pagar);
            $('#finan_lanc_list_total_desp_paga').html(' R$ '+resumo.despesa_paga);
            $('#finan_lanc_list_total_desp').html(' R$ '+desp_total.toFixed(2));
            
            $('#finan_lanc_list_caixa_rec').html(' R$ '+resumo.receita_caixa).attr('style','color:blue');
            $('#finan_lanc_list_caixa_desp').html(' - R$ '+resumo.despesa_paga).attr('style','color:red');
            $('#finan_lanc_list_caixa_total').html(' R$ '+resumo.caixa_total).attr('style','color:'+cor_saldo);
            $('#finan_lanc_list_dizimo').html(' R$ '+dizimo).attr('style','color:blue');
            
        });
        
    }
    
    function buscarCategorias(){
        $.ajax({
            url: '/finan/categorias/buscaCategorias',
        }).done(function(result){
             $(result).each(function (i, cada){
                $('#finan_lanc_list_cat').append('<option value="'+cada.id+'">'+cada.nome+'</option>');
            });
        });
    }
    
    /*CAMPOS DE DATA - INICIO*/
    $("#finan_lanc_pesq_inicio, #finan_lanc_pesq_fim").datepicker({
        changeMonth: true,
        changeYear: true,
    });
    $("#finan_lanc_pesq_inicio" ).datepicker( "setDate", "-32" );
    $("#finan_lanc_pesq_fim" ).datepicker( "setDate", "0" );
    /*CAMPOS DE DATA - FIM*/
    
    $('#finan_lanc_list_tb_rec, #finan_lanc_list_tb_desp').on('click', 'button', function (){
        var id = $(this).parents('tr').attr('data-id');
        
        $.ajax({
            url: '/finan/lancamentos/buscaLancamento',
            data:{ id:id }
        }).done(function (result){
            
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
            
            if(result.tipopagamento == 'AV'){
                $('#finan_lanc_tipopagamento :radio[value="AV"]').prop('checked', true);
            } else {
                $('#finan_lanc_tipopagamento :radio[value="CH"]').prop('checked', true);
            }
            
            $('#finan_lanc_situacao').change();
            $('#finan_lanc_id').val(id);
            
            $('li.open-app[data-title="FinanLanc"]').click();
            
        });
        
        return false;
    });
    
    $('#finan_lanc_list_pesquisar, #finan_lanc_list_atualizartela').click(function (){
        buscarLancamentos();
    });
    
    $('#finan_lanc_list_textopesquisar').keypress(function (e){
        if(e.which == 13) { buscarLancamentos();}
    });
    
    $('#finan_lanc_list_form').submit(function (){
        
        if( ! $(this).form_podeenviar()){ return false }; 
        
        $('#finan_lanc_list_filtrar').click();
        return false;
    });
    
    $('.open-app[data-title=FinanDet]').click(function (){
        buscarLancamentos();
        buscarCategorias();
    });
    
    $('#finan_lanc_list_tb_resumo_cat_btn').click(function (){
        var el = $('#finan_lanc_list_tb_resumo_cat');
        el.toggleClass('hide');
        if(el.hasClass('hide')){
            $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });
    
    $('#finan_lanc_list_tb_resumo_cheques_btn').click(function (){
        var el = $('#finan_lanc_list_tb_resumo_cheques');
        el.toggleClass('hide');
        if(el.hasClass('hide')){
            $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });
    
});
