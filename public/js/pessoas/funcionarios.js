
$(function () {

    function buscaFuncionarios() {
        $.ajax({
            url: "/funcionarios/buscaFuncionarios",
        }).done(function (result) {
            $('#func_select').html('<option value="0">Selecione...</option>');

            $(result).each(function (i, cada) {
                $('#func_select').append('<option value="' + cada.id + '">' + cada.nome_razao + '</option>');
            })
        });

        limpaCampos();
    }

    function buscaFuncionario(pessoa_id) {
        $.ajax({
            url: "/funcionarios/buscaFuncionario",
            data: {pessoas_id: pessoa_id}
        }).done(function (result) {
            var table = $('#func_ult_lanc tbody');
            table.html('');
            $(result).each(function (i, cada) {
                table
                    .append('<tr data-id="'+cada.id+'"><td>' + cada.cargo + '</td><td data-tipo="currency">' + cada.salario + '</td><td>' + cada.obs + '</td><td style="text-align: center"><button type="button" ><i class="fa fa-edit"></i></button></td></tr>');

            });
//            $('.table').formatacao().tabela();
        });
    }

    function limpaCampos() {
        $('#func_form').find('.form-control').each(function () {
            if (this.tagName == 'SELECT') {
                this.value = $(this).find('option:first').val();
            } else {
                $(this).val('');
            }
            
            $('#func_ult_lanc tbody').html('');

        })
    }
    
    function salvar(id, pessoas_id, cargo, salario, obs){
        
        $.ajax({
            url: "/funcionarios/salvar",
            data: {
                id: id,
                pessoas_id: pessoas_id,
                cargo: cargo,
                salario: salario,
                obs: obs,
            }
        }).done(function (result) {
            
            var div_alertas = (id>0)?'#func_modal_alertas':'#func_alertas';
            if (result.hasOwnProperty('error')) {
                $(div_alertas).showMessageTarge({type: 'warning'});
                return false;
            }
            
            $('#func_alter_func').modal('hide');
            $('#func_alertas').showMessageTarge({type: 'success'});
            
            buscaFuncionarios();
        });
        
    }
    
    $('#func_select').change(function () {
        var id = $(this).val();
        $('#func_ult_lanc tbody').html('');
        if (id > 0) {
            buscaFuncionario(id);
        } else {
            limpaCampos();
        }

    });

    $('#func_ult_lanc').on('click', 'button', function () {
        
        var tds = $(this).parents('tr').children();

        var id = $(this).parents('tr').attr('data-id');
        var cargo = tds.filter(':nth-child(1)').html();
        var salario = tds.filter(':nth-child(2)').html();
        var obs = tds.filter(':nth-child(3)').html();

        $('#modal_func_id').val(id);
        $('#modal_func_cargo').val(cargo);
        $('#modal_func_salario').val(salario);
        $('#modal_func_obs').val(obs);

//        $form().atrelaEventosPorAtributos( $('#func_modal_form').find( campos_texto.join() ) );

        $('#func_alter_func').modal();
    });

    $('#func_desfazer').click(function () {
        $('#func_select').val(0).change();
    });

    $('#func_form').submit(function () {

        if( ! $(this).form_podeenviar()){ return false }; 
        
        var id = null;
        var pessoas_id = $('#func_select').val();
        var cargo = $('#func_cargo').val();
        var salario = $('#func_salario').val();
        var obs = $('#func_obs').val();
        
        salvar(id, pessoas_id, cargo, salario, obs);
        
        return false;
    });

    $('#func_modal_form').submit(function () {
        
        if( ! $(this).form_podeenviar()){ return false }; 
        
        var id = $('#modal_func_id').val();
        var pessoas_id = $('#func_select').val();
        var cargo = $('#modal_func_cargo').val();
        var salario = $('#modal_func_salario').val();
        var obs = $('#modal_func_obs').val();
        
        salvar(id, pessoas_id, cargo, salario, obs);
        
        return false;
    });

    $('.btn-app[data-title=Funcionarios]').click(function () {
        buscaFuncionarios();
    });

});
