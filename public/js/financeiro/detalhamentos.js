$(function () {
    
    function buscarLancamentos(){
        
        var data_inicio = $('#finan_det_pesq_inicio').val().split('/').reverse().join('-');
        var data_fim = $('#finan_det_pesq_fim').val().split('/').reverse().join('-');
        var caixa_id = $('#finan_det_list_caixas').val();
        var categoria_id = $('#finan_det_list_cat').val();
        var string = $('#finan_det_list_textopesquisar').val().trim().toLowerCase();
        
        $.ajax({
            url: '/finan/detalhamentos/buscaListagem',
            data:{
                inicio: data_inicio,
                fim: data_fim,
                caixa_id: caixa_id,
                categoria_id: categoria_id,
                string: string,
            }
        }).done(function(result){
            
            if(result.error > 1){
                $('#finan_det_lancamentos_alertas').showMessageTarge({type: 'info', message: 'Nenhum resultado encontrado.'})
                return false;
            }
            
            $('#finan_det_list_inicio').html(data_inicio);
            $('#finan_det_list_fim').html(data_fim);
            
            //==================================================================
            
            var lancamentos = result.lancamentos;
            var resumo = result.resumo;
            var categorias = result.categorias;
            var cheques = result.cheques;
            
            $('#finan_det_list_tb_desp tbody, #finan_det_list_tb_rec tbody, #finan_det_list_tb_resumo_cat tbody, #finan_det_list_tb_resumo_cheques tbody').html('');
            
            
            $(lancamentos).each(function (i, cada){
                
                var background = cada.situacao=='P'?'#deffde':'#ffeaea';
                
                cada.dtavencimento = cada.dtavencimento?cada.dtavencimento.split('-').reverse().join('/'):'-';
                cada.dtapagamento = cada.dtapagamento?cada.dtapagamento.split('-').reverse().join('/'):'-';
                cada.formapagto = cada.formapagto?cada.formapagto:'';
                
                var descricao = cada.descricao;
                if(cada.total_parcelas>1){
                    descricao = cada.descricao+' '+cada.num+'/'+cada.total_parcelas
                }
                
                if(cada.tipo === 'R'){
                    $('#finan_det_list_tb_rec tbody').append('<tr data-id="'+cada.id+'" style="background:'+background+'"><td>'+cada.id+'</td><td>'+descricao+'</td><td data-tipo="currency">'+cada.valor+'</td><td>'+cada.categoria_nome+'</td><td>'+cada.situacao+'</td><td>'+cada.dtavencimento+'</td><td>'+cada.dtapagamento+'</td><td>'+cada.formapagto+'</td><td><button type="button" class="btn btn-default" name="edit"><i class="fa fa-edit"></i></button></td></tr>');
                }
                
                if(cada.tipo === 'D'){
                    $('#finan_det_list_tb_desp tbody').append('<tr data-id="'+cada.id+'" style="background:'+background+'"><td>'+cada.id+'</td><td>'+descricao+'</td><td data-tipo="currency">'+cada.valor+'</td><td>'+cada.categoria_nome+'</td><td>'+cada.situacao+'</td><td>'+cada.dtavencimento+'</td><td>'+cada.dtapagamento+'</td><td>'+cada.formapagto+'</td><td><button type="button" class="btn btn-default" name="edit"><i class="fa fa-edit"></i></button></td></tr>');
                }    
            });
            
            $(categorias).each(function (i, cada){
            
                var situacao = cada.situacao=='A'?'Aberto':'Pago';
                var tipo = cada.tipo=='R'?'Receita':'Despesa';
                
                $('#finan_det_list_tb_resumo_cat tbody').append('<tr><td>'+cada.nome+'</td><td>'+tipo+'</td><td>'+situacao+'</td><td data-tipo="currency">'+cada.total+'</td></tr>');
                
            });
            $(cheques).each(function (i, cada){
            
                var situacao = cada.situacao=='A'?'Aberto':'Pago';
                var tipo = cada.tipo=='R'?'Receita':'Despesa';
                
                $('#finan_det_list_tb_resumo_cheques tbody').append('<tr><td>'+cada.nome+'</td><td>'+tipo+'</td><td>'+situacao+'</td><td data-tipo="currency">'+cada.total+'</td></tr>');
                
            });
            
            var rec_total = parseFloat(resumo.receita_receber)+parseFloat(resumo.receita_caixa);
            var desp_total = parseFloat(resumo.despesa_pagar)+parseFloat(resumo.despesa_paga);
            var dizimo = resumo.dizimo>0?resumo.dizimo:0;
            var cor_saldo = resumo.caixa_total>=0?'blue':'red';
            
            $('#finan_det_list_total_rec_receber').html(' R$ '+resumo.receita_receber);
            $('#finan_det_list_total_rec_caixa').html(' R$ '+resumo.receita_caixa);
            $('#finan_det_list_total_rec').html(' R$ '+rec_total.toFixed(2));
            
            $('#finan_det_list_total_desp_pagar').html(' R$ '+resumo.despesa_pagar);
            $('#finan_det_list_total_desp_paga').html(' R$ '+resumo.despesa_paga);
            $('#finan_det_list_total_desp').html(' R$ '+desp_total.toFixed(2));
            
            $('#finan_det_list_caixa_rec').html(' R$ '+resumo.receita_caixa).attr('style','color:blue');
            $('#finan_det_list_caixa_desp').html(' - R$ '+resumo.despesa_paga).attr('style','color:red');
            $('#finan_det_list_caixa_total').html(' R$ '+resumo.caixa_total).attr('style','color:'+cor_saldo);
            $('#finan_det_list_dizimo').html(' R$ '+dizimo).attr('style','color:blue');
            
        });
        
    }
    
    function buscarCaixas() {
        $.ajax({
            url: '/finan/caixas/buscaCaixas',
        }).done(function (result) {
            $('#finan_det_list_caixas').html('<option value="0">Todos</option>');
            
            $(result).each(function (i, cada) {
                $('#finan_det_list_caixas').append('<option value="' + cada.id + '">' + cada.nome + '</option>');
            });

        });
    }
    
    function buscarCategorias(){
        $.ajax({
            url: '/finan/categorias/buscaCategorias',
        }).done(function(result){
            $('#finan_det_list_cat').html('<option value="0">Todas</option>');
             $(result).each(function (i, cada){
                $('#finan_det_list_cat').append('<option value="'+cada.id+'">'+cada.nome+'</option>');
            });
        });
    }
    
    $('#finan_det_categorias_btn').click(function () {
        $('#finan_det_resumocat').modal();
    });
    
    $('#finan_det_caixas_btn').click(function () {
        $('#finan_det_resumocheques').modal();
    });
    
    /*CAMPOS DE DATA - INICIO*/
    $("#finan_det_pesq_inicio, #finan_det_pesq_fim").datepicker({
        changeMonth: true,
        changeYear: true,
    });
    $("#finan_det_pesq_inicio" ).datepicker( "setDate", "-32" );
    $("#finan_det_pesq_fim" ).datepicker( "setDate", "0" );
    /*CAMPOS DE DATA - FIM*/
    
    $('#finan_det_list_tb_rec, #finan_det_list_tb_desp').on('click', 'button', function (){
        var id = $(this).parents('tr').attr('data-id');
        finan_lanc_carregalancamento(id, 'detalhamentos');
        return false;
    });
    
    $('#finan_det_list_pesquisar').click(function (){
        buscarLancamentos();
    });
    
    $('#finan_det_list_imprimir').click(function (){
        var dtainicio = $('#finan_det_pesq_inicio').val().split('/').reverse().join('-');
        var dtafim = $('#finan_det_pesq_fim').val().split('/').reverse().join('-');
        var cat = $('#finan_det_list_cat').val();
        var cat_nome = $('#finan_det_list_cat option:selected').html();
        var string = $('#finan_det_list_textopesquisar').val();
        
        var url = '/finan/detalhamentos/imprimir/'+dtainicio+'/'+dtafim+'/'+cat+'/'+cat_nome;
        
        if(string){url+='/'+string}
        
        window.open(url, '_blank');
        
        
    });
    
    $('#finan_det_list_textopesquisar').keypress(function (e){
        if(e.which == 13) { buscarLancamentos();}
    });
    
    $('#finan_det_list_form').submit(function (){
        
        if( ! $(this).form_podeenviar()){ return false }; 
        
        $('#finan_det_list_filtrar').click();
        return false;
    });
    
    $('.open-app[data-title=FinanDet]').click(function (){
        buscarLancamentos();
        buscarCaixas();
        buscarCategorias();
    });
});
