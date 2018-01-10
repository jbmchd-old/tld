$(function () {
    
    function buscaCategoriasPai(){
        $.ajax({
            url: '/finan/categorias/buscaCategoriasPai',
        }).done(function (result) {
            
            $(result).each(function (i, cada){
                $('#finan_catpai').append('<option data-status="'+cada.status+'" value="'+cada.id+'">'+cada.nome+'</option>');
            });
            
        });
    }
    
    function buscaTodasCategoriasFilhos(){
        $.ajax({
            url: '/finan/categorias/buscaTodasCategoriasFilhos',
        }).done(function (result) {
            $('#finan_catfilho_id').html('<option value="0">Nova...</option>');
            
            $(result).each(function (i, cada){
                $('#finan_catfilho_id').append('<option data-status="'+cada.status+'" data-pai="'+cada.categorias_id+'" value="'+cada.id+'">'+cada.nome+'</option>');
            });
            
        });
    }
    
    $('#finan_catfilho_id').on('change',function(){
        var nome = $(this).find('option:selected').html();
        var pai = $(this).find('option:selected').attr('data-pai');
        var status = $(this).find('option:selected').attr('data-status');
        
        if($(this).val() > 0){
            $('#finan_catfilho_nome').val(nome)
            $('#finan_catpai').val(pai)
            $('#finan_catfilho_status').prop('checked',(status=='A')?true:false);
        } else {
            $('#finan_catfilho_nome').val('')
            $('#finan_catfilho_status').prop('checked',true);
        }
        
    })
    
    $('#finan_catfilho_form').submit(function () {

        if( ! $(this).form_podeenviar()){ return false }; 
        
        var nome = $(this).find('[name=nome]').val();

        if (nome.length < 1) {
            $('#finan_catfilho_alertas').showMessageTarge({type: 'warning', message: 'O nome é obrigatório'})
            return false;
        }

        var id = $(this).find('[name=id]').val();
        var categorias_id = $(this).find('[name=categorias_id]').val();
        var status = $(this).find('[name=status]').prop('checked') ? 'A' : 'I' ;
        
        $.ajax({
            url: '/finan/categorias/salvarCategoria',
            data: {
                id: (id>0)?id:null,
                nome: nome,
                categorias_id: categorias_id,
                status: status
            }
        }).done(function (result) {
            
            if( ! result.ok){
                $('#finan_catfilho_alertas').showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique!'})
                return false;
            }
            
            $('#finan_catfilho_alertas').showMessageTarge({type: 'success', message: 'Categoria cadastrada'})
            
            $('#finan_catfilho_nome').val('');
            $('#finan_catfilho_status').prop('checked',true);
            buscaTodasCategoriasFilhos();
        });

        buscaTodasCategoriasFilhos();
        return false;
    });
    
    $('.open-app[data-title=FinanCategorias]').click(function (){
        buscaCategoriasPai();
        buscaTodasCategoriasFilhos();
    });
    
    //========== Modal =============== 
    
    $('#finan_catpai_edit').click(function(){
        buscaTodasCategoriasPai();
        $('#finan_catpai_modal').modal();
    });
    
    function buscaTodasCategoriasPai(){
        $.ajax({
            url: '/finan/categorias/buscaTodasCategoriasPai',
        }).done(function (result) {
            $('#finan_catpai_id').html('<option value="0">Nova...</option>');
            
            $(result).each(function (i, cada){
                $('#finan_catpai_id').append('<option data-status="'+cada.status+'" value="'+cada.id+'">'+cada.nome+'</option>');
            });
            
        });
    }
    
    $('#finan_catpai_id').on('change',function(){
        var nome = $(this).find('option:selected').html();
        var status = $(this).find('option:selected').attr('data-status');
        
        if($(this).val() > 0){
            $('#finan_catpai_nome').val(nome)
            $('#finan_catpai_status').prop('checked',(status=='A')?true:false);
        } else {
            $('#finan_catpai_nome').val('')
            $('#finan_catpai_status').prop('checked',true);
        }
        
    })
    
    $('#finan_catpai_form').submit(function () {

        if( ! $(this).form_podeenviar()){ return false }; 
        
        var nome = $(this).find('[name=nome]').val();

        if (nome.length < 1) {
            $('#finan_catpai_alertas').showMessageTarge({type: 'warning', message: 'O nome é obrigatório'})
            return false;
        }

        var id = $(this).find('[name=id]').val();
        var status = $(this).find('[name=status]').prop('checked') ? 'A' : 'I' ;
        
        $.ajax({
            url: '/finan/categorias/salvarCategoria',
            data: {
                id: (id>0)?id:null,
                nome: nome,
                status: status
            }
        }).done(function (result) {
            
            if( ! result.ok){
                $('#finan_catpai_alertas').showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique!'})
                return false;
            }
            
            $('#finan_catpai_alertas').showMessageTarge({type: 'success', message: 'Categoria cadastrada'})
            
            $('#finan_catpai_nome').val('');
            $('#finan_catpai_status').prop('checked',true);
            buscaTodasCategoriasPai();
            buscaCategoriasPai();
        });

        buscaTodasCategoriasPai();
        buscaTodasCategoriasFilhos();
        return false;
    });
    
    
});
