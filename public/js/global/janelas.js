/*configuracoes gerais (todas as telas)*/
function main() {
    
    $(function() {
        //ativa botão de fechar de cada janela
        $('button[title=Fechar] , button[data-title=Fechar]').click(function (){
            $(this).parents('.janela').hide();
        });

        //abre as janelas ao clicar no icone
        $('.btn-app, .open-app').click(function (){
            var nome_janela = $(this).attr('data-title').trim();
            $('.janela').filter('div[data-title="'+nome_janela+'"]').show();
        });

        //ativa janelas arrastaveis
        $('.janela')
            .draggable()
            .mousedown(function (){
                $('.ui-draggable').css({'z-index':100})
            });
    });
    
    
}

main();



