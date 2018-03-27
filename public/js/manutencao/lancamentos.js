
$(function () {

    var aux_veic_id_select = 0;

    function buscaClientes() {
        $.ajax({
            url: "/manut/buscaClientes",
        }).done(function (result) {
            $('#manut_cli_select').html('<option value="0">Selecione...</option>');

            $(result).each(function (i, cada) {
                $('#manut_cli_select').append('<option value="' + cada.id + '">' + cada.nome_razao + '</option>');
            })
        });
    }

    function buscaOrdensServico(cliente_id) {
        $.ajax({
            url: "/manut/buscaOrdensServico",
            data: {cliente_id: cliente_id}
        }).done(function (result) {
            $('#manut_tab_os tbody').html('');


            $(result).each(function (i, cada) {
                var btn_finan_color = '';
                if (cada.lancamento_id === null) {
                    btn_finan_color = 'color:silver';
                    cada.lancamento_id = 0;
                }

                $('#manut_tab_os tbody').append('<tr data-id="' + cada.id + '" data-veicplaca="' + cada.placa + '"><td>' + cada.id + '</td><td>' + cada.placa + '</td><td>' + cada.descricao + '</td><td data-tipo=date>' + cada.dtainclusao + '</td><td><a href="/manut/exibe-os/' + cada.id + '" target="_blank" class="btn btn-default btn-sm" name="print"><i class="fa fa-print"></i></a></td><td><a href="#" target="_blank" class="btn btn-default btn-sm" name="edit"><i class="fa fa-edit"></i></a></td><td><a href="#" target="_blank" class="btn btn-default" name="finan" data-id="' + cada.lancamento_id + '" style="' + btn_finan_color + '"><i class="fa fa-money"></i></a></td></tr>');
            })
        });
    }

    function buscaVeiculos(cliente_id) {
        $.ajax({
            url: "/manut/buscaVeiculos",
            data: {cliente_id: cliente_id}
        }).done(function (result) {
            $('#manut_veic_select').html('<option value="0">Selecione...</option>');
            $(result).each(function (i, cada) {
                $('#manut_veic_select').append('<option value="' + cada.id + '">' + cada.placa + '</option>');
            });

            $('#manut_veic_select').val(aux_veic_id_select);
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
        });
    }

    function adicionaProduto(cod_prod) {
        $.ajax({
            url: "/manut/buscaProduto",
            data: {id: cod_prod}
        }).done(function (result) {

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

            atualizaSubTotal();
            
        });
    }

    function atualizaSubTotal() {
        var total_preco = 0;
        var total_itens = 0;

        $('#manut_tab_produtos tbody td[name=total]').each(function (i, cada) {
            total_preco += parseFloat($(this).html());
        });

        $('#manut_tab_produtos tbody td[name=quantidade]').each(function (i, cada) {
            total_itens += parseFloat($(this).html());
        });

        if (isNaN(total_preco)) {
            total_preco = 0
        }
        ;
        if (isNaN(total_itens)) {
            total_itens = 0
        }
        ;

        $('#manut_subtotal_preco').html(total_preco);
        $('#manut_total_itens').html(total_itens);

        atualizaTotal()

    }

    function atualizaTotal() {
        var subtotal = parseFloat($('#manut_subtotal_preco')
                                                            .html()
//                                                            .replace('.','')
//                                                            .replace(',','.')
                                                            )
                                                            .toFixed(2);
                                                    
        var maodeobra = parseFloat($('#manut_mao_obra')
                                                        .val()
                                                        .replace('.','')
                                                        .replace(',','.'))
                                                        .toFixed(2);
                                                
        var desc = parseFloat($('#manut_desc')
                                                .val()
                                                .replace('.','')
                                                .replace(',','.'))
                                                .toFixed(2);
        
        console.log(subtotal);
        console.log(maodeobra);
        console.log(desc);
        
        if (isNaN(subtotal)) {
            subtotal = 0
        }
        if (isNaN(maodeobra)) {
            maodeobra = 0
        }
        
        var total_os = parseFloat(subtotal)+parseFloat(maodeobra) ;

        $('#manut_total_preco').val(parseFloat(total_os - desc).toFixed(2));
    }

    function limpaCampos() {
        aux_veic_id_select = 0;
        $('#manut_tipo_os').html('<i>(Nova)</i>');
        $('#manut_tab_os tbody, #manut_tab_produtos tbody').html('');
        $('#manut_form').find('.form-control').each(function () {
            if (this.tagName == 'SELECT') {
                this.value = $(this).find('option:first').val();
            } else {
                $(this).val('');
            }
        });
    }

    $('#manut_cli_select').change(function () {
        var id = $(this).val();
        if (id > 0) {
            buscaVeiculos(id);
            buscaOrdensServico(id)
        } else {
            $('#manut_tab_os tbody').html('');
        }
    });

    $('#manut_nova_os').click(function () {
        limpaCampos();
    });

    $('#manut_prod_add').click(function () {
        var prod = $('#manut_prod').val();
        if (prod.length < 1) {
            return false;
        }

        var prod_cod = prod.split('-').shift().trim();
        adicionaProduto(prod_cod, '#manut_prod');
    });

    $('#manut_tab_produtos').on('click', 'button', function () {
        $(this).parents('tr').remove();
        atualizaSubTotal();
    });

    $('#manut_tab_os').on('click', 'a[name=edit]', function () {
        limpaCampos();
        var os_id = $(this).parents('tr').attr('data-id');

        $.ajax({
            url: "/manut/buscaOrdemServico",
            data: {id: os_id}
        }).done(function (result) {
            aux_veic_id_select = result.veiculo_id;

            $('#manut_tipo_os').html(os_id + ' - <span style="color:red">Alteração</span>');
            $('#manut_cli_select').val(result.cliente_id).change();
            $('#manut_veic_select').val(result.veiculo_id);
            $('#manut_veic_km').val(result.kilometragem);
            $('#manut_id').val(result.id);
            $('#manut_descricao').val(result.descricao);
            $('#manut_mao_obra').val(result.precomaodeobra.replace('.',','));
            $('#manut_desc').val(result.desc.replace('.',''));

            var produtos = result.produtos;
            for (var id in produtos) {
                var produto = produtos[id];
                $('#manut_tab_produtos tbody').append('<tr data-id="' + id + '"><td name="id">' + id + '</td><td name="descricao">' + produto.produto + '</td><td name="quantidade">' + produto.quantidade + '</td><td name="precovenda" data-tipo="currency">' + produto.precovenda_unit + '</td><td name="total" data-tipo="currency">' + produto.precototal + '</td><td><button class="btn btn-default"><i class="fa fa-minus-circle"></i></button></td></tr>');
            }

            atualizaSubTotal();
            

        });

        return false;
    });

    $('#manut_tab_os').on('click', 'a[name=finan]', function () {
        //criar lancamento para manutencao
        var id = parseInt($(this).attr('data-id'))
        if (id > 0) {
            finan_lanc_carregalancamento(id, 'manutencao');
        } else {
            var tr = $(this).parents('tr');
            var os_id = $(this).parents('tr').attr('data-id');
            var cliente_id = $('#manut_cli_select option:selected').val();
            $.ajax({
                url: "/manut/buscaOrdemServico",
                data: {id: os_id}
            }).done(function (result) {
                var descricao = 'Manutenção ' + $('#manut_cli_select option:selected').html() + ' ' + tr.attr('data-veicplaca');
                var data = moment().add(1, 'M').format('DD/MM/YYYY');
                
                $('#finan_lanc_descricao').val(descricao);
                $('#finan_lanc_dtavencimento1').datepicker("setDate", data);
                $('#finan_lanc_valor1').val(parseFloat(result.precototalos).toFixed(2));
               
               finan_lanc_tela_origem = 'manutencao';
               finan_lanc_tela_origem_id = os_id;
               
                $('#finan_lanc_janela button[title=Fechar]').one('click', function (){
                    buscaOrdensServico(cliente_id)
                });


               $('.open-app[data-title=FinanLanc]').click();
                
                
                
            });


        }


        return false;
    });

    $('#manut_mao_obra, #manut_desc').keyup(function (e) {
        atualizaTotal();
    });

    $('#manut_form').submit(function () {

        if (!$(this).form_podeenviar()) {
            return false
        }
        var cliente_id = $('#manut_cli_select').val();
        var form_array = $(this).serializeArray();

        $('#manut_tab_produtos tbody tr').each(function (i, tr) {
            var produto_id = {};
            var produto_quantidade = {};
            var id = $(tr).find('td[name=id]').html();
            var quant = $(tr).find('td[name=quantidade]').html();

            produto_id = {
                name: 'produtos[' + id + '][produto_id]',
                value: id
            }
            produto_quantidade = {
                name: 'produtos[' + id + '][quantidade]',
                value: quant
            }

            form_array.push(produto_id)
            form_array.push(produto_quantidade)
        });

        $.ajax({
            url: "/manut/salvar",
            data: form_array
        }).done(function (result) {

            if (result.error) {
                $('#manut_alertas').showMessageTarge({type: 'warning'});
                return false;
            }

            $('#manut_alertas').showMessageTarge({type: 'success'});

            buscaOrdensServico(cliente_id);
            buscaProdutos();
        });

        return false;
    });

    $('.btn-app[data-title=ManutLanc]').click(function () {
        limpaCampos();
        buscaClientes();
        buscaProdutos();
        
        $('#manut_mao_obra, #manut_desc').val(0)
    });

});
