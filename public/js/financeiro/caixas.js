$(function () {
    
    function buscaTodosCaixas(){
        $.ajax({
            url: '/finan/caixas/buscaTodosCaixas',
        }).done(function (result) {
            $('#finan_lanc_modal_caixas_id').html('<option value="0">Novo...</option>');
            
            $(result).each(function (i, cada){
                $('#finan_lanc_modal_caixas_id').append('<option data-epadrao="'+cada.epadrao+'"  data-status="'+cada.status+'" value="'+cada.id+'">'+cada.nome+'</option>');
            });
            
            verificaCaixaPadrao();
            
        });
    }
   
    function verificaCaixaPadrao(){
        var tem_padrao = $('#finan_lanc_modal_caixas_id option[data-epadrao="S"]').length;
        var epadrao = $('#finan_lanc_modal_caixas_id option:selected').attr('data-epadrao')=='S';
        
        if(tem_padrao){
            
            $('#finan_lanc_modal_caixas_epadrao').prop('disabled',(epadrao)?false:true);
            
        } else {
            $('#finan_lanc_modal_caixas_epadrao').prop('disabled',false);
        }
    }
    
    $('#finan_lanc_modal_caixas_id').on('change',function(){
        var nome = $(this).find('option:selected').html();
        var status = $(this).find('option:selected').attr('data-status');
        var epadrao = $(this).find('option:selected').attr('data-epadrao');
        
        if($(this).val() > 0){
            $('#finan_lanc_modal_caixas_nome').val(nome)
            $('#finan_lanc_modal_caixas_epadrao').prop('checked',(epadrao=='S')?true:false);
            $('#finan_lanc_modal_caixas_status').prop('checked',(status=='A')?true:false);
        } else {
            $('#finan_lanc_modal_caixas_nome').val('')
            $('#finan_lanc_modal_caixas_epadrao').prop('checked',false);
            $('#finan_lanc_modal_caixas_status').prop('checked',true);
        }
        
        verificaCaixaPadrao();
        
    })
    
    $('#finan_lanc_modal_caixas_form').submit(function () {

        if( ! $(this).form_podeenviar()){ return false }; 
        
        var nome = $(this).find('[name=nome]').val();

        if (nome.length < 1) {
            $('#finan_lanc_modal_caixas_alertas').showMessageTarge({type: 'warning', message: 'O nome é obrigatório'})
            return false;
        }

        var id = $(this).find('[name=id]').val();
        var status = $(this).find('[name=status]').prop('checked') ? 'A' : 'I' ;
        var epadrao = $(this).find('[name=epadrao]').prop('checked') ? 'S' : 'N' ;
        
        $.ajax({
            url: '/finan/caixas/salvarCaixa',
            data: {
                id: (id>0)?id:null,
                nome: nome,
                status: status,
                epadrao: epadrao
            }
        }).done(function (result) {
            
            if( ! result.ok){
                $('#finan_lanc_modal_caixas_alertas').showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique!'})
                return false;
            }
            
            $('#finan_lanc_modal_caixas_alertas').showMessageTarge({type: 'success', message: 'Categoria cadastrada'})
            
            $('#finan_lanc_modal_caixas_nome').val('');
            $('#finan_lanc_modal_caixas_epadrao').prop('checked',false);
            $('#finan_lanc_modal_caixas_status').prop('checked',true);
            buscaTodosCaixas();
        });

        buscaTodosCaixas();
        return false;
    });
    
    $('.open-app[data-title=FinanCaixas]').click(function (){
        buscaTodosCaixas();
    });
   
});
