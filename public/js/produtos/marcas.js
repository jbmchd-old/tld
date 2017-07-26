
$(function () {

    function buscaFornecedores() {
        $.ajax({
            url: "/produtos/marcas/buscaFornecedores",
        }).done(function (result) {
            $('#marc_forn_select').html('<option value="0">Selecione...</option>');
            $('#modal_forn_select').html('');

            $(result).each(function (i, cada) {
                $('#marc_forn_select, #modal_forn_select').append('<option value="' + cada.id + '">' + cada.nome_razao + '</option>');
            })
        });

        limpaCampos();
    }

    function buscaMarcas(fornecedor_id) {
        $.ajax({
            url: "/produtos/marcas/buscaMarcas",
            data: {fornecedor_id: fornecedor_id}
        }).done(function (result) {
            var table = $('#marc_tabela tbody');
            table.html('');
            $(result).each(function (i, cada) {
                table
                    .append('<tr data-id="' + cada.id + '"><td>' + cada.id + '</td><td>' + cada.nome + '</td><td>' + cada.status + '</td><td>' + cada.obs + '</td><td style="text-align: center"><button type="button" ><i class="fa fa-edit"></i></button></td></tr>');

            });
//            $('.table').formatacao().tabela();
        });
    }

    function limpaCampos(){
        $('#marc_nome').val('');
        $('#marc_status').prop('checked',true);
        $('#marc_obs').val('');
    }
   
    function salvar(id, fornecedor_id, nome, status, obs) {

        $.ajax({
            url: "/produtos/marcas/salvar",
            data: {
                id: id,
                fornecedor_id: fornecedor_id,
                nome: nome,
                status: status,
                obs: obs,
            }
        }).done(function (result) {

            var div_alertas = (id > 0) ? '#marc_modal_alertas' : '#marc_alertas';
            if (result.hasOwnProperty('error')) {
                $(div_alertas).showMessageTarge({type: 'warning'});
                return false;
            }

            $('#marc_modal_marca').modal('hide');
            $('#marc_alertas').showMessageTarge({type: 'success'});

            var fornecedor = $('#marc_forn_select').val();
            buscaMarcas(fornecedor);
        });

    }
    
    $('#marc_forn_select').change(function () {
        var id = $(this).val();
        $('#marc_tabela tbody').html('');
        if (id > 0) {
            buscaMarcas(id);
        } else {
            limpaCampos();
        }

    });

    $('#marc_tabela').on('click', 'button', function () {

        var tds = $(this).parents('tr').children();

        var id = $(this).parents('tr').attr('data-id');
        var fornecedor_id = $('#marc_forn_select').val();
        
        var nome = tds.filter(':nth-child(2)').html();
        var status = tds.filter(':nth-child(3)').html();
        var obs = tds.filter(':nth-child(4)').html();

        $('#modal_forn_select').val(fornecedor_id);
        $('#modal_marc_id').val(id);
        $('#modal_marc_nome').val(nome);
        $('#modal_marc_status').prop('checked',(status == 'A')?true:false);
        $('#modal_marc_obs').val(obs);

//        $form().atrelaEventosPorAtributos($('#marc_modal_form').find(campos_texto.join()));

        $('#marc_modal_marca').modal();
    });

    $('#marc_desfazer').click(function () {
        $('#marc_nome').val('');
        $('#marc_status').prop('checked',true);
        $('#marc_obs').val('');
        
    });

    $('#marc_form').submit(function () {

        if( ! $(this).form_podeenviar()){ return false }; 
        
        var id = null;
        var fornecedor_id = $('#marc_forn_select').val();
        var nome = $('#marc_nome').val();
        var status = $('#marc_status').prop('checked')==true?'A':'I';
        var obs = $('#marc_obs').val();

        salvar(id, fornecedor_id, nome, status, obs);

        return false;
    });

    $('#marc_modal_form').submit(function () {
        
        if( ! $(this).form_podeenviar()){ return false }; 
        
        var id = $('#modal_marc_id').val();
        var fornecedor_id = $('#modal_forn_select').val();
        var nome = $('#modal_marc_nome').val();
        var status = $('#modal_marc_status').prop('checked')==true?'A':'I';
        var obs = $('#modal_marc_obs').val();

        salvar(id, fornecedor_id, nome, status, obs);
        
        return false;
    });

    $('.open-app[data-title=ProdMarcas]').click(function () {
        buscaFornecedores();
    });

});
