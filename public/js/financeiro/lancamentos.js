
$(function () {

    //======== IMPORTACAO ==================================

    $('#finan_lanc_importofx_form').ajaxForm(function (result) {
        if (!result.error) {
            $().alert({titulo: 'Tudo certo!', texto: 'Arquivo importado com sucesso!<br /> ' + result.registros + ' inserido(s)'});
        } else {
            $().alert({titulo: 'Problema!', texto: 'Ocorreu algum problema com a seguinte mensagem:<br /> ' + result.message + ''});
        }
    });

    //======== LANCAMENTO ==================================

    $("#finan_lanc_dtavencimento, #finan_lanc_dtapagamento, #finan_lanc_parcelar_dtavencimento1, #finan_lanc_parcelar_dtapagamento1").datepicker({
        changeMonth: true,
        changeYear: true,
        setDate: 0,
    });

    function buscaCaixas() {
        $.ajax({
            url: '/finan/caixas/buscaCaixas',
        }).done(function (result) {

            $(result).each(function (i, cada) {
                $('#finan_lanc_caixas, #finan_lanc_importofx_caixas, #finan_lanc_parcelar_caixas').append('<option value="' + cada.id + '">' + cada.nome + '</option>');
            });

        });
    }

    function buscaCategorias() {
        $.ajax({
            url: '/finan/categorias/buscaCategorias',
        }).done(function (result) {

            $(result).each(function (i, cada) {
                $('#finan_lanc_cat, #finan_lanc_importofx_categorias, #finan_lanc_parcelar_cat').append('<option value="' + cada.id + '">' + cada.nome + '</option>');
            });

        });
    }

    function buscaUltimosLancamentos() {
        $.ajax({
            url: '/finan/lancamentos/buscaUltimosLancamentos',
        }).done(function (result) {
            $('#finan_lanc_tab_ultlanc tbody').html('');
            $(result).each(function (i, cada) {
                $('#finan_lanc_tab_ultlanc tbody').append('\
                    <tr data-id="' + cada.id + '">\
                        <td>' + cada.id + '</td>\
                        <td>' + cada.descricao + '</td>\
                        <td><button class="btn btn-default"><i class="fa fa-edit"></i></button></td>\
                    </tr>'
                        );
            });

            $('#finan_lanc_tab_ultlanc').table_defaults();

        });
    }

    function limpaCamposJanela() {
        $('#finan_lanc_cat, #finan_lanc_caixas').val(1);
        $('#finan_lanc_id, #finan_lanc_descricao, #finan_lanc_valor, #finan_lanc_dtavencimento, #finan_lanc_dtapagamento').val('');
        $('#finan_lanc_situacao').prop('checked', false);
        $('#finan_lanc_pagamento').addClass('hide');
    }

    function limpaCamposModal() {
        $('#finan_lanc_parcelar_cat, #finan_lanc_parcelar_caixas').val(1);
        $('#finan_lanc_parcelar_id1, #finan_lanc_parcelar_descricao, #finan_lanc_parcelar_valor1').val('');
        $('#finan_lanc_parcelar_situacao1').prop('checked', false);
        $('#finan_lanc_parcelar_pagamento1').addClass('hide');

        $('div[id^=finan_lanc_parcelar_parcela]:not(:first)').remove();
    }

    function ativaDesativaDtapagamento(origem) {
        var destino = origem.replace('situacao', 'dtapagamento');

        if ($('#' + origem).prop('checked')) {
            $('#' + destino).parents('.' + destino).removeClass('hide');
        } else {
            $('#' + destino).parents('.' + destino).addClass('hide');
            $('#' + destino).val(null);
        }
    }

    $('#finan_lanc_situacao, #finan_lanc_parcelar_situacao1').change(function () {
        ativaDesativaDtapagamento($(this).attr('id'));
    });

    $('#finan_lanc_tab_ultlanc').on('click', 'button', function () {
        var id = $(this).parents('tr').attr('data-id');

        $.ajax({
            url: '/finan/lancamentos/buscaLancamento',
            data: {id: id}
        }).done(function (result) {

            var num_parcelas = Object.keys(result.parcelas);
            if (num_parcelas.length > 1) {
                $('#finan_lanc_id').val(result.id);
                $('#finan_lanc_parcelar_cat').val(result.categoria_id);
                $('#finan_lanc_parcelar_caixas').val(result.caixa_id);
                $('#finan_lanc_parcelar_descricao').val(result.descricao);

                if (result.tipo == 'D') {
                    $('#finan_lanc_parcelar_tipo :radio[value="D"]').prop('checked', true);
                } else {
                    $('#finan_lanc_parcelar_tipo :radio[value="R"]').prop('checked', true);
                }
                $('#finan_lanc_parcelar_tipopagamento :radio[value="' + result.parcelas[1].tipopagamento + '"]').prop('checked', true);

                for (var num_parc in result.parcelas) {
                    var parcela = result.parcelas[num_parc];

                    if (num_parc > 1) {
                        $('#finan_lanc_parcelar_addparcela').click();
                    }

                    $('#finan_lanc_parcelar_dtavencimento' + num_parc).val(parcela.dtavencimento.split('-').reverse().join('/'));
                    $('#finan_lanc_parcelar_valor' + num_parc).val(parcela.valor);
                    $('#finan_lanc_parcelar_situacao' + num_parc).prop('checked', (parcela.situacao == 'P' ? true : false));
                    $('#finan_lanc_parcelar_situacao' + num_parc).change();
                    if ($('#finan_lanc_parcelar_situacao' + num_parc).prop('checked')) {
                        $('#finan_lanc_parcelar_dtapagamento' + num_parc).val(parcela.dtapagamento == null ? null : parcela.dtapagamento.split('-').reverse().join('/'));
                    }
                    $('#finan_lanc_parcelar_id' + num_parc).val(parcela.id);

                }

                $('#finan_lanc_parcelar_id').val(id);
                $('#finan_lanc_parcelar').modal();
            } else {
                $('#finan_lanc_id').val(result.id);
                $('#finan_lanc_caixas').val(result.caixa_id);
                $('#finan_lanc_cat').val(result.categoria_id);
                $('#finan_lanc_descricao').val(result.descricao);

                if (result.tipo == 'D') {
                    $('#finan_lanc_tipo :radio[value="D"]').prop('checked', true);
                } else {
                    $('#finan_lanc_tipo :radio[value="R"]').prop('checked', true);
                }

                $('#finan_lanc_dtavencimento').val(result.parcelas[1].dtavencimento.split('-').reverse().join('/'));
                $('#finan_lanc_valor').val(result.parcelas[1].valor);
                $('#finan_lanc_situacao').prop('checked', (result.parcelas[1].situacao == 'P' ? true : false));

                if ($('#finan_lanc_situacao').prop('checked')) {
                    $('#finan_lanc_dtapagamento').val(result.parcelas[1].dtapagamento == null ? null : result.parcelas[1].dtapagamento.split('-').reverse().join('/'));
                }

                $('#finan_lanc_tipopagamento :radio[value="' + result.parcelas[1].tipopagamento + '"]').prop('checked', true);
                $('#finan_lanc_parcela_id').val(result.parcelas[1].id);

                $('#finan_lanc_situacao').change();
                $('#finan_lanc_id').val(id);

                $('#finan_lanc_modal').modal();

            }

        });

        return false;
    });

    $('.open-app[data-title=FinanLanc]').click(function () {
        buscaCaixas();
        buscaCategorias();
        buscaUltimosLancamentos();
    });

    $('#finan_lanc_ultlanc_btn').click(function () {
        var el = $('#finan_lanc_tab_ultlanc tbody');
        el.toggleClass('hide');
        if (el.hasClass('hide')) {
            $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });

    $('button[title=Fechar]').click(function () {
        limpaCamposJanela();
    });

    //======== PARCELAMENTO ==================================

    $('#finan_lanc_parcelar_btn').click(function () {

        $('#finan_lanc_parcelar_caixas').val($('#finan_lanc_caixas').val());
        $('#finan_lanc_parcelar_cat').val($('#finan_lanc_cat').val());
        $('#finan_lanc_parcelar_descricao').val($('#finan_lanc_descricao').val());
        $('#finan_lanc_parcelar_dtavencimento').val($('#finan_lanc_dtavencimento').val());
        $('#finan_lanc_parcelar_valor').val($('#finan_lanc_valor').val());

        var tipo_lanc_checked = $('#finan_lanc_tipo > input:radio[name=tipo]:checked').val();
        $('#finan_lanc_parcelar_tipo > input:radio[name=tipo][value=' + tipo_lanc_checked + ']').prop('checked', true);

        $('#finan_lanc_parcelar').modal();
    });

    function ativaDatepicker(seletor) {
        $(seletor).datepicker({
            changeMonth: true,
            changeYear: true,
            setDate: 0,
        });
    }

    $('#finan_lanc_parcelar_addparcela').click(function () {
        var num_parc = $('div[id^=finan_lanc_parcelar_parcela').length + 1;
        var last_date = $('input[id^=finan_lanc_parcelar_dtavencimento1').last().datepicker("getDate");
        var last_valor = $('input[id^=finan_lanc_parcelar_valor1').last().val();

        var html_parc = '<div class="col-lg-12" id="finan_lanc_parcelar_parcela' + num_parc + '">\
                            <div class="form-group col-lg-3">\
                                <input class="form-control" name="parcelas[' + num_parc + '][dtavencimento]" id="finan_lanc_parcelar_dtavencimento' + num_parc + '" readonly />\
                            </div>\
                            <div class="form-group col-lg-3">\
                                <input class="form-control" name="parcelas[' + num_parc + '][valor]" id="finan_lanc_parcelar_valor' + num_parc + '" data-mask="money" value="' + last_valor + '" required />\
                            </div>\
                            <div class="form-group col-lg-2">\
                                <input type="checkbox" name="parcelas[' + num_parc + '][situacao]" value="P" id="finan_lanc_parcelar_situacao' + num_parc + '" /> Pago\
                            </div>\
                            <div id="finan_lanc_parcelar_pagamento" class="col-lg-3 finan_lanc_parcelar_dtapagamento' + num_parc + ' hide" style="margin-left: -30px" >\
                                <input class="form-control" name="parcelas[' + num_parc + '][dtapagamento]" id="finan_lanc_parcelar_dtapagamento' + num_parc + '" style="margin-left=-30px" readonly />\
                            </div>\
                            <input type="hidden" name="parcelas[' + num_parc + '][id]" id="finan_lanc_parcelar_id' + num_parc + '" />\
                        </div>';


        $('#finan_lanc_parcelar_todasparcelas').append(html_parc);
        $('#finan_lanc_parcelar_form').form_defaults();

        ativaDatepicker('#finan_lanc_parcelar_dtavencimento' + num_parc);
        ativaDatepicker('#finan_lanc_parcelar_dtapagamento' + num_parc);

        var setdate = moment(last_date).add(1, 'M').format('DD/MM/YYYY');
        $('#finan_lanc_parcelar_dtavencimento' + num_parc).datepicker("setDate", setdate);

        $('#finan_lanc_parcelar_situacao' + num_parc).change(function () {
            ativaDesativaDtapagamento($(this).attr('id'));
        });

    });

    $('#finan_lanc_parcelar_remparcela').click(function () {
        var ultima_parcela_id = $('div[id^=finan_lanc_parcelar_parcela').last().attr('id');

        if (ultima_parcela_id != 'finan_lanc_parcelar_parcela1') {
            $('div[id^=finan_lanc_parcelar_parcela').last().remove();
        }
    });

    $('#finan_lanc_form, #finan_lanc_parcelar_form').submit(function () {

        if (!$(this).form_podeenviar()) {
            return false
        }
        ;

        var array = $(this).serializeArray();
        $(array).each(function (i, cada) {
            if (cada.name.indexOf('dtavencimento') > -1) {
                cada.value = cada.value.split('/').reverse().join('-');
            } else if (cada.name.indexOf('dtapagamento') > -1) {
                cada.value = cada.value.length > 0 ? cada.value.split('/').reverse().join('-') : null;
            }
        })

        var form_id = $(this).attr('id');
        $.ajax({
            url: '/finan/lancamentos/salvar',
            data: array
        }).done(function (result) {
            if (result.error) {
                var alertas_id = (form_id == 'finan_lanc_form') ? 'finan_lanc_alertas' : 'finan_lanc_parcelar_alertas';
                $('#' + alertas_id).showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique.'})
                return false;
            }

            $('#finan_lanc_parcelar').modal('hide');
            $('#finan_lanc_alertas').showMessageTarge({type: 'success', message: 'Operação realizada com sucesso.'})
            buscaUltimosLancamentos();
            limpaCamposJanela();
            limpaCamposModal();
        });

        return false;
    });

    $('#finan_lanc_parcelar').on('hidden.bs.modal', function (e) {
        limpaCamposModal();
    })
});
