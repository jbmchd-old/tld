
$(function () {

    var aux_veic_id_select = 0;

    function buscaClientes() {
        $.ajax({
            url: "/manut/buscaClientes",
        }).done(function (result) {
            $('#manut_cli_select, #manut_modal_cli_select').html('<option value="0">Selecione...</option>');

            $(result).each(function (i, cada) {
                $('#manut_cli_select, #manut_modal_cli_select').append('<option value="' + cada.id + '">' + cada.nome_razao + '</option>');
            })
        });

//        limpaCampos();
    }

    function buscaOrdensServico(cliente_id) {
        $.ajax({
            url: "/manut/buscaOrdensServico",
            data: {cliente_id: cliente_id}
        }).done(function (result) {
            $('#manut_tab_os tbody').html('');

            $(result).each(function (i, cada) {
                $('#manut_tab_os tbody').append('<tr data-id="' + cada.id + '"><td>' + cada.id + '</td><td>' + cada.ordemservico + '</td><td>' + cada.placa + '</td><td>' + cada.descricao + '</td><td data-tipo=date>' + cada.dtainclusao + '</td><td><a href="/manut/exibe-os/' + cada.id + '" target="_blank" class="btn btn-default" name="print"><i class="fa fa-print"></i></a></td><td><a href="#" target="_blank" class="btn btn-default" name="edit"><i class="fa fa-edit"></i></a></td></tr>');
            })
        });
    }

    function buscaVeiculos(cliente_id, destino_id) {
        $.ajax({
            url: "/manut/buscaVeiculos",
            data: {cliente_id: cliente_id}
        }).done(function (result) {

            $(destino_id).html('<option value="0">Selecione...</option>');

            $(result).each(function (i, cada) {
                $(destino_id).append('<option value="' + cada.id + '">' + cada.placa + '</option>');
            });

            if (destino_id === '#manut_modal_veic_select') {
                $(destino_id).val(aux_veic_id_select);
            }


        });
    }

    function buscaProdutos() {
        $.ajax({
            url: "/manut/buscaProdutos",
        }).done(function (result) {
            $("#manut_prod").autocomplete({
                source: result,
                minLength: 1,
                select: function (event, ui) {
                    $('#manut_prod_qtd').focus();
                }
            });

            $("#manut_modal_prod").autocomplete({
                source: result,
                minLength: 1,
                select: function (event, ui) {
                    $('#manut_modal_prod_qtd').focus();
                }
            });

        });
    }

    function adicionaProduto(cod_prod, origem_id) {
        $.ajax({
            url: "/manut/buscaProduto",
            data: {id: cod_prod}
        }).done(function (result) {

            if (origem_id === '#manut_prod') {
                var quant_solic = $('#manut_prod_qtd').val();
                var total = result.precovenda * quant_solic;
                var tr_existente = $('#manut_tab_produtos tbody tr[data-id=' + cod_prod + ']');

                if (tr_existente.length > 0) {
                    tr_existente.find('td[name=quantidade]').html(quant_solic);
                    tr_existente.find('td[name=total]').html(total);
                } else {
                    $('#manut_tab_produtos tbody').append('<tr data-id="' + result.id + '"><td name="id">' + result.id + '</td><td name="descricao">' + result.descricao + '</td><td name="quantidade">' + quant_solic + '</td><td name="precovenda" data-tipo="currency">' + result.precovenda + '</td><td name="total" data-tipo="currency">' + total + '</td><td><button class="btn btn-default"><i class="fa fa-minus-circle"></i></button></td></tr>');
                }
                $('#manut_prod').val('');
                
            } else {
                var quant_solic = $('#manut_modal_prod_qtd').val();
                var total = result.precovenda * quant_solic;
                var tr_existente = $('#manut_modal_tab_produtos tbody tr[data-id=' + cod_prod + ']');

                if (tr_existente.length > 0) {
                    tr_existente.find('td[name=quantidade]').html(quant_solic);
                    tr_existente.find('td[name=total]').html(total);
                } else {
                    $('#manut_modal_tab_produtos tbody').append('<tr data-id="' + result.id + '"><td name="id">' + result.id + '</td><td name="descricao">' + result.descricao + '</td><td name="quantidade">' + quant_solic + '</td><td name="precovenda" data-tipo="currency">' + result.precovenda + '</td><td name="total" data-tipo="currency">' + total + '</td><td><button class="btn btn-default"><i class="fa fa-minus-circle"></i></button></td></tr>');
                }

                $('#manut_modal_prod').val('');
            }
            atualizaSubTotal(origem_id);
            atualizaDesconto();

        });
    }

    function atualizaDesconto(origem_id) {

        if (origem_id === 'manut_mao_obra' || origem_id === 'manut_perc_desc') {

            var valor = parseFloat($('#manut_subtotal_preco').html()) + parseFloat($('#manut_mao_obra').val());
            var desc = parseFloat($('#manut_perc_desc').val());
            var total_desc = parseFloat((valor * desc) / 100);

            $('#manut_desc').val(total_desc.toFixed(2));

        } else {

            var valor = parseFloat($('#manut_modal_subtotal_preco').html()) + parseFloat($('#manut_modal_mao_obra').val());
            var desc = parseFloat($('#manut_modal_perc_desc').val());
            var total_desc = parseFloat((valor * desc) / 100);

            $('#manut_desc').val(total_desc.toFixed(2));
            $('#manut_modal_desc').val(total_desc.toFixed(2));

        }

        atualizaTotal(origem_id);
    }

    function atualizaSubTotal(origem_id) {
        var total_preco = 0;
        var total_itens = 0;
        if (origem_id === '#manut_prod' || origem_id === 'manut_tab_produtos' || origem_id === 'manut_mao_obra' || origem_id === 'manut_perc_desc') {

            $('#manut_tab_produtos tbody td[name=total]').each(function (i, cada) {
                total_preco += parseFloat($(this).html());
            });

            $('#manut_tab_produtos tbody td[name=quantidade]').each(function (i, cada) {
                total_itens += parseFloat($(this).html());
            });
            $('#manut_subtotal_preco').html(total_preco);
            $('#manut_total_itens').html(total_itens);

        } else {

            $('#manut_modal_tab_produtos tbody td[name=total]').each(function (i, cada) {
                total_preco += parseFloat($(this).html());
            });

            $('#manut_modal_tab_produtos tbody td[name=quantidade]').each(function (i, cada) {
                total_itens += parseFloat($(this).html());
            });
            $('#manut_modal_subtotal_preco').html(total_preco);
            $('#manut_modal_total_itens').html(total_itens);

        }

        atualizaTotal(origem_id)

    }

    function atualizaTotal(origem_id) {

        if (origem_id === '#manut_prod' || origem_id === 'manut_tab_produtos' || origem_id === 'manut_mao_obra' || origem_id === 'manut_perc_desc') {

            var total_os = parseFloat($('#manut_subtotal_preco').html()) + parseFloat($('#manut_mao_obra').val());
            var total_desc = parseFloat($('#manut_desc').val());
            $('#manut_total_preco').html(parseFloat(total_os - total_desc, 2));

        } else {

            var total_os = parseFloat($('#manut_modal_subtotal_preco').html()) + parseFloat($('#manut_modal_mao_obra').val());
            var total_desc = parseFloat($('#manut_modal_desc').val());
            $('#manut_modal_total_preco').html(parseFloat(total_os - total_desc, 2));

        }

    }

    function limpaCampos() {
        $('#manut_tab_os tbody').html('');
        return false;
        $('#manut_form').find('.form-control').each(function () {
            if (this.tagName == 'SELECT') {
                this.value = $(this).find('option:first').val();
            } else {
                $(this).val('');
            }

        });
    }

    function salvar(id, cliente_id, veic_id, kilometragem, descricao, precomaodeobra, percdesc, precototal, formapagto, produtos) {

        $.ajax({
            url: "/manut/salvar",
            data: {
                id: id,
                cliente_id: cliente_id,
                veiculo_id: veic_id,
                descricao: descricao,
                kilometragem: kilometragem,
                precomaodeobra: precomaodeobra,
                percdesc: percdesc,
                precototal:precototal,
                formapagto: formapagto,
                produtos: produtos,
            }
        }).done(function (result) {

            var div_alertas = (id > 0) ? '#manut_modal_alertas' : '#manut_alertas';
            if (result.hasOwnProperty('error')) {
                $(div_alertas).showMessageTarge({type: 'warning'});
                return false;
            }

            $('#manut_modal_manut').modal('hide');
            $('#manut_alertas').showMessageTarge({type: 'success'});

            buscaOrdensServico(cliente_id);
            buscaProdutos();
        });
    }

    $('#manut_cli_select').change(function () {
        var id = $(this).val();
        if (id > 0) {
            buscaVeiculos(id, '#manut_veic_select');
            buscaOrdensServico(id)
        } else {
//            limpaCampos();
            $('#manut_tab_os tbody').html('');
        }
    });

    $('#manut_modal_cli_select').change(function () {
        var id = $(this).val();
        if (id > 0) {
            buscaVeiculos(id, '#manut_modal_veic_select');
        } else {
//            limpaCampos();
        }
    });

    $('#manut_prod_add, #manut_modal_prod_add').click(function () {
        var id = this.id;

        if (id === 'manut_prod_add') {
            var prod = $('#manut_prod').val();
            if (prod.length < 1) {
                return false;
            }

            var prod_cod = prod.split('-').shift().trim();
            adicionaProduto(prod_cod, '#manut_prod');
        } else {
            var prod = $('#manut_modal_prod').val();
            if (prod.length < 1) {
                return false;
            }

            var prod_cod = prod.split('-').shift().trim();
            adicionaProduto(prod_cod, '#manut_modal_prod');
        }

    });

    $('#manut_tab_produtos, #manut_modal_tab_produtos').on('click', 'button', function () {
        var origem_id = $(this).parents('table').attr('id');
        $(this).parents('tr').remove();
        atualizaSubTotal(origem_id);
    });

    $('#manut_tab_os').on('click', 'a[name=edit]', function () {
        var os_id = $(this).parents('tr').attr('data-id');
        $('#manut_modal_tab_produtos tbody').html('');

        $.ajax({
            url: "/manut/buscaOrdemServico",
            data: {id: os_id}
        }).done(function (result) {
            aux_veic_id_select = result.veiculo_id;

            $('#manut_modal_cli_select').val(result.cliente_id).change();
            $('#manut_modal_veic_km').val(result.kilometragem);
            $('#manut_modal_id').val(result.id);
            $('#manut_modal_descricao').val(result.descricao);
            $('#manut_modal_mao_obra').val(result.precomaodeobra);
            $('#manut_modal_perc_desc').val(result.percdesc);
            $('#manut_modal_form input[name=formapagto][value=' + result.formapagto + ']').prop('checked', true);
            
            var produtos = result.produtos;
            for(var id in produtos){
                var produto = produtos[id];
                console.log(produto);
                $('#manut_modal_tab_produtos tbody').append('<tr data-id="' + id + '"><td name="id">' + id + '</td><td name="descricao">' + produto.produto + '</td><td name="quantidade">' + produto.quantidade + '</td><td name="precovenda" data-tipo="currency">' + produto.precovenda_unit + '</td><td name="total" data-tipo="currency">' + produto.precototal + '</td><td><button class="btn btn-default"><i class="fa fa-minus-circle"></i></button></td></tr>');
            }
            
            atualizaSubTotal();
            atualizaDesconto();
            
            $('#manut_modal_manut').modal();
        });

        return false;
    });

    $('#manut_perc_desc, #manut_modal_perc_desc').change(function (e) {
        atualizaDesconto(this.id);
    });

    $('#manut_mao_obra, #manut_perc_desc, #manut_modal_mao_obra, #manut_modal_perc_desc').keyup(function (e) {
        atualizaDesconto(this.id);
    });

    $('#manut_desfazer').click(function () {
        limpaCampos();
    });

    $('#manut_form').submit(function () {

        if (!$(this).form_podeenviar()) {
            return false
        }

        var cliente_id = $('#manut_cli_select').val();
        var veic_id = $('#manut_veic_select').val();
        var kilometragem = $('#manut_veic_km').val();
        var descricao = $('#manut_descricao').val();
        var precomaodeobra = $('#manut_mao_obra').val();
        var percdesc = $('#manut_perc_desc').val();
        var precototal = parseFloat($('#manut_total_preco').html());
        var formapagto = $('#manut_form input[name=formapagto]:checked').val();

        var produtos = [];
        $('#manut_tab_produtos tbody tr').each(function (i, cada) {
            var produto = {};
            produto = {
                produto_id: $(this).find('td[name=id]').html(),
                quantidade: $(this).find('td[name=quantidade]').html()
            }

            produtos.push(produto)
        });

        salvar(null, cliente_id, veic_id, kilometragem, descricao, precomaodeobra, percdesc, precototal, formapagto, produtos);

        return false;
    });

    $('#manut_modal_form').submit(function () {

        if (!$(this).form_podeenviar()) {
            return false
        }

        var id = $('#manut_modal_id').val();
        var cliente_id = $('#manut_modal_cli_select').val();
        var veic_id = $('#manut_modal_veic_select').val();
        var kilometragem = $('#manut_modal_veic_km').val();
        var descricao = $('#manut_modal_descricao').val();
        var precomaodeobra = $('#manut_modal_mao_obra').val();
        var percdesc = $('#manut_modal_perc_desc').val();
        var precototal = parseFloat($('#manut_modal_total_preco').html());
        var formapagto = $('#manut_modal_form input[name=formapagto]:checked').val();

        var produtos = [];
        $('#manut_modal_tab_produtos tbody tr').each(function (i, cada) {
            var produto = {};
            produto = {
                produto_id: $(this).find('td[name=id]').html(),
                quantidade: $(this).find('td[name=quantidade]').html()
            }

            produtos.push(produto)
        });

        salvar(id, cliente_id, veic_id, kilometragem, descricao, precomaodeobra, percdesc, precototal, formapagto, produtos);

        return false;
    });

    $('.btn-app[data-title=ManutLanc]').click(function () {
        buscaClientes();
        buscaProdutos();
        limpaCampos();
    });

});
