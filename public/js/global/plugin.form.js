
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
}(function ($) {

    $.extend($.fn, {

        form_podeenviar: function () {
            var valid = $(this).validate();
            for (var i in valid.invalid) { return false; }
            return true;
        },

        form_defaults: function () {
            var mask_names = {
                date: '00/00/0000',
                time: '00:00:00',
                date_time: '00/00/0000 00:00:00',
                cep: '00000-000',
                phone_without_ddd: '0000-0000',
                phone_old: '(00) 0000-0000',
                phone: '(00) 0000-0000',
                phone_us: '(000) 000-0000',
                mixed: 'AAA 000-S0S',
                cpf: '000.000.000-00',
                cnpj: '00.000.000/0000-00',
                money: '000.000.000.000.000,00',
                money2: "#.##0,00",
                ip_address: '099.099.099.099',
                percent: '##0,00%',
//            'clear-if-not-match':"00/00/0000", {clearIfNotMatch: true},
//            'placeholder':"00/00/0000", {placeholder: "__/__/____"},
//            'selectonfocus':"00/00/0000", {selectOnFocus: true},
            };
            var campos_texto = new Array('textarea, select, :input');
            $(this).each(function (i, form) {

                $(form).validate({
                    validClass: "success",
                    errorClass: 'danger',
                });

                var all_el = $(form).find(campos_texto.join())
                $(all_el).each(function (i, el) {
                    $(el.attributes).each(function (i, attr) {
                        switch (attr.name) {
                            case 'data-mask':
                                
                                var mask = (mask_names[attr.value]) ? mask_names[attr.value] : attr.value;
                                var options={};
                                
                                if (attr.value === 'phone') {
                                    mask = function (val) {
                                        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
                                    },
                                        options = {onKeyPress: function (val, e, field, options) { field.mask(mask.apply({}, arguments), options); }};
                                        
                                    $(el).rules('add', {minlength: 14, messages: {minlength: "Mínimo de 8 dígitos"}});
                                } else if(attr.value === 'money' || attr.value === 'money2' || attr.value === 'cpf' || attr.value === 'cnpj'){
                                    options = {reverse: true};
                                } 
                                
                                $(el).mask(mask, options);
                                break;
                            case 'data-filterinput':
                                var filter = (attr.value) ? attr.value : '[A-Za-zÀ-ú0-9]';
                                $(el).filter_input({regex: filter});
                                break;
                            case 'required':
                                $(el).rules('add', {
                                    required: true,
                                    messages: {required: "Campo obrigatório."},
                                });
                                break;
                        }
                    });

                });



            })
        },

        form_campovazio: function (campo) {
            if (campo) {
                valor = campo.value.replace(/ /g, '');
                valor = valor.toLowerCase();
                if (valor === '' || valor === 'null') {
                    return true;
                } else {
                    return false;
                }
            }
        }

    });

    return $;
}));

