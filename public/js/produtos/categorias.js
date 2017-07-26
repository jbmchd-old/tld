//
$(function () {

    function buscaCategorias() {
        $.ajax({
            url: "/produtos/categorias/buscaCategorias",
        }).done(function (result) {
            $('#prod_cat_select').html('<option value="0">Nova...</option>');
            $(result).each(function (i, cada) {
                $('#prod_cat_select').append('<option data-status="'+cada.status+'" value="' + cada.id + '">' + cada.nome + '</option>');
            })
        });
    }

    function limpaCampos(){
        $('#prod_cat_select').val(0);
        $('#prod_cat_nome').val('');
        $('#prod_cat_status').prop('checked',true);
    }
  
    function salvar(id, nome, status) {
        $.ajax({
            url: "/produtos/categorias/salvar",
            data: {
                id: id,
                nome: nome,
                status: status,
            }
        }).done(function (result) {

            if (result.hasOwnProperty('error')) {
                $('#prod_cat_alertas').showMessageTarge({type: 'warning'});
                return false;
            }
            $('#prod_cat_alertas').showMessageTarge({type: 'success'});
            buscaCategorias();
            limpaCampos();
            
        });
    }
    
    $('#prod_cat_select').change(function () {
        var id = $(this).val();
        
        if (id > 0) {
            var nome = $('#prod_cat_select option:selected').html();
            var status = $('#prod_cat_select option:selected').attr('data-status');
            $('#prod_cat_nome').val(nome);
            $('#prod_cat_status').prop('checked',status==='A'?true:false);
        } else {
            limpaCampos();
        }

    });

    $('#prod_cat_desfazer').click(function () {
        limpaCampos();
    });

    $('#prod_cat_form').submit(function () {

        if( ! $(this).form_podeenviar()){ return false }; 
        
        var id = $('#prod_cat_select').val();
        var nome = $('#prod_cat_nome').val().trim();
        var status = $('#prod_cat_status').prop('checked')==true?'A':'I';

        salvar(id, nome, status);

        return false;
    });
    
    $('.open-app[data-title=ProdCategorias]').click(function () {
        buscaCategorias();
    });
});
