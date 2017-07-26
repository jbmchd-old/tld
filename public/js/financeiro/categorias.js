$(function () {
    
    function buscaTodasCategorias(){
        $.ajax({
            url: '/finan/categorias/buscaTodasCategorias',
        }).done(function (result) {
            $('#finan_lanc_modal_cat_id').html('<option value="0">Nova...</option>');
            
            $(result).each(function (i, cada){
                $('#finan_lanc_modal_cat_id').append('<option data-status="'+cada.status+'" value="'+cada.id+'">'+cada.nome+'</option>');
            });
            
        });
    }
    
    $('#finan_lanc_modal_cat_id').on('change',function(){
        var nome = $(this).find('option:selected').html();
        var status = $(this).find('option:selected').attr('data-status');
        
        if($(this).val() > 0){
            $('#finan_lanc_modal_cat_nome').val(nome)
            $('#finan_lanc_modal_cat_status').prop('checked',(status=='A')?true:false);
        } else {
            $('#finan_lanc_modal_cat_nome').val('')
            $('#finan_lanc_modal_cat_status').prop('checked',true);
        }
        
    })
    
    $('#finan_lanc_modal_cat_form').submit(function () {

        if( ! $(this).form_podeenviar()){ return false }; 
        
        var nome = $(this).find('[name=nome]').val();

        if (nome.length < 1) {
            $('#finan_lanc_modal_cat_alertas').showMessageTarge({type: 'warning', message: 'O nome é obrigatório'})
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
                $('#finan_lanc_modal_cat_alertas').showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique!'})
                return false;
            }
            
            $('#finan_lanc_modal_cat_alertas').showMessageTarge({type: 'success', message: 'Categoria cadastrada'})
            
            $('#finan_lanc_modal_cat_nome').val('');
            $('#finan_lanc_modal_cat_status').prop('checked',true);
            buscaTodasCategorias();
        });

        buscaTodasCategorias();
        return false;
    });
    
    $('.open-app[data-title=FinanCategorias]').click(function (){
        buscaTodasCategorias();
    });
    
});
