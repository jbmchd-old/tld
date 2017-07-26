
$(function () {

// INICIO - REFERENTE AO MODAL DE GERENCIAR MARCAS DE VEICULOS 

    function buscaTodasMarcas() {
        
        $.ajax({
            url: "/veiculos/buscaTodasMarcas",
        }).done(function (result) {
            $('#veic_modal_marca_select').html('<option data-status="A" value="0">Nova...</option>');
            $(result).each(function (i, cada) {
                $('#veic_modal_marca_select').append('<option data-status="' + cada.status + '" value="' + cada.id + '">' + cada.nome + '</option>');
            })
            
        });
    }

    $('#veic_modal_marca_select').change(function (){
        
        var id = $('#veic_modal_marca_select option:selected').val();
        var nome = $('#veic_modal_marca_select option:selected').html();
        var status  = $('#veic_modal_marca_select option:selected').attr('data-status');

        $('#modal_veic_marca_nome').val((id>0)?nome:'');
        $('#modal_veic_marca_status').prop('checked',(status=='A')?true:false)
    });

    $('#veic_modal_marca_form').submit(function (){
        
        if( ! $(this).form_podeenviar()){ return false }; 
        
        var id = $('#veic_modal_marca_select option:selected').val();
        var nome = $('#modal_veic_marca_nome').val();
        var status  = ($('#modal_veic_marca_status').is(':checked'))?'A':'I';
        
        $.ajax({
            url:'/veiculos/salvarMarca',
            data:{
                id: id,
                nome: nome,
                status: status,
            }
        }).done(function (result){

            if (result.hasOwnProperty('error')) {
                $('#veic_modal_marca_alertas').showMessageTarge({type: 'warning'});
                return false;
            }
            
            $('#veic_modal_marca').modal('hide');
            $('#veic_alertas').showMessageTarge({type: 'success'});
            buscaMarcas();
        });   
        
        return false;
    });

    $('#veic_add_marca').click(function (){
        $('#veic_modal_marca_select').val(0);
        $('#modal_veic_marca_nome').val('');
        $('#modal_veic_marca_status').prop('checked', true)
        
        buscaTodasMarcas();
        $('#veic_modal_marca').modal();
    });
    
// FIM - REFERENTE AO MODAL DE GERENCIAR MARCAS DE VEICULOS     

// INICIO - REFERENTE TELA PRINCIPAL
    function buscaPessoas() {
        
        $.ajax({
            url: "/veiculos/buscaPessoas",
        }).done(function (result) {
            
            $('#veic_pes_select').html('<option value="0">Selecione...</option>');

            $(result).each(function (i, cada) {
                $('#veic_pes_select').append('<option value="' + cada.id + '">' + cada.nome_razao + '</option>');
            });
        });

    }

    function buscaMarcas() {
        $.ajax({
            url: "/veiculos/buscaMarcas",
        }).done(function (result) {
            $('#veic_marca_select, #modal_veic_marca_select').html('<option value="0">Selecione...</option>');

            $(result).each(function (i, cada) {
                $('#veic_marca_select, #modal_veic_marca_select').append('<option value="' + cada.id + '">' + cada.nome + '</option>');
            })
        });
    }
    
    function buscaVeiculos(pessoas_id) {
        $.ajax({
            url: "/veiculos/buscaVeiculos",
            data: {pessoas_id: pessoas_id}
        }).done(function (result) {
            var table = $('#veic_tabela tbody');
            table.html('');
            $(result).each(function (i, cada) {
                table
                    .append('<tr data-id="'+cada.id+'" data-marca_id="'+cada.marca_id+'"><td>'+cada.modelo+'</td><td>'+cada.marca+'</td><td>'+cada.placa+'</td><td>'+cada.ano+'</td><td>'+cada.cor+'</td><td>'+cada.status+'</td><td>'+cada.obs+'</td><td style="text-align:center"><button type="button"><i class="fa fa-edit"></i></button></td></tr>');

            })
        });
    }
    
    function limpaCampos() {
        $('#veic_form').find('.form-control').each(function () {
            if (this.tagName == 'SELECT') {
                if(this.id != 'veic_pes_select'){ this.value = $(this).find('option:first').val(); }
            } else {
                $(this).val('');
            }
            $('#veic_status').prop('checked', true);
            $('#veic_tabela tbody').html('');
        });
    }

    function salvar(id, pessoas_id, marca_id, modelo, placa, ano, cor, obs, status) {
        $.ajax({
            url: "/veiculos/salvar",
            data: {
                id: id,
                pessoas_id: pessoas_id,
                marca_id: marca_id,
                modelo: modelo,
                placa: placa,
                ano: ano,
                cor: cor,
                obs: obs,
                status: status,
            }
        }).done(function (result) {
            var div_alertas = (id > 0) ? '#veic_modal_alertas' : '#veic_alertas';
            if (result.hasOwnProperty('error')) {
                $(div_alertas).showMessageTarge({type: 'warning'});
                return false;
            }

            $('#veic_modal_veic').modal('hide');
            $('#veic_alertas').showMessageTarge({type: 'success'});

            buscaVeiculos(pessoas_id);
            limpaCampos();
        });
    }

    $('#veic_pes_select').change(function () {
        var id = $(this).val();
        if (id > 0) {
            buscaVeiculos(id);
        } else {
            limpaCampos();
        }

    });
    
    $('#veic_desfazer').click(function (){
        limpaCampos();
    });
    
    $('#veic_form').submit(function () {

        if( ! $(this).form_podeenviar()){ return false }; 
        
        var pessoas_id = $('#veic_pes_select').val();
        var marca_id=$('#veic_marca_select').val();
        var marca_id = marca_id;
        var modelo = $('#veic_modelo').val();
        var placa = $('#veic_placa').val();
        var ano = $('#veic_ano').val();
        var cor = $('#veic_cor').val();
        var obs = $('#veic_obs').val();
        var status = ($('#veic_status').prop('checked')==true)?'A':'I';
        
        salvar(null,pessoas_id,marca_id,modelo,placa,ano,cor,obs,status);

        return false;
    });
    
    $('#veic_tabela').on('click', 'button', function () {
        
        var tds = $(this).parents('tr').children();

        var id = $(this).parents('tr').attr('data-id');
        var marca_id = $(this).parents('tr').attr('data-marca_id');
        
        var modelo = tds.filter(':nth-child(1)').html();
        var placa = tds.filter(':nth-child(3)').html();
        var ano = tds.filter(':nth-child(4)').html();
        var cor = tds.filter(':nth-child(5)').html();
        var status = tds.filter(':nth-child(6)').html();
        var obs = tds.filter(':nth-child(7)').html();

        $('#modal_veic_id').val(id);
        $('#modal_veic_marca_select').val(marca_id);
        $('#modal_veic_modelo').val(modelo);
        $('#modal_veic_placa').val(placa);
        $('#modal_veic_ano').val(ano);
        $('#modal_veic_cor').val(cor);
        $('#modal_veic_obs').val(obs);
        $('#modal_veic_status').prop('checked',(status=='A')?true:false);

        $('#veic_modal_veic').modal();
    });
// FIM - REFERENTE TELA PRINCIPAL    

// INICIO - REFERENTE AO MODAL DE ALTERAR VEICULOS
    $('#veic_modal_form').submit(function () {
        
        if( ! $(this).form_podeenviar()){ return false }; 
        
        var id=$('#modal_veic_id').val();
        var pessoas_id = $('#veic_pes_select').val();
        
        var marca_id=$('#modal_veic_marca_select').val();
        var modelo = $('#modal_veic_modelo').val();
        var placa = $('#modal_veic_placa').val();
        var ano = $('#modal_veic_ano').val();
        var cor = $('#modal_veic_cor').val();
        var obs = $('#modal_veic_obs').val();
        var status = ($('#modal_veic_status').prop('checked')==true)?'A':'I';
        
        salvar(id,pessoas_id,marca_id,modelo,placa,ano,cor,obs,status);

        return false;

    });

    $('.btn-app[data-title=Veiculos]').click(function () {
        buscaPessoas();
        buscaMarcas();
        limpaCampos();
    });
// FIM - REFERENTE AO MODAL DE ALTERAR VEICULOS
});
