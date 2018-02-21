
$(function () {

    function buscaPessoas() {
        $.ajax({
            url: "/pessoas/buscaPessoas",
        }).done(function (result) {

            $('#pes_select').html('<option value="0">Novo...</option>');

            $(result).each(function (i, cada) {
                $('#pes_select').append('<option value="' + cada.id + '">' + cada.nome_razao + ' (' + cada.nrodocumento + ')</option>');
            })
        });

        limpaCampos();
    }

    function buscaPessoa(pessoa_id) {
        $.ajax({
            url: "/pessoas/buscaPessoa",
            data: {id: pessoa_id}
        }).done(function (result) {
            result = result[0];
            for (var nome in result) {
                var valor = result[nome];
                var campo = $('#pessoas_form').find('[name=' + nome + ']').not(':radio');
                $(campo).val(valor);
            }

            $('#pes_status').prop('checked', (result.status == 'A') ? true : false);

            $('input:radio[name=tipo][value=' + result.tipo + ']').prop('checked', true);

            $('input[name="pessoas_tipo"]').change();

        });
    }

    function limpaCampos() {

        $('#pes_tipo_cli').prop('checked', true);

        $('#pessoas_form').find('.form-control').each(function () {
            if (this.tagName == 'SELECT') {
                this.value = $(this).find('option:first').val();
            } else {
                $(this).val('');
            }

        })
        $('input[name="pessoas_tipo"]').change();

    }

    $("#pes_dta_nasc").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-117:+0"
    });

    $('#pes-doc_tipo').change(function () {
        $('input[name=nrodocumento]').val('');

        var tipo_slc = $(this).find('option:selected').html().toLowerCase();
        $('input[id^="pes_doc_num_"]').addClass('hide').removeAttr('name').removeAttr('data-obrigatorio');
        $('input[id=pes_doc_num_' + tipo_slc + ']').removeClass('hide').attr('name', 'nrodocumento').attr('data-obrigatorio', '');

        if (tipo_slc == 'cpf') {
            $('#pes_dta_nasc').parent().show();
        } else {
            $('#pes_dta_nasc').parent().hide();
        }

    });

    $('#pes_select').change(function () {
        var id = $(this).val();
        if (id > 0) {
            buscaPessoa(id);
        } else {
            limpaCampos();
            $('#pes_atualizar_func').addClass('hide');
        }

    });

    $('#pes_desfazer').click(function () {
        $('#pes_select').val(0).change();
    });

    $('#pessoas_form').submit(function () {

        if( ! $(this).form_podeenviar()){ return false; }

        $.ajax({
            url: "/pessoas/salvar",
            data: {
                id: $('*[name=id]').val(),
                empresa_id: 1,
                nome_razao: $('*[name=nome_razao]').val(),
                apelido: $('*[name=apelido]').val(),
                tipodocumento: $('*[name=tipodocumento]').val(),
                nrodocumento: $('*[name=nrodocumento]').val(),
                dtanascimento: $('*[name=dtanascimento]').val(),
                obs: $('*[name=obs]').val(),
                email: $('*[name=email]').val(),
                endereco: $('*[name=endereco]').val(),
                fone1: $('*[name=fone1]').val(),
                fone2: $('*[name=fone2]').val(),
                tipo: $('*[name=tipo]:checked').val(),
                status: $('*[name=status]').val(),
            }
        }).done(function (result) {
            if (result.hasOwnProperty('error')) {
                $('#pessoas_alertas').showMessageTarge({message: 'Ocorreu algum problema, verifique', type: 'warning'});
                return false;
            }

            $('#pessoas_alertas').showMessageTarge({message: 'Tudo certo!', type: 'success'});
            buscaPessoas();
        });

        return false;
    });

    $('.btn-app[data-title=Pessoas]').click(function () {
        buscaPessoas();
    });

});
