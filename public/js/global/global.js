function main() {
    $(function () {
        /*
         * DEFAULTS
         */
        $('[data-toggle="tooltip"], [data-tooltip]').tooltip();
        $('[data-toggle="popover"], [data-popover]').popover();

        $('div.popover').is(':visible')

        // AJAX Defalts
        $.ajaxSetup({
            dataType: 'json',
            type: 'POST',
            beforeSend: function () {
                $().loading(true, this);
            },
            complete: function () {
                $().loading(false, this);
            },
//            complete:   function ()     { $().loading(false, this); $('.table').formatacao().tabela(); },
            error: function (error) {
                console.log(error);
            },
        });
        
//        /*
//         * RELACIONADOS AOS FORMULARIOS
//         */
         $('form').form_defaults()
         $('table').table_defaults()
        
//        $('div.tooltip').css('z-index','1000')
//        
//        //adiciona e ajusta inputs com data-tipo "date"
//        $.datepicker.setDefaults( $.datepicker.regional[ "pt-BR" ] );
//        $( "input[data-tipo=date]" )
//            .datepicker()
//            .attr('placeholder','__/__/____')
//            .mask("00/00/0000")
//            .keyup(function (){$(this).change()})
//            .click(function (){
//                $('#ui-datepicker-div').css({'z-index':100})
//            });

    });

    
}

main();



