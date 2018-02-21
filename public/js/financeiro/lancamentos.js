//======== COMPARTILHADA ==================================
var finan_lanc_tela_origem = '';
var finan_lanc_tela_origem_id = 0;
var finan_lanc_tela_destino_result = {};

function finan_lanc_carregalancamento(id, origem) {
    if(['detalhamentos','manutencao'].indexOf(origem)>-1){
        $('.open-app[data-title=FinanLanc]').click();
    }
    
    $.ajax({
        url: '/finan/lancamentos/buscaLancamento',
        data: {id: id}
    }).done(function (result) {

        $('#finan_lanc_id').val(result.id);
        $('#finan_lanc_cat').val(result.categoria_id);
        $('#finan_lanc_caixas').val(result.caixa_id);
        $('#finan_lanc_descricao').val(result.descricao);
        if (result.tipo == 'D') {
            $('#finan_lanc_tipo :radio[value="D"]').prop('checked', true);
        } else {
            $('#finan_lanc_tipo :radio[value="R"]').prop('checked', true);
        }
        $('#finan_lanc_formapagto :radio[value="' + result.parcelas[1].formapagto + '"]').prop('checked', true);
        for (var num_parc in result.parcelas) {
            var parcela = result.parcelas[num_parc];
            if (num_parc > 1) {
                $('#finan_lanc_addparcela').click();
            }

            $('#finan_lanc_dtavencimento' + num_parc).val(parcela.dtavencimento.split('-').reverse().join('/'));
            $('#finan_lanc_valor' + num_parc).val(parcela.valor);
            $('#finan_lanc_situacao' + num_parc).prop('checked', (parcela.situacao == 'P' ? true : false));
            $('#finan_lanc_situacao' + num_parc).change();
            if ($('#finan_lanc_situacao' + num_parc).prop('checked')) {
                $('#finan_lanc_dtapagamento' + num_parc).val(parcela.dtapagamento == null ? null : parcela.dtapagamento.split('-').reverse().join('/'));
            }
            $('#finan_lanc_id' + num_parc).val(parcela.id);
        }

        $('#finan_lanc_id').val(id);
    });
}

