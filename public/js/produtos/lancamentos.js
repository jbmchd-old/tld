$(function () {

    function buscaFornecedores() {
        $.ajax({
            url: "/produtos/buscaFornecedores",
        }).done(function (result) {
            $('#prod_forn_select').html('<option value="0">Selecione...</option>');

            $(result).each(function (i, cada) {
                $('#prod_forn_select').append('<option value="' + cada.id + '">' + cada.nome_razao + '</option>');
            })
        });

        limpaCampos();
    }

    function buscaCategorias() {
        $.ajax({
            url: "/produtos/buscaCategorias",
        }).done(function (result) {
            $('#prod_categoria_select').html('<option value="0">Selecione...</option>');
            $(result).each(function (i, cada) {
                if(cada.status==='A'){
                    $('#prod_categoria_select').append('<option value="' + cada.id + '">' + cada.nome + '</option>');
                }
            })
        });
    }

    function buscaMarcas(fornecedor_id) {
        $.ajax({
            url: "/produtos/lancamentos/buscaMarcas",
            data: {fornecedor_id: fornecedor_id}
        }).done(function (result) {
            $('#prod_marca_select').html('<option value="0">Selecione...</option>');

            $(result).each(function (i, cada) {
                $('#prod_marca_select').append('<option value="' + cada.id + '">' + cada.nome + '</option>');
            })
        });
    }

    function buscaProdutos() {

        var fornecedor_id = $('#prod_forn_select').val();

        $.ajax({
            url: "/produtos/lancamentos/buscaProdutos",
            data: {fornecedor_id: fornecedor_id}
        }).done(function (result) {
            var table = $('#prod_tabela tbody');
            table.html('');
            $(result).each(function (i, cada) {
                table.append('<tr data-id="' + cada.id + '" data-marca_id="' + cada.marca_id + '" data-veic_marca_id="' + cada.veic_marca_id + '"><td>' + cada.id + '</td><td>' + cada.marca + '</td><td>' + cada.categoria + '</td><td>' + cada.codigoauxiliar + '</td><td>' + cada.descricao + '</td><td>' + cada.quantidade + '</td><td>' + cada.unidade + '</td><td style="text-align:center"><button type="button"><i class="fa fa-edit"></i></button></td></tr>');
            })
        });
    }

    function limpaCampos() {
        $('#prod_form').find('.form-control').each(function () {
            if (this.tagName == 'SELECT') {
                if (this.id != 'prod_forn_select') {
                    this.value = $(this).find('option:first').val();
                }
            } else {
                $(this).val('');
            }
            $('#prod_id').val(null);
            $('#prod_status').prop('checked', true);
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

            var div_alertas = '#prod_alertas';
            if (result.hasOwnProperty('error')) {
                $(div_alertas).showMessageTarge({type: 'warning'});
                return false;
            }

            $('#prod_alertas').showMessageTarge({type: 'success'});

            buscaProdutos();
            limpaCampos();
        });
    }

    $('#prod_forn_select').change(function () {
        var id = $(this).val();
        if (id > 0) {
            buscaMarcas(id);
            buscaCategorias();
            buscaProdutos();
        } else {
            limpaCampos();
            $('#prod_tabela tbody').html('');
        }
    });

    $('#prod_desfazer').click(function () {
        limpaCampos();
    });

    $('#prod_form').submit(function () {

        if (!$(this).form_podeenviar()) {
            return false
        }

        var id = $('#prod_id').val();
        var marca_id = $('#prod_marca_select').val();
        var categoria_id = $('#prod_categoria_select').val();
        var descricao = $('#prod_descricao').val();
        var quantidade = $('#prod_quantidade').val();
        var unidade = $('#prod_unidade').val();
        var espessura = $('#prod_espessura').val();
        var precocusto = $('#prod_precocusto').val();
        var precovenda = $('#prod_precovenda').val();
        var obs = $('#prod_obs').val();
        var status = ($('#prod_status').prop('checked') == true) ? 'A' : 'I';
        var codigoauxiliar = $('#prod_codauxiliar').val();

        salvar(id, marca_id, categoria_id, descricao, quantidade, unidade, espessura, precocusto, precovenda, obs, status, codigoauxiliar);

        return false;
    });

    $('#prod_tabela').on('click', 'button', function () {

        var id = $(this).parents('tr').attr('data-id');
        var marca_id = $(this).parents('tr').attr('data-marca_id');

        $.ajax({
            url: "/produtos/buscaProduto",
            data: {id: id}
        }).done(function (result) {

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

            $('#prod_id').val(id);
            $('#prod_marca_select').val(marca_id);
            $('#prod_categoria_select').val(categoria_id);
            $('#prod_codauxiliar').val(codaux);
            $('#prod_descricao').val(descricao);
            $('#prod_quantidade').val(quantidade);
            $('#prod_unidade').val(unidade);
            $('#prod_espessura').val(espessura);
            $('#prod_precocusto').val(precocusto);
            $('#prod_precovenda').val(precovenda);
            $('#prod_obs').val(obs);
            $('#prod_status').prop('checked', (status == 'A') ? true : false);

        });

    });

    $('.open-app[data-title=ProdLanc]').click(function (a) {
        console.log(a);
        buscaFornecedores();
        limpaCampos();
    });

});
