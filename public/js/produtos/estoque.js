$(function () {
    
    function buscaFornecedores() {
        $.ajax({
            url: "/produtos/buscaFornecedores",
        }).done(function (result) {
            $('#prod_est_forn_select, #prod_est_modal_forn_select').html('<option value="0">Todas...</option>');

            $(result).each(function (i, cada) {
                $('#prod_est_forn_select, #prod_est_modal_forn_select').append('<option value="' + cada.id + '">' + cada.nome_razao + '</option>');
            })
        });
    }

    function buscaCategorias() {
        $.ajax({
            url: "/produtos/buscaCategorias",
        }).done(function (result) {
            $('#prod_est_categoria_select, #prod_est_modal_categoria_select').html('<option value="0">Todas...</option>');
            
            $(result).each(function (i, cada) {
                $('#prod_est_categoria_select, #prod_est_modal_categoria_select').append('<option value="' + cada.id + '">' + cada.nome + '</option>');
            });
        });
    }

    function buscaMarcas(fornecedor_id, destino, selecionar_id) {
        $.ajax({
            url: "/produtos/buscaMarcas",
            data: {fornecedor_id: fornecedor_id}
        }).done(function (result) {
            $(destino).html('<option value="0">Todas...</option>');

            $(result).each(function (i, cada) {
                $(destino).append('<option value="' + cada.id + '">' + cada.nome + '</option>');
            })
        }).always(function (){
            if(selecionar_id){
                $(destino).val(selecionar_id)
            }
        });
    }
    
    function buscaProdutos() {
        $('#prod_est_busca').val('');
        var fornecedor_id = $('#prod_est_forn_select').val();
        var marca_id = $('#prod_est_marca_select').val();
        var categoria_id = $('#prod_est_categoria_select').val();
        var nome = $('#prod_est_busca').val();
        
        $.ajax({
            url: "/produtos/buscaProdutos",
            data: {
                fornecedor_id: fornecedor_id,
                marca_id: marca_id,
                categoria_id: categoria_id,
                nome: nome,
            }
        }).done(function (result) {
            var table = $('#prod_est_tabela tbody');
            table.html('');
            $(result.produtos).each(function (i, cada) {
                var categoria = $('#prod_est_categoria_select option[value="'+cada.categoria_id+'"]').html();
                table
                    .append('<tr data-id="'+cada.id+'" data-marca_id="'+cada.marca_id+'"><td>'+cada.id+'</td><td>'+cada.marca+'</td><td>'+categoria+'</td><td>'+cada.codigoauxiliar+'</td><td data-name="descricao">'+cada.descricao+'</td><td>'+cada.quantidade+'</td><td>'+cada.unidade+'</td><td>'+cada.espessura+'</td><td data-tipo="currency">'+cada.precocusto+'</td><td data-tipo="currency">'+cada.precovenda+'</td><td>'+cada.status+'</td><td>'+cada.obs+'</td><td style="text-align:center"><button type="button"><i class="fa fa-edit"></i></button></td></tr>');
            });
            
//            $("#prod_est_busca").autocomplete({
//                source: result.autocomplete,
//                minLength: 1,
//                select: function( e, u ) {var string = u.item.value.split(' - ').pop(); filtraTabela(string)}
//            });
            
        });
    }
    
    function salvar(id, marca_id, categoria_id, descricao, quantidade, unidade, espessura, precocusto, precovenda, obs, status, codigoauxiliar) {
        
        $.ajax({
            url: "/produtos/lancamentos/salvar",
            data: {
                id: id,
                marca_id: marca_id,
                categoria_id: categoria_id,
                descricao: descricao,
                quantidade: quantidade,
                unidade: unidade,
                espessura: espessura,
                precocusto: precocusto,
                precovenda: precovenda,
                obs: obs,
                status: status,
                codigoauxiliar: codigoauxiliar
            }
        }).done(function (result) {

            var div_alertas = '#prod_est_modal_alertas';
            if (result.hasOwnProperty('error')) {
                $(div_alertas).showMessageTarge({type: 'warning'});
                return false;
            }

            $('#prod_est_modal_alertas').showMessageTarge({type: 'success'});

            buscaProdutos();
            limpaCampos();
        });
    }
    
    function limpaCampos() {
        $('#prod_form').find('.form-control').each(function () {
            if (this.tagName == 'SELECT') {
                if(this.id != 'prod_forn_select'){ this.value = $(this).find('option:first').val(); }
            } else {
                $(this).val('');
            }
            $('#prod_status').prop('checked', true);
        });
    }
    
    function filtraTabela(string){
        string = string.trim().toUpperCase();
        
        $('#prod_est_tabela tbody td[data-name=descricao]').each(function (key, td){
            if($(td).html().trim().toUpperCase().indexOf(string)>-1){
                $(td).parent().show();
            } else {
                $(td).parent().hide();
            }
        })
    }
    
    $('#prod_est_busca').keyup(function (){
        filtraTabela($(this).val());
    });
    
    $('#prod_est_forn_select').change(function () {
        var id = $(this).val();
        if (id > 0) {
            buscaMarcas(id, '#prod_est_marca_select');
        } else {
            $(this).val(0);
        }
    });

    $('#prod_est_forn_select, #prod_est_marca_select, #prod_est_categoria_select').change(function (){
        buscaProdutos();
    });

    $('#prod_est_tabela').on('click', 'button', function () {
        
        var id = $(this).parents('tr').attr('data-id');
        
        $.ajax({
            url: "/produtos/buscaProduto",
            data: {id: id}
        }).done(function (result) {
            
            var forn_id = result.fornecedor_id;
            var marca_id = result.marca_id;
            
            buscaMarcas(forn_id, '#prod_est_modal_marca_select', marca_id);
            
            var categoria_id = result.categoria_id;
            var codaux = result.codigoauxiliar;
            var descricao = result.descricao;
            var quantidade = result.quantidade;
            var unidade = result.unidade;
            var espessura = result.espessura;
            var precocusto = result.precocusto;
            var precovenda = result.precovenda;
            var status = result.status;
            var obs = result.obs;

            $('#prod_est_modal_id').val(id);
            $('#prod_est_modal_forn_select').val(forn_id);
            $('#prod_est_modal_marca_select').val(marca_id);
            $('#prod_est_modal_categoria_select').val(categoria_id);
            $('#prod_est_modal_codauxiliar').val(codaux);
            $('#prod_est_modal_descricao').val(descricao);
            $('#prod_est_modal_quantidade').val(quantidade);
            $('#prod_est_modal_unidade').val(unidade);
            $('#prod_est_modal_espessura').val(espessura);
            $('#prod_est_modal_precocusto').val(precocusto);
            $('#prod_est_modal_precovenda').val(precovenda);
            $('#prod_est_modal_obs').val(obs);
            $('#prod_est_modal_status').prop('checked', (status == 'A') ? true : false);
            
            
            $('#prod_est_modal').modal();
            
        });
        
    });

    $('#prod_est_modal_form').submit(function () {

        if (!$(this).form_podeenviar()) {
            return false
        }

        var id = $('#prod_est_modal_id').val();
        var marca_id = $('#prod_est_modal_marca_select').val();
        var categoria_id = $('#prod_est_modal_categoria_select').val();
        var descricao = $('#prod_est_modal_descricao').val();
        var quantidade = $('#prod_est_modal_quantidade').val();
        var unidade = $('#prod_est_modal_unidade').val();
        var espessura = $('#prod_est_modal_espessura').val();
        var precocusto = $('#prod_est_modal_precocusto').val();
        var precovenda = $('#prod_est_modal_precovenda').val();
        var obs = $('#prod_est_modal_obs').val();
        var status = ($('#prod_est_modal_status').prop('checked') == true) ? 'A' : 'I';
        var codigoauxiliar = $('#prod_est_modal_codauxiliar').val();

        salvar(id, marca_id, categoria_id, descricao, quantidade, unidade, espessura, precocusto, precovenda, obs, status, codigoauxiliar);
        
        return false;

    });

    $('.open-app[data-title=ProdEst]').click(function () {
        buscaFornecedores();
        buscaCategorias();
        buscaProdutos();
        limpaCampos();
    });
    
    $('#prod_est_form').submit(function (){
        return false;
    })
});