$(function () {

    //======== ULTIMOS LANCAMENTOS ==================================

    $('#finan_lanc_ultlanc_btn').click(function () {
        buscaUltimosLancamentos();
        $('#finan_lanc_ultlanc').modal();
    });

    $('#finan_lanc_tab_ultlanc').on('click', 'button', function () {
        var id = $(this).parents('tr').attr('data-id');
        finan_lanc_carregalancamento(id);
        $('#finan_lanc_ultlanc').modal('hide');
        return false;
    });

    //======== LANCAMENTO ==================================

    function buscaCaixas() {
        $.ajax({
            url: '/finan/caixas/buscaCaixas',
        }).done(function (result) {
            $('#finan_lanc_caixas').html('');
            $(result).each(function (i, cada) {
                $('#finan_lanc_caixas').append('<option value="' + cada.id + '">' + cada.nome + '</option>');
            });

        });
    }

    function buscaCategorias() {
        $.ajax({
            url: '/finan/categorias/buscaCategorias',
        }).done(function (result) {
            $('#finan_lanc_cat').html('');
            $(result).each(function (i, cada) {
                $('#finan_lanc_cat').append('<option value="' + cada.id + '">' + cada.nome + '</option>');
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
        $('#finan_lanc_id, #finan_lanc_descricao, #finan_lanc_valor1, #finan_lanc_dtavencimento1, #finan_lanc_dtapagamento1').val('');
        $('#finan_lanc_situacao1').prop('checked', false);
        $('#finan_lanc_pagamento1').addClass('hide');

        $('div[id^=finan_lanc_parcela]:not(:first)').remove();
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

    function ativaDatepicker(seletor) {
        $(seletor).datepicker({
            changeMonth: true,
            changeYear: true,
            setDate: 0,
        });
    }

    $("#finan_lanc_dtavencimento1, #finan_lanc_dtapagamento1").datepicker({
        changeMonth: true,
        changeYear: true,
        setDate: 0,
    });

    $('#finan_lanc_situacao1').change(function () {
        ativaDesativaDtapagamento($(this).attr('id'));
    });

    $('button[title=Fechar]').click(function () {
        limpaCamposJanela();
    });

    $('#finan_lanc_addparcela').click(function () {
        var num_parc = $('div[id^=finan_lanc_parcela').length + 1;
        var last_date = $('input[id^=finan_lanc_dtavencimento1').last().datepicker("getDate");
        var last_valor = $('input[id^=finan_lanc_valor1').last().val();

        var html_parc = '<div class="col-lg-12" id="finan_lanc_parcela' + num_parc + '">\
                            <div class="form-group col-lg-3">\
                                <input class="form-control" name="parcelas[' + num_parc + '][dtavencimento]" id="finan_lanc_dtavencimento' + num_parc + '" readonly />\
                            </div>\
                            <div class="form-group col-lg-3">\
                                <input class="form-control" name="parcelas[' + num_parc + '][valor]" id="finan_lanc_valor' + num_parc + '" data-mask="money" value="' + last_valor + '" required />\
                            </div>\
                            <div class="form-group col-lg-2">\
                                <input type="checkbox" name="parcelas[' + num_parc + '][situacao]" value="P" id="finan_lanc_situacao' + num_parc + '" /> Pago\
                            </div>\
                            <div id="finan_lanc_pagamento" class="col-lg-3 finan_lanc_dtapagamento' + num_parc + ' hide" style="margin-left: -30px" >\
                                <input class="form-control" name="parcelas[' + num_parc + '][dtapagamento]" id="finan_lanc_dtapagamento' + num_parc + '" style="margin-left=-30px" readonly />\
                            </div>\
                            <input type="hidden" name="parcelas[' + num_parc + '][id]" id="finan_lanc_id' + num_parc + '" />\
                        </div>';


        $('#finan_lanc_todasparcelas').append(html_parc);
        $('#finan_lanc_form').form_defaults();

        ativaDatepicker('#finan_lanc_dtavencimento' + num_parc);
        ativaDatepicker('#finan_lanc_dtapagamento' + num_parc);

        var setdate = moment(last_date).add(1, 'M').format('DD/MM/YYYY');
        $('#finan_lanc_dtavencimento' + num_parc).datepicker("setDate", setdate);

        $('#finan_lanc_situacao' + num_parc).change(function () {
            ativaDesativaDtapagamento($(this).attr('id'));
        });

    });

    $('#finan_lanc_remparcela').click(function () {
        var ultima_parcela_id = $('div[id^=finan_lanc_parcela').last().attr('id');

        if (ultima_parcela_id != 'finan_lanc_parcela1') {
            $('div[id^=finan_lanc_parcela').last().remove();
        }
    });

    $('#finan_lanc_form').submit(function () {

        if (!$(this).form_podeenviar()) {
            return false;
        }

        var array = $(this).serializeArray();
        $(array).each(function (i, cada) {
            if (cada.name.indexOf('dtavencimento') > -1) {
                cada.value = cada.value.split('/').reverse().join('-');
            } else if (cada.name.indexOf('dtapagamento') > -1) {
                cada.value = cada.value.length > 0 ? cada.value.split('/').reverse().join('-') : null;
            }
        })
        
        array.push({name:'tela_origem[nome]',value:finan_lanc_tela_origem},{name:'tela_origem[id]', value:finan_lanc_tela_origem_id});

        $.ajax({
            url: '/finan/lancamentos/salvar',
            data: array
        }).done(function (result) {
            if (result.error) {
                $('#finan_lanc_alertas').showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique.'})
                return false;
            }

            $('#finan_lanc_alertas').showMessageTarge({type: 'success', message: 'Operação realizada com sucesso.'})
            buscaUltimosLancamentos();
            limpaCamposJanela();
            
            if(result.hasOwnProperty('manutencao') && result['manutencao'].hasOwnProperty('id')){
                finan_lanc_tela_destino_result=result['manutencao'];
            }
        });
        return false;
    });
    
    $('.open-app[data-title=FinanLanc]').click(function () {
        buscaCaixas();
        buscaCategorias();
    });
    
});
