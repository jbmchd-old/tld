$(function () {

    function buscaLancamentosPorValor(valor) {
        $.ajax({
            url: '/finan/ofx/buscaLancamentosPorValor',
            data:{valor:valor}
        }).done(function (result) {
            
            $('#finan_importofx_lanc_tb_sug tbody').html('');
            $(result).each(function (i, lanc){
                $('#finan_importofx_lanc_tb_sug tbody').append('<tr data-id="'+lanc.parcela_id+'"><td>'+lanc.parcela_id+'</td><td>'+lanc.descricao+'</td><td>'+lanc.valor+'</td><td>'+lanc.situacao+'</td><td>'+lanc.dtavencimento+'</td><td><button class="btn btn-default"><i class="fa fa-check"></i></button></td></tr>');
            });
            
            $('#finan_importofx_lancamento').modal();
        });
    };

    function buscarLancamentos() {
        var data_inicio = $('#finan_importofx_lanc_pesq_inicio').val().split('/').reverse().join('-');
        var data_fim = $('#finan_importofx_lanc_pesq_fim').val().split('/').reverse().join('-');
        
        $.ajax({
            url: '/finan/ofx/buscarLancamentos',
            data:{
                inicio: data_inicio,
                fim: data_fim,
            }
        }).done(function(result){
            if(result.error){
                $('#finan_importofx_lanc_alertas').showMessageTarge({type: 'info', message: 'Nenhum resultado encontrado.'})
                return false;
            }
            
            var lancamentos = result.table;
            
            $('#finan_importofx_lanc_tb_lanc tbody').html('');
            $(lancamentos).each(function (i, lanc){
                var dtavencimento = lanc.dtavencimento.split('-').reverse().join('/');
                $('#finan_importofx_lanc_tb_lanc tbody').append('<tr data-id="'+lanc.parcela_id+'"><td>'+lanc.parcela_id+'</td><td>'+lanc.descricao+'</td><td>'+lanc.valor+'</td><td>'+lanc.situacao+'</td><td>'+dtavencimento+'</td><td><button class="btn btn-default"><i class="fa fa-check"></i></button></td></tr>');
            });
            
        });
    };

    function exibeTransacoes(transacoes){
        $('#finan_importofx_trn_tab tbody').html('');
        $(transacoes).each(function (i, trn){
            $('#finan_importofx_trn_tab tbody').append('<tr><td>'+trn.tipo+'</td><td>'+trn.data+'</td><td>'+trn.valor+'</td><td>'+trn.descricao+'</td><td><button class="btn btn-default"><i class="fa fa-money"></i></button></td></tr>');
        });
        
        $('#finan_importofx_trn').modal();
    }

    function salvar(alteracoes) {
        $.ajax({
            url: '/finan/ofx/salvar',
            data:{data:alteracoes}
        }).done(function (result) {
            if(result.error){
                $('#finan_importofx_trn_alertas').showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique.'})
            } else {
                $('#finan_importofx_trn_alertas').showMessageTarge({type: 'success', message: 'Tudo certo :)'})
            }
        });
    };

    $('#finan_importofx_form').ajaxForm(function (result) {
        
        if (!result.error) {
            exibeTransacoes(result);
        } else {
            $().alert({titulo: 'Problema!', texto: 'Ocorreu algum problema com a seguinte mensagem:<br /> ' + result.message + ''});
        }
    });
    
    $("#finan_importofx_trn_tab tbody").on("click", "button", function(){
        var valor = parseFloat($(this).parents('tr').find('td:nth-child(3)').html());
        $(this).parents('tr').attr('data-flag','last-click');
        
        if(valor<0){
            valor *= -1;
        }
        buscaLancamentosPorValor(valor);
        buscarLancamentos();
    });
    
    $('#finan_importofx_trn_concluir').click(function (){
        var alteracoes = [];
        $('#finan_importofx_trn_tab tbody tr').filter(function(){if($(this).attr('data-id')>0) return true;}).each(function (i, tr){
            var id = $(tr).attr('data-id');
            var dtapagamento = $(tr).find('td:nth-child(2)').html();
            alteracoes.push({
                id:id,
                dtapagamento:dtapagamento
            });
        });
        
        salvar(alteracoes);
    });
    
    //============= MODAL - LANCAMENTOS ==============
  
    $("#finan_importofx_lanc_pesq_inicio, #finan_importofx_lanc_pesq_fim").datepicker({
        changeMonth: true,
        changeYear: true,
    });
    $("#finan_importofx_lanc_pesq_inicio" ).datepicker( "setDate", "-32" );
    $("#finan_importofx_lanc_pesq_fim" ).datepicker( "setDate", "0" );
  
    $('#finan_importofx_lanc_pesquisar').click(function (){
        buscarLancamentos();
    });
    
    $("#finan_importofx_lanc_tb_sug tbody, #finan_importofx_lanc_tb_lanc tbody").on("click", "button", function(){
        var id=$(this).parents('tr').attr('data-id');
        $("#finan_importofx_trn_tab tbody tr[data-flag=last-click]").attr('data-id',id).addClass('success');
        $('#finan_importofx_lancamento').modal('hide');
    });
   
   $('#finan_importofx_lancamento').on('hidden.bs.modal', function (e) {
        $("#finan_importofx_trn_tab tbody tr[data-flag=last-click]").removeAttr('data-flag');
    });
});
